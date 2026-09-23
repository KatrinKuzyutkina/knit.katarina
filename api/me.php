<?php

require __DIR__ . '/bootstrap.php';

start_app_session();

if (empty($_SESSION['user'])) {
    json_response(['ok' => false, 'user' => null], 401);
}

json_response(['ok' => true, 'user' => $_SESSION['user']]);
