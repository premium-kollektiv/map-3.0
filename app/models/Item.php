<?php

use Phalcon\Mvc\Model\Validator\Email as Email;
use Phalcon\Mvc\Model\Resultset\Simple as Resultset;

class Item extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    protected $id;

    /**
     *
     * @var integer
     */
    protected $collmex_customer_id;

    /**
     *
     * @var string
     */
    protected $name;

    /**
     *
     * @var string
     */
    protected $street;

    /**
     *
     * @var string
     */
    protected $zip;

    /**
     *
     * @var string
     */
    protected $city;

    /**
     *
     * @var string
     */
    protected $country;

    /**
     *
     * @var double
     */
    protected $lat;

    /**
     *
     * @var double
     */
    protected $lng;

    /**
     *
     * @var string
     */
    protected $web;

    /**
     *
     * @var string
     */
    protected $email;

    /**
     *
     * @var integer
     */
    protected $location_checked;

    /**
     *
     * @var integer
     */
    protected $geolocate_count;

    /**
     * Method to set the value of field id
     *
     * @param integer $id
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Method to set the value of field collmex_customer_id
     *
     * @param integer $collmex_customer_id
     * @return $this
     */
    public function setCollmexCustomerId($collmex_customer_id)
    {
        $this->collmex_customer_id = $collmex_customer_id;

        return $this;
    }

    /**
     * Method to set the value of field name
     *
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Method to set the value of field street
     *
     * @param string $street
     * @return $this
     */
    public function setStreet($street)
    {
        $this->street = $street;

        return $this;
    }

    /**
     * Method to set the value of field zip
     *
     * @param string $zip
     * @return $this
     */
    public function setZip($zip)
    {
        $this->zip = $zip;

        return $this;
    }

    /**
     * Method to set the value of field city
     *
     * @param string $city
     * @return $this
     */
    public function setCity($city)
    {
        $this->city = $city;

        return $this;
    }

    /**
     * Method to set the value of field country
     *
     * @param string $country
     * @return $this
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Method to set the value of field lat
     *
     * @param double $lat
     * @return $this
     */
    public function setLat($lat)
    {
        $this->lat = $lat;

        return $this;
    }

    /**
     * Method to set the value of field lng
     *
     * @param double $lng
     * @return $this
     */
    public function setLng($lng)
    {
        $this->lng = $lng;

        return $this;
    }

    /**
     * Method to set the value of field web
     *
     * @param string $web
     * @return $this
     */
    public function setWeb($web)
    {
        $this->web = $web;

        return $this;
    }

    /**
     * Method to set the value of field email
     *
     * @param string $email
     * @return $this
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Method to set the value of field location_checked
     *
     * @param integer $location_checked
     * @return $this
     */
    public function setLocationChecked($location_checked)
    {
        $this->location_checked = $location_checked;

        return $this;
    }

    /**
     * Method to set the value of field geolocate_count
     *
     * @param integer $geolocate_count
     * @return $this
     */
    public function setGeolocateCount($geolocate_count)
    {
        $this->geolocate_count = $geolocate_count;

        return $this;
    }

    /**
     * Returns the value of field id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Returns the value of field collmex_customer_id
     *
     * @return integer
     */
    public function getCollmexCustomerId()
    {
        return $this->collmex_customer_id;
    }

    /**
     * Returns the value of field name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Returns the value of field street
     *
     * @return string
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * Returns the value of field zip
     *
     * @return string
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * Returns the value of field city
     *
     * @return string
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Returns the value of field country
     *
     * @return string
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Returns the value of field lat
     *
     * @return double
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * Returns the value of field lng
     *
     * @return double
     */
    public function getLng()
    {
        return $this->lng;
    }

    /**
     * Returns the value of field web
     *
     * @return string
     */
    public function getWeb()
    {
        return $this->web;
    }

    /**
     * Returns the value of field email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Returns the value of field location_checked
     *
     * @return integer
     */
    public function getLocationChecked()
    {
        return $this->location_checked;
    }

    /**
     * Returns the value of field geolocate_count
     *
     * @return integer
     */
    public function getGeolocateCount()
    {
        return $this->geolocate_count;
    }

    
    public function setStreetNumber($street_number)
    {
        $this->street_number = $street_number;

        return $this;
    }
    
    public function getStreetNumber()
    {
        return $this->street_number;
    }
    
    public function initialize()
    {
        $this->hasMany('id', 'Item_has_offertype', 'item_id', array('alias' => 'Item_has_offertype'));
        $this->hasMany('id', 'Item_has_product', 'item_id', array('alias' => 'Item_has_product'));
        $this->hasMany('id', 'ItemHasOffertype', 'item_id', NULL);
        $this->hasMany('id', 'ItemHasProduct', 'item_id', NULL);
    }
    
    /*
     * Raw query funcktion for output markers without data overhead
     */
    public static function listMarker()
    {
        // Base model
        $item = new Item();

        // Execute the query
        $result = new Resultset(
                null, 
                $item, 
                $item->getReadConnection()->query
                ('SELECT id,lat,lng FROM item WHERE lat IS NOT NULL AND lng IS NOT NULL')
        );
        
        $out = [];
        
        foreach ($result as $r) {
            $out[] = [
                (int)$r->id,[floatval($r->lat),floatval($r->lng)]
            ];
        }
        
        return $out;
    }

}
