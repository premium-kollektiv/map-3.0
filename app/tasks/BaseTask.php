<?php

class BaseTask extends \Phalcon\Cli\Task 
{
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
}
