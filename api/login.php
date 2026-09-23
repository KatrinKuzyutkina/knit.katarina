<?php

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Метод не поддерживается'], 405);
}

start_app_session();
$data = read_json_body();

$email = trim((string) ($data['email'] ?? ''));
$password = (string) ($data['password'] ?? '');

if ($email === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Введите email и пароль'], 400);
}

$pdo = db_connect();
$stmt = $pdo->prepare('SELECT id, name, email, phone, password_hash, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([mb_strtolower($email)]);
$row = $stmt->fetch();

if (!$row || !password_verify($password, $row['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Неверный email или пароль'], 401);
}

$user = public_user($row);
$_SESSION['user'] = $user;

json_response(['ok' => true, 'user' => $user]);
