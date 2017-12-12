<?php

session_start();

$_btc = 16000;
$_eth = 500;
$_ltc = 250;

if (!isset($_SESSION['btc']))
{
    $_SESSION['btc'] = $_btc;
    $_SESSION['eth'] = $_eth;
    $_SESSION['ltc'] = $_ltc;
}

foreach ($_SESSION as $key => $value) {
    if (isset(${'_' . $key}) && $value < (${'_' . $key} / 10)) {
        $_SESSION[$key] = ${'_' . $key};
    }
}

\date_default_timezone_set('Europe/Moscow');

echo \json_encode([
    'status' => 200,
    'data'   => [
        'query' => [
            'count'   => 1,
            'created' => '2017-12-11T15:21:56Z',
            'lang'    => 'en-US',
            'results' => [
                [
                    'row' => [
                        'col0' => 'Bitcoin',
                        'col1' => $_SESSION['btc'] += random_int(-50, 50),
                        'col2' => \date('d/m/Y'),
                        'col3' => \date('h:ia'),
                    ],
                ],
                [
                    'row' => [
                        'col0' => 'Ethereum',
                        'col1' => $_SESSION['eth'] += random_int(-10, 10),
                        'col2' => \date('d/m/Y'),
                        'col3' => \date('h:ia'),
                    ],
                ],
                [
                    'row' => [
                        'col0' => 'Litecoin',
                        'col1' => $_SESSION['ltc'] += random_int(-5, 5),
                        'col2' => \date('d/m/Y'),
                        'col3' => \date('h:ia'),
                    ],
                ],
            ],
        ],
    ],
]);
