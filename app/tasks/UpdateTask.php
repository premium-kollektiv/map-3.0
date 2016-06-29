<?php
use \MarcusJaschen\Collmex\Client\Curl as CurlClient;
use \MarcusJaschen\Collmex\Request;
use \MarcusJaschen\Collmex\Type\CustomerGet;

use Phalcon\Config;

class UpdateTask extends BaseTask
{
    /*
     * Collmex request Object
     */
    private $collmex;

    /*
     * Collmex connected flag
     */
    private $collmex_connected;

    private function collmexConnect() {

        if(!$this->collmex_connected) {
            // initialize HTTP client
            $collmexClient = new CurlClient($this->config->collmex->user, $this->config->collmex->password, $this->config->collmex->customer_id);

            // create request object
            $this->collmex = new Request($collmexClient);

            $this->collmex_connected = true;
        }
    }

    private function collmexGetCustomer() {

        $this->collmexConnect();

        $getCustomerType = new CustomerGet([]);

        // send HTTP request and get response object
        $collmexResponse = $this->collmex->send($getCustomerType->getCsv());

        if ($collmexResponse->isError()) {
            echo "Collmex error: " . $collmexResponse->getErrorMessage() . "; Code=" . $collmexResponse->getErrorCode() . PHP_EOL;
        } else {
            return $collmexResponse->getRecords();
        }

        return false;
    }

    /**
     * Main Action will check all collmex customers and update them in mysql db
     * when address has changed geolocation will be set tu null
     */
    public function mainAction()
    {
        /*
         * get all customers from collmex
         */
        if($records = $this->collmexGetCustomer()) {

            $new_records = 0;
            $updated_records = 0;

            foreach ($records as $record) {

                if ($data = $this->dataCleanup($record->getData())) {
                    //echo $data['customer_id'] . ' ' . $data['name'] . ' ';
                    $item = false;

                    /*
                     * check if item exists by customer_id
                     * otherwise create new item
                     */
                    if ($item = Item::findFirst('collmex_customer_id = ' . (int)$data['customer_id'])) {
                        /*
                         * check if address is updatet set coordinates to null
                         * because while next geo update location will be recrawled
                         */
                        if (
                            $item->street != $data['street'] ||
                            $item->zip != preg_replace('/[^0-9]/', '', $data['zipcode']) ||
                            $item->city != $data['city']
                        ) {
                            $item->setGeolocateCount(0);
                            $item->setLat(null);
                            $item->setLng(null);
                        }

                        $updated_records++;

                    } else {
                        $item = new Item();
                        $new_records++;
                    }

                    /*
                     * Clean Email Field
                     */
                    $email = '';

                    if (strpos($data['email'], ',') !== false) {
                        $emails = explode(',', $data['email']);
                        $email = trim($emails[0]);
                    } else {
                        $email = trim($data['email']);
                    }

                    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $item->setEmail($data['email']);
                    }

                    $item->setCountry($data['country']);
                    $item->setStreet($data['street']);
                    $item->setZip(preg_replace('/[^0-9]/', '', $data['zipcode']));
                    $item->setCity($data['city']);
                    $item->setCollmexCustomerId((int)$data['customer_id']);
                    $item->setName($data['name']);

                    if (!$item->save()) {
                        echo 'Fehler: cid => ' . $data['customer_id'] . "\n";
                    }
                }
            }

            echo "\n";

            echo $new_records . ' new Map Items' . "\n";
            echo $updated_records . ' Items Updated' . "\n";
        }
    }
    
    /*
     * CLI action updating geo coordinates only
     */
    public function geoAction() {
        
        if($items = Item::find('geolocate_count < 10')) {
            
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

    /*
     * only for tests dump all data to csv
     */
    public function dumpAction() {

        $fp = fopen('./collmex_data.csv', 'w');

        if($records = $this->collmexGetCustomer()) {
            $i = 0;
            foreach ($records as $r) {

                $data = (array)$r->getData();

                if($i==0) {
                    $titles = [];
                    foreach ($data as $title => $value) {
                        $titles[] = $title;
                    }
                    fputcsv($fp, $titles);
                }
                fputcsv($fp, $data);
                $i++;
            }
        }

        fclose($fp);
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