<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    public function jsonResponse($data, $status = 1) {
        
        $return = [
            'status' => $status,
            'data' => $data
        ];
        
        $this->view->disable();

        //Create a response instance
        $response = new \Phalcon\Http\Response();
        
        $response->setContentType('application/json', 'UTF-8');

        //Set the content of the response
        $response->setContent(json_encode($return));

        //Return the response
        return $response;
    }
}
