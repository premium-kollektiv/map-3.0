<?php
use \MarcusJaschen\Collmex\Client\Curl as CurlClient;
use \MarcusJaschen\Collmex\Request;
use \MarcusJaschen\Collmex\Type\CustomerGet;

use Phalcon\Config;

class UpdateTask extends \Phalcon\Cli\Task
{
    public function mainAction()
    {
        // initialize HTTP client
        $collmexClient = new CurlClient($this->config->collmex->user, $this->config->collmex->password, $this->config->collmex->customer_id);

        // create request object
        $collmexRequest = new Request($collmexClient);
        
        $getCustomerType = new CustomerGet([]);
    
        // send HTTP request and get response object
        $collmexResponse = $collmexRequest->send($getCustomerType->getCsv());
        echo '<pre>';
        if ($collmexResponse->isError()) {
            echo "Collmex error: " . $collmexResponse->getErrorMessage() . "; Code=" . $collmexResponse->getErrorCode() . PHP_EOL;
        } else {
            $records = $collmexResponse->getRecords();

            foreach ($records as $record) {
                print_r($record->getData()); // contains one Customer object and the Message object(s)
            }
        }
   
        die();
    }
}