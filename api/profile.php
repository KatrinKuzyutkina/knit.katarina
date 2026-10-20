<?php

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Метод не поддерживается'], 405);
}

start_app_session();

if (empty($_SESSION['user']['id'])) {
    json_response(['ok' => false, 'error' => 'Нужно войти в аккаунт'], 401);
}

$data = read_json_body();
$userId = (int) $_SESSION['user']['id'];

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$password = (string) ($data['password'] ?? '');

if ($name === '' || $email === '') {
    json_response(['ok' => false, 'error' => 'Имя и email обязательны'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Некорректный email'], 400);
}

if ($password !== '' && mb_strlen($password) < 4) {
    json_response(['ok' => false, 'error' => 'Пароль должен быть не короче 4 символов'], 400);
}

$pdo = db_connect();

$check = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1');
$check->execute([mb_strtolower($email), $userId]);
if ($check->fetch()) {
    json_response(['ok' => false, 'error' => 'Этот email уже занят'], 409);
}

if ($password !== '') {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare(
        'UPDATE users SET name = ?, email = ?, phone = ?, password_hash = ? WHERE id = ?'
    );
    $stmt->execute([
        $name,
        mb_strtolower($email),
        $phone !== '' ? $phone : null,
        $hash,
        $userId,
    ]);
} else {
    $stmt = $pdo->prepare(
        'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?'
    );
    $stmt->execute([
        $name,
        mb_strtolower($email),
        $phone !== '' ? $phone : null,
        $userId,
    ]);
}

$user = [
    'id' => $userId,
    'name' => $name,
    'email' => mb_strtolower($email),
    'phone' => $phone,
    'role' => $_SESSION['user']['role'] ?? 'user',
];

$_SESSION['user'] = $user;

json_response(['ok' => true, 'user' => $user]);
