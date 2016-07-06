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
     * static products
     */
    private $product_cola;

    private $product_bier;

    private $product_frohlunder;

    private $product_muntermate;

    /*
     * static offertypes
     */
    private $offertype_laden;

    private $offertype_haendler;

    private $offertype_sprecher;

    /*
     * static collmex products
     */
    private $collmex_product_cola;

    private $collmex_product_bier;

    private $collmex_product_frohlunder;

    private $collmex_product_muntermate;

    /*
     * static collmex offertypes
     */
    private $collmex_offertype_sprecher;

    private $collmex_offertype_laden;

    private $collmex_offertype_haendler;

    /*
     * Collmex connected flag
     */
    private $collmex_connected;

    public function initialize()
    {
        /*
         * collect recors as in db scheme static defined
         */
        $this->product_cola = Product::findFirst(1);
        $this->product_bier = Product::findFirst(2);
        $this->product_frohlunder = Product::findFirst(3);
        $this->product_muntermate = Product::findFirst(4);

        $this->offertype_laden = Offertype::findFirst(1);
        $this->offertype_haendler = Offertype::findFirst(2);
        $this->offertype_sprecher = Offertype::findFirst(3);

        /*
         * define group ids from collmex
         */
        $this->collmex_product_cola = 20;
        $this->collmex_product_bier = 21;
        $this->collmex_product_frohlunder = 29;
        $this->collmex_product_muntermate = 33;

        $this->collmex_offertype_laden = 8;
        $this->collmex_offertype_haendler = 9;
        $this->collmex_offertype_sprecher = 7;
    }

    private function collmexConnect() {

        if(!$this->collmex_connected) {

            try {
                // initialize HTTP client
                $collmexClient = new CurlClient($this->config->collmex->user, $this->config->collmex->password, $this->config->collmex->customer_id);

                // create request object
                $this->collmex = new Request($collmexClient);

                $this->collmex_connected = true;
            } catch (Exception $e) {
                $this->error('Verbindung zu collmex fehlgeschlagen.');
            }
        }
    }

    private function collmexCustomerGet() {

        $this->collmexConnect();

        try {
            $getCustomerType = new CustomerGet([]);

            // send HTTP request and get response object
            $collmexResponse = $this->collmex->send($getCustomerType->getCsv());

            if ($collmexResponse->isError()) {
                echo "Collmex error: " . $collmexResponse->getErrorMessage() . "; Code=" . $collmexResponse->getErrorCode() . PHP_EOL;
            } else {
                return $collmexResponse->getRecords();
            }
        } catch (Exception $e) {

            $this->error('Verbindung zu collmex fehlgeschlagen.');
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
        if($records = $this->collmexAddressGet()) {

            $new_records = 0;
            $updated_records = 0;
            $address_changes = 0;
            $unused_records = 0;

            foreach ($records as $record) {

                if ($data = $this->addressCleanup($record)) {

                    $item = null;

                    /*
                     * check if item exists by customer_id
                     * otherwise create new item
                     */
                    if ($item = Item::findFirst('collmex_address_id = ' . (int)$data['address_id'])) {
                        /*
                         * check if address is updatet set coordinates to null
                         * because while next geo update location will be recrawled
                         */
                        if (
                            $item->getStreet() != $data['street'] ||
                            $item->getZip() != preg_replace('/[^0-9]/', '', $data['zip']) ||
                            $item->getCity() != $data['city']
                        ) {
                            $item->setGeolocateCount(0);
                            $item->setLat(null);
                            $item->setLng(null);

                            $address_changes++;
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
                        $item->setEmail($email);
                    }

                    /*
                     * save values in model object
                     */
                    $item->setCountry($data['country']);
                    $item->setStreet($data['street']);
                    $item->setZip(preg_replace('/[^0-9]/', '', $data['zip']));
                    $item->setCity($data['city']);
                    $item->setCollmexAddressId((int)$data['address_id']);
                    $item->setName($data['name']);
                    $item->setWeb($data['web']);

                    $item->deleteOffertypes();
                    $item->deleteProducts();

                    /*
                     * Map Offertypes and Products from collmex to Db
                     */
                    if($offertypes = $this->mapOffertypes($data['address_group'])) {
                        $item->setOffertypes($offertypes);
                    }
                    /*
                     * if item has no offertypes delete it
                     */
                    else {
                        $unused_records++;
                        $item->delete();
                        continue;
                    }

                    if($products = $this->mapProducts($data['address_group'])) {
                        $item->setProducts($products);
                    }

                    /*
                     * Save all the funny stuff
                     */
                    if (!$item->save()) {
                        $this->error('could not save item address_id => ' . $data['customer_id']);
                    }
                }
            }

            echo PHP_EOL;

            echo $new_records . ' new Map Items' . PHP_EOL;
            echo $updated_records . ' Items Updated' . PHP_EOL;
            echo $address_changes . ' Address changes' . PHP_EOL;
            echo $unused_records . ' unused Records' . PHP_EOL;
        }
    }

    public function mapProducts($collmex_group_ids) {

        $out = [];

        if(isset($collmex_group_ids[$this->collmex_product_cola])) {
            $out[] = $this->product_cola;
        }

        if(isset($collmex_group_ids[$this->collmex_product_bier])) {
            $out[] = $this->product_bier;
        }

        if(isset($collmex_group_ids[$this->collmex_product_frohlunder])) {
            $out[] = $this->product_frohlunder;
        }

        if(isset($collmex_group_ids[$this->collmex_product_muntermate])) {
            $out[] = $this->product_muntermate;
        }

        return $out;
    }

    public function mapOffertypes($collmex_group_ids) {

        $out = [];

        if(isset($collmex_group_ids[$this->collmex_offertype_laden])) {
            $out[] = $this->offertype_laden;
        }

        if(isset($collmex_group_ids[$this->collmex_offertype_haendler])) {
            $out[] = $this->offertype_haendler;
        }

        if(isset($collmex_group_ids[$this->collmex_offertype_sprecher])) {
            $out[] = $this->offertype_sprecher;
        }

        return $out;
    }
    
    /*
     * CLI action updating geo coordinates only
     */
    public function geoAction() {
        
        if($items = Item::find('geolocate_count < 20')) {
            
            $new_updated_items = 0;
            $faled_items = 0;
            
            foreach ($items as $item) {
                if(((int)$item->lat == 0) || ((int)$item->lng == 0)) {
                    
                    $item->geolocate_count = (int)$item->geolocate_count+1;

                    $address_string = $item->street . ', ' . $item->zip . ', ' . $item->city . $this->countryMapper($item->country);

                    /*
                     * change address string to city when offertype is only speaker
                     */

                    if(count($item->offertypes) == 1 && $item->offertypes[0]->id == $this->offertype_sprecher->id) {

                        $address_string = $item->zip . ', ' . $item->city .  $this->countryMapper($item->country);

                    } else
                    {
                        continue;
                    }

                    if($geo = $this->getCoordinates($address_string)) {
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
            
            echo PHP_EOL;
            
            echo $new_updated_items . ' successful crawled :)' . PHP_EOL;
            echo $faled_items . ' not locateable' . PHP_EOL;
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
    private function addressCleanup($data) {

        // check is basic fields are exists
        if(!isset($data['city']) || !isset($data['zip']) || !isset($data['address_id'])) {
            return false;
        }

        /*
         * Check Address Group Field
         */
        $data['address_group'] = $this->checkAddressGroups($data);

        if(!$data['address_group']) {
            return false;
        }

        /*
         * typecast Address Id
         */
        $data['address_id'] = (int)$data['address_id'];

        /*
         * fill name Field
         */
        $name = '';
        if(isset($data['name'])) {
            $name = trim($data['name'].'');
        }
        

        if($name == '' && isset($data['firstname']) && isset($data['surname'])) {
            $name = trim($data['firstname'].' ' . $data['surname']);
        }
        
        if(substr($name, 0,1) == '"' && substr($name, -1) == '"') {
            $name = substr($name, 1, -1);
        }
        $data['name'] = $name;

        /*
         * cleanup web address field
         */
        $data['web'] = trim($data['web']);
        if($data['web'] != '') {
            $data['web'] = $this->addhttp($data['web']);
        }

        return $data;
        
    }

    /*
     * parse csv simple value to array
     * then check if item is map item
     */
    private function checkAddressGroups($record) {

        $tmp = explode(',',$record['address_group']);

        $groups = [];
        foreach ($tmp as $key => $value) {
            $groups[(int)$value] = (int)$value;
        }

        // todo: address group check before insert

        if(empty($groups)) {
            return false;
        }

        return $groups;
    }
}