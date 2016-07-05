<?php

class BaseTask extends \Phalcon\Cli\Task 
{
    public $collmex_curl;

    public function countryMapper($country) {
        
        $country = trim($country);
        
        $countrys = [
            'DE' => 'Deutschland',
            'AT' => 'Österreich',
            'CH' => 'Schweiz'
        ];
        
        if(isset($countrys[$country])) {
            return ', ' . $countrys[$country];
        }
        
        return $country;
    }
    
    /**
     * Method try to locate address through google maps api
     * 
     * @param type $address
     * @return type
     */
    public function getCoordinates($address){
 
        $address = urlencode($address); // replace all the white space with "+" sign to match with google search pattern

        $url = "http://maps.google.com/maps/api/geocode/json?sensor=false&language=de&address=$address";

        $response = file_get_contents($url);

        $json = json_decode($response,TRUE); //generate array object from the response from the web

        if(
            isset($json['results'][0]['geometry']['location']['lat']) &&
            isset($json['results'][0]['geometry']['location']['lng'])
        ) {
            return [
                'lat' => $json['results'][0]['geometry']['location']['lat'],
                'lng' => $json['results'][0]['geometry']['location']['lng']
            ];
        }
    }

    public function error($msg, $exit = true) {
        echo PHP_EOL . 'Fehler: ' . $msg . PHP_EOL;
        if($exit) {
            exit(0);
        }
    }

    public function collmexGet($param) {

        $this->collmex_curl = cURL_init("https://www.collmex.de/cgi-bin/cgi.exe?".$this->config->collmex->customer_id.",0,data_exchange");
        cURL_setopt($this->collmex_curl, CURLOPT_POST, 1);
        cURL_setopt($this->collmex_curl, CURLOPT_POSTFIELDS, "LOGIN;".$this->config->collmex->user.";".$this->config->collmex->password."\n".$param."\n");
        cURL_setopt($this->collmex_curl, CURLOPT_HTTPHEADER, Array("Content-Type: text/csv"));
        cURL_setopt($this->collmex_curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        cURL_setopt($this->collmex_curl, CURLOPT_RETURNTRANSFER, 1);
        $csv = curl_exec($this->collmex_curl);

        cURL_close($this->collmex_curl);

        return $this->collmexCsvParse($csv);
    }

    public function collmexAddressGet() {

        // dev caching
        if(file_exists('/tmp/collmexAddressGet.tmp')) {
            echo "load cached items\n";
            $data = unserialize(file_get_contents('/tmp/collmexAddressGet.tmp'));

            return $data;
        }

        if($data = $this->collmexGet('ADDRESS_GET')){
            $out = [];
            foreach ($data as $d) {
                if(count($d) == 36){

                    $out[] = [
                        'address_id' => $d[1],
                        'name' => $d[7],
                        'firstname' => $d[5],
                        'surname' => $d[6],
                        'street' => $d[9],
                        'zip' => $d[10],
                        'city' => $d[11],
                        'web' => $d[28],
                        'address_group' => $d[31],
                        'phone' => $d[15],
                        'country' => $d[14],
                        'email' => $d[17]
                    ];
                }
            }
            file_put_contents('/tmp/collmexAddressGet.tmp',serialize($out));
            return $out;
        }
        return false;
    }

    public function collmexCsvParse($csv)
    {
        $csv = iconv('Windows-1252', 'UTF-8', $csv);
        $tmpHandle = tmpfile();
        fwrite($tmpHandle, $csv);
        rewind($tmpHandle);
        $data = [];
        while ($line = fgetcsv($tmpHandle, 0, ';', '"')) {

            $data[] = $line;
        }
        fclose($tmpHandle);



        return $data;
    }

    public function addhttp($url) {
        if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
            $url = "http://" . $url;
        }
        return $url;
    }

}
