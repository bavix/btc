<?php

if ($_SERVER['REQUEST_URI'] !== $_SERVER['SCRIPT_NAME'])
{
    header('location: /api.php', true, 301);
    die;
}

header('Cache-Control: no-cache, no-store, must-revalidate');
header('Content-Type: application/json');
header('Pragma: no-cache');
header('Expires: 0');

echo \file_get_contents(
    'https://hm.babichev.net/api/v1.1/currencies?q=USDT_BTC&r=' . \random_int(PHP_INT_MIN, PHP_INT_MAX)
);
