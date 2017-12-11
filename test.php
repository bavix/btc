<?php

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
                        'col1' => \random_int(13000, 17000),
                        'col2' => \date('d/m/Y'),
                        'col3' => \date('h:ia'),
                    ],
                ],
            ],
        ],
    ],
]);
