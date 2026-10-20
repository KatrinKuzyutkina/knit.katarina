<?php

require __DIR__ . '/bootstrap.php';

start_app_session();

if (empty($_SESSION['user']['id'])) {
    json_response(['ok' => false, 'error' => 'Нужно войти в аккаунт'], 401);
}

$userId = (int) $_SESSION['user']['id'];
$pdo = db_connect();

function ensure_favorites_table(PDO $pdo): void
{
    static $ready = false;
    if ($ready) {
        return;
    }

    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS favorites (
              id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              product_id INT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              UNIQUE KEY uniq_user_product (user_id, product_id),
              KEY idx_favorites_user (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
    } catch (PDOException $e) {
        // таблица могла уже существовать в другом виде — продолжаем
    }

    $ready = true;
}

function favorites_list(PDO $pdo, int $userId): array
{
    $stmt = $pdo->prepare(
        'SELECT product_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC, id DESC'
    );
    $stmt->execute([$userId]);
    return array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN));
}

ensure_favorites_table($pdo);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    json_response([
        'ok' => true,
        'favorites' => favorites_list($pdo, $userId),
    ]);
}

if ($method === 'POST') {
    $data = read_json_body();
    $action = (string) ($data['action'] ?? 'toggle');

    if ($action === 'sync') {
        $ids = $data['product_ids'] ?? [];
        if (!is_array($ids)) {
            $ids = [];
        }

        $ins = $pdo->prepare(
            'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)'
        );
        foreach ($ids as $rawId) {
            $productId = (int) $rawId;
            if ($productId > 0) {
                $ins->execute([$userId, $productId]);
            }
        }

        json_response([
            'ok' => true,
            'favorites' => favorites_list($pdo, $userId),
        ]);
    }

    $productId = (int) ($data['product_id'] ?? 0);
    if ($productId <= 0) {
        json_response(['ok' => false, 'error' => 'Некорректный товар'], 400);
    }

    $check = $pdo->prepare(
        'SELECT id FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1'
    );
    $check->execute([$userId, $productId]);
    $existing = $check->fetch();

    if ($existing) {
        $del = $pdo->prepare(
            'DELETE FROM favorites WHERE user_id = ? AND product_id = ?'
        );
        $del->execute([$userId, $productId]);
        $isFavorite = false;
    } else {
        $ins = $pdo->prepare(
            'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)'
        );
        $ins->execute([$userId, $productId]);
        $isFavorite = true;
    }

    json_response([
        'ok' => true,
        'isFavorite' => $isFavorite,
        'favorites' => favorites_list($pdo, $userId),
    ]);
}

json_response(['ok' => false, 'error' => 'Метод не поддерживается'], 405);
