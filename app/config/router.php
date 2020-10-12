<?php

    $router = new \Phalcon\Mvc\Router();

    $router->add('/search/:params',[
        'controller' => 'item',
        'action' => 'apiSearch',
        'string' => 1
    ]);

    /*
     * API Call to get list of geolocations
     */
    $router->addGet('/item/list', [       
        'controller' => 'item',
        'action' => 'apiList',
    ]);

    /*
     * API Call to get all items
     */
    $router->addGet('/item/all', [       
        'controller' => 'item',
        'action' => 'getAll',
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
     * feedback form
     */
    $router->addPost('/feedback',[
        'controller' => 'feedback',
        'action' => 'zipmail'
    ]);

    /*
     * Not found 404 route
     */
    $router->notFound([
        'controller' => 'index',
        'action' => 'route404'
    ]);