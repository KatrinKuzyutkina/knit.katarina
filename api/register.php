<?php

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Метод не поддерживается'], 405);
}

start_app_session();
$data = read_json_body();

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$password = (string) ($data['password'] ?? '');

if ($name === '' || $email === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Заполните имя, email и пароль'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Некорректный email'], 400);
}

if (mb_strlen($password) < 4) {
    json_response(['ok' => false, 'error' => 'Пароль должен быть не короче 4 символов'], 400);
}

$pdo = db_connect();

$check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$check->execute([mb_strtolower($email)]);
if ($check->fetch()) {
    json_response(['ok' => false, 'error' => 'Пользователь с таким email уже есть'], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$insert = $pdo->prepare(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)'
);

try {
    $insert->execute([
        $name,
        mb_strtolower($email),
        $phone !== '' ? $phone : null,
        $hash,
        'user',
    ]);
} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => 'Не удалось создать аккаунт'], 500);
}

$userId = (int) $pdo->lastInsertId();
$user = [
    'id' => $userId,
    'name' => $name,
    'email' => mb_strtolower($email),
    'phone' => $phone,
    'role' => 'user',
];

$_SESSION['user'] = $user;

json_response(['ok' => true, 'user' => $user]);
