<?php

    $router = new \Phalcon\Mvc\Router();

    $router->add('/', [      
        'controller' => 'index',
        'action' => 'index',
    ]);

    /*
     * API Call to get list of geolocations
     */
    $router->addGet('/item/list', [       
        'controller' => 'item',
        'action' => 'apiList',
    ]);
    
    /*
     * get one item
     */
    $router->addGet('/item/:int', [
        'controller' => 'item',
        'action' => 'apiGet',
        'id' => 1
    ]);
    
    /*
     * Not found 404 route
     */
    $router->notFound([
        'controller' => 'index',
        'action' => 'route404'
    ]);