<?php

    $router = new \Phalcon\Mvc\Router();

    $router->add('/', [      
        'controller' => 'index',
        'action' => 'index',
    ]);

    /*
     * API Calls
     */
    $router->add('/api/item/list', [       
        'controller' => 'item',
        'action' => 'list',
    ]);
    
    /*
     * Not found 404 route
     */
    $router->notFound([
        'controller' => 'index',
        'action' => 'route404'
    ]);