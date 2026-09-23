<?php

require __DIR__ . '/bootstrap.php';

start_app_session();

if (empty($_SESSION['user']) || ($_SESSION['user']['role'] ?? '') !== 'admin') {
    json_response(['ok' => false, 'error' => 'Нет доступа'], 403);
}

$pdo = db_connect();
$stmt = $pdo->query('SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC');
$users = $stmt->fetchAll();

json_response([
    'ok' => true,
    'users' => array_map(static function ($row) {
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'] ?? '',
            'role' => $row['role'],
            'createdAt' => $row['created_at'],
        ];
    }, $users),
]);
