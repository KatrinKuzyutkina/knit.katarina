<?php
// Быстрая проверка подключения. Откройте: http://localhost:8000/api/ping.php
require __DIR__ . '/bootstrap.php';
try {
    $pdo = db_connect();
    $pdo->query('SELECT 1');
    $tables = $pdo->query("SHOW TABLES LIKE 'users'")->fetch();
    json_response([
        'ok' => true,
        'message' => 'База подключена',
        'users_table' => (bool) $tables,
    ]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage()], 500);
}
