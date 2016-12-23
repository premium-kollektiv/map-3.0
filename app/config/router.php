<?php

    $router = new \Phalcon\Mvc\Router();

    $router->add('/', [      
        'controller' => 'index',
        'action' => 'index',
    ]);

    $router->add('/:int', [
        'controller' => 'index',
        'action' => 'index',
        'id'=> 1
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
     * feedback form
     */
    $router->addPost('/feedback',[
        'controller' => 'feedback',
        'action' => 'zipmail'
    ]);

    /*
     * feedback update update zip dependencies
     */
    $router->addPost('/feedback/update',[
        'controller' => 'feedback',
        'action' => 'update'
    ]);
    
    /*
     * Not found 404 route
     */
    $router->notFound([
        'controller' => 'index',
        'action' => 'route404'
    ]);