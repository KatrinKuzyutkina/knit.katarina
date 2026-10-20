<?php

require __DIR__ . '/bootstrap.php';

start_app_session();

function ensure_reviews_table(PDO $pdo): void
{
    static $ready = false;
    if ($ready) {
        return;
    }
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS reviews (
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              author_name VARCHAR(100) NOT NULL,
              rating TINYINT NOT NULL DEFAULT 5,
              item VARCHAR(150) DEFAULT NULL,
              text TEXT NOT NULL,
              photos MEDIUMTEXT DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              KEY idx_reviews_created (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        // Для уже созданной таблицы добавляем колонку фото
        $col = $pdo->query("SHOW COLUMNS FROM reviews LIKE 'photos'");
        if ($col && $col->fetch() === false) {
            $pdo->exec("ALTER TABLE reviews ADD COLUMN photos MEDIUMTEXT DEFAULT NULL AFTER text");
        }
    } catch (PDOException $e) {
        // таблица могла уже существовать в другом виде — продолжаем
    }

    $ready = true;
}

function clean_review_photos($raw): array
{
    if (!is_array($raw)) {
        return [];
    }
    $photos = [];
    foreach ($raw as $photo) {
        if (!is_string($photo)) {
            continue;
        }
        $photo = trim($photo);
        // Разрешаем только встроенные картинки и локальные пути/URL картинок
        $isDataImage = str_starts_with($photo, 'data:image/');
        $isPath = (bool) preg_match('~^(images/|https?://)~', $photo);
        if (!$isDataImage && !$isPath) {
            continue;
        }
        if (strlen($photo) > 900000) {
            continue;
        }
        $photos[] = $photo;
        if (count($photos) >= 4) {
            break;
        }
    }
    return $photos;
}

function reviews_list(PDO $pdo): array
{
    $stmt = $pdo->query(
        'SELECT id, user_id, author_name, rating, item, text, photos, created_at
         FROM reviews
         ORDER BY created_at DESC, id DESC
         LIMIT 100'
    );
    $rows = $stmt->fetchAll();

    return array_map(static function (array $row): array {
        $photos = [];
        if (!empty($row['photos'])) {
            $decoded = json_decode((string) $row['photos'], true);
            if (is_array($decoded)) {
                $photos = clean_review_photos($decoded);
            }
        }
        return [
            'id' => 'REV-' . (int) $row['id'],
            'userId' => (int) $row['user_id'],
            'authorName' => $row['author_name'],
            'rating' => max(1, min(5, (int) $row['rating'])),
            'item' => $row['item'] ?? '',
            'text' => $row['text'],
            'photos' => $photos,
            'createdAt' => $row['created_at'],
        ];
    }, $rows);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Читать отзывы могут все, в том числе без авторизации
    $pdo = db_connect();
    ensure_reviews_table($pdo);
    json_response([
        'ok' => true,
        'reviews' => reviews_list($pdo),
    ]);
}

if ($method === 'POST') {
    // Писать и удалять отзывы могут только авторизованные пользователи
    if (empty($_SESSION['user']['id'])) {
        json_response(['ok' => false, 'error' => 'Чтобы оставить отзыв, войдите в аккаунт'], 401);
    }

    $data = read_json_body();
    $action = (string) ($data['action'] ?? 'create');

    if ($action === 'delete') {
        // Удалить можно только свой отзыв
        $rawId = (string) ($data['id'] ?? '');
        $reviewId = (int) preg_replace('/\D+/', '', $rawId);
        if ($reviewId <= 0) {
            json_response(['ok' => false, 'error' => 'Некорректный отзыв'], 400);
        }

        $pdo = db_connect();
        ensure_reviews_table($pdo);

        $del = $pdo->prepare('DELETE FROM reviews WHERE id = ? AND user_id = ?');
        $del->execute([$reviewId, (int) $_SESSION['user']['id']]);

        if ($del->rowCount() === 0) {
            json_response(['ok' => false, 'error' => 'Можно удалить только свой отзыв'], 403);
        }

        json_response([
            'ok' => true,
            'reviews' => reviews_list($pdo),
        ]);
    }

    $rating = (int) ($data['rating'] ?? 5);
    if ($rating < 1 || $rating > 5) {
        json_response(['ok' => false, 'error' => 'Оценка должна быть от 1 до 5'], 400);
    }

    $item = trim((string) ($data['item'] ?? ''));
    if (mb_strlen($item) > 150) {
        $item = mb_substr($item, 0, 150);
    }

    $text = trim((string) ($data['text'] ?? ''));
    if (mb_strlen($text) < 3) {
        json_response(['ok' => false, 'error' => 'Напишите текст отзыва'], 400);
    }
    if (mb_strlen($text) > 2000) {
        $text = mb_substr($text, 0, 2000);
    }

    $photos = clean_review_photos($data['photos'] ?? []);

    $userId = (int) $_SESSION['user']['id'];
    $authorName = trim((string) ($_SESSION['user']['name'] ?? 'Покупатель'));
    if ($authorName === '') {
        $authorName = 'Покупатель';
    }

    $pdo = db_connect();
    ensure_reviews_table($pdo);

    $insert = $pdo->prepare(
        'INSERT INTO reviews (user_id, author_name, rating, item, text, photos) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $insert->execute([
        $userId,
        $authorName,
        $rating,
        $item !== '' ? $item : null,
        $text,
        $photos ? json_encode($photos, JSON_UNESCAPED_SLASHES) : null,
    ]);

    json_response([
        'ok' => true,
        'reviews' => reviews_list($pdo),
    ]);
}

json_response(['ok' => false, 'error' => 'Метод не поддерживается'], 405);
