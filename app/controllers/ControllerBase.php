<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    public $mail_transport;
    public $mail_from;
    public $mail_loaded;
    public $mail_mailer;

    public function loadMailer() {

        if($this->mail_loaded !== true) {

            require_once '../vendor/autoload.php';

            $this->mail_from = $this->config->smtp->from;

            $this->mail_transport = Swift_SmtpTransport::newInstance($this->config->smtp->host, 25)
                ->setUsername($this->config->smtp->user)
                ->setPassword($this->config->smtp->pass)
            ;
            $this->mail_mailer = Swift_Mailer::newInstance($this->mail_transport);
            $this->mail_loaded = true;
        }


    }

    public function mail($to, $subject, $body, $from = false) {

        if(!is_array($to)){
            $to = [$to];
        }

        if($from === false) {
            $from = $this->mail_from;
        }

        $this->loadMailer();

        $message = Swift_Message::newInstance($subject)
            ->setFrom($from)
            ->setTo($to)
            ->setBody($body)
        ;

        $result = $this->mail_mailer->send($message);

    }


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
    
    public function jsonResponseError($message = false) {
        return $this->jsonResponse([
            'msg' => $message
        ],0);
    }
}
