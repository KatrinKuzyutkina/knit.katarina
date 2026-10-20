<?php

require __DIR__ . '/bootstrap.php';

$pdo = db_connect();

$pdo->exec("
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_product (user_id, product_id),
  KEY idx_favorites_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$adminEmail = 'admin@knit.katarina';
$adminName = 'Катерина';
$adminPassword = 'Admin123!';

$check = $pdo->prepare('SELECT id, role FROM users WHERE email = ? LIMIT 1');
$check->execute([$adminEmail]);
$existing = $check->fetch();

if (!$existing) {
    $hash = password_hash($adminPassword, PASSWORD_DEFAULT);
    $insert = $pdo->prepare(
        'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    );
    $insert->execute([$adminName, $adminEmail, null, $hash, 'admin']);
} elseif (($existing['role'] ?? '') !== 'admin') {
    $update = $pdo->prepare('UPDATE users SET role = ? WHERE id = ?');
    $update->execute(['admin', (int) $existing['id']]);
}

json_response([
    'ok' => true,
    'message' => 'Таблицы users, favorites и reviews готовы. Аккаунт администратора создан.',
    'admin' => [
        'email' => $adminEmail,
        'password' => $adminPassword,
        'name' => $adminName,
    ],
]);
