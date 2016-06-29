<?php
use \MarcusJaschen\Collmex\Client\Curl as CurlClient;
use \MarcusJaschen\Collmex\Request;
use \MarcusJaschen\Collmex\Type\CustomerGet;

use Phalcon\Config;

class UpdateTask extends BaseTask
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
        
        if ($collmexResponse->isError()) {
            echo "Collmex error: " . $collmexResponse->getErrorMessage() . "; Code=" . $collmexResponse->getErrorCode() . PHP_EOL;
        } else {
            $records = $collmexResponse->getRecords();

            foreach ($records as $record) {
                
                if( $data = $this->dataCleanup($record->getData()) )
                {
                    echo $data['customer_id'] . ' ' . $data['name'] . ' ';
                    $item = false;
                    
                    $item = Item::findFirst('collmex_customer_id = ' . $data['customer_id']);
                    
                    if(!$item) {
                        $item = new Item();
                        
                        
                        $item->geolocate_count = (int)$item->geolocate_count+1;
                        if($geo = $this->getCoordinates($data['street'] . ', ' . $data['zipcode'] . ', ' . $data['city'] . $this->countryMapper($data['country']))) {
                            $item->setLat($geo['lat']);
                            $item->setLng($geo['lng']);
                        }
                        
                        echo '*NEW*' ;
                    }
                    
                    /*
                     * Clean Email Field
                     */
                    $email = '';
                    
                    if(strpos($data['email'], ',') !== false) {
                        $emails = explode(',', $data['email']);
                        $email = trim($emails[0]);
                    }
                    else {
                        $email = trim($data['email']);
                    }
                    
                    if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $item->setEmail($data['email']);
                    }
                    
                    
                    $item->setCountry($data['country']);
                    $item->setStreet($data['street']);
                    $item->setZip(preg_replace('/[^0-9]/', '', $data['zipcode']));
                    $item->setCity($data['city']);
                    $item->setCollmexCustomerId((int)$data['customer_id']);
                    $item->setName($data['name']);

                    if(!$item->save()) {
                        echo 'Fehler: cid => ' . $data['customer_id'];
                    }
                    
                    echo "\n";
                }
            }
        }
    }
    
    /*
     * CLI action updating geo coordinates only
     */
    public function geoAction() {
        
        if($items = Item::find()) {
            
            $new_updated_items = 0;
            $faled_items = 0;
            
            foreach ($items as $item) {
                if(((int)$item->lat == 0) || ((int)$item->lng == 0)) {
                    
                    $item->geolocate_count = (int)$item->geolocate_count+1;
                    
                    if($geo = $this->getCoordinates($item->street . ', ' . $item->zip . ', ' . $item->city . $this->countryMapper($item->country))) {
                        $item->setLat($geo['lat']);
                        $item->setLng($geo['lng']);
                        
                        echo ".";
                        $new_updated_items++;
                    }
                    else {
                        $faled_items++;
                    }
                    
                    $item->save();
                } 
            }
            
            echo "\n";
            
            echo $new_updated_items . ' successful crawled :)' . "\n";
            echo $faled_items . ' not locateable' . "\n";
        }
        
    }
    
    /**
     * Check Collmex Data before save it to the database
     * 
     * @param Collmex DataArray $data
     * @return boolean
     * 
     */
    private function dataCleanup($data) {
        
        if(!isset($data['city']) || !isset($data['zipcode']) || !isset($data['customer_id'])) {
            return false;
        }
        
        $data['customer_id'] = (int)$data['customer_id'];
        
        $name = '';
        if(isset($data['firm'])) {
            $name = trim($data['firm'].'');
        }
        

        if($name == '' && isset($data['forename']) && isset($data['lastname'])) {
            $name = trim($data['forename'].' ' . $data['lastname']);
        }
        
        if(substr($name, 0,1) == '"' && substr($name, -1) == '"') {
            $name = substr($name, 1, -1);
        }
        
        $data['name'] = $name;

        return $data;
        
    }
}