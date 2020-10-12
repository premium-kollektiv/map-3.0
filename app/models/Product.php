<?php

class Product extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    protected $id;

    /**
     *
     * @var string
     */
    protected $name;

    /**
     *
     * @var string
     */
    protected $description;

    /**
     * 
     * @var integer
     */
    protected $collmex_id;

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
     * Method to set the value of field description
     *
     * @param string $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Method to set the value of field collmex_id
     *
     * @param integer $collmex_id
     * @return $this
     */
    public function setCollmexId($collmex_id)
    {
        $this->collmex_id = $collmex_id;

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
     * Returns the value of field name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Returns the value of field description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Returns the value of field collmex_id
     *
     * @return integer
     */
    public function getCollmexId()
    {
        return $this->collmex_id;
    }

    public function initialize()
    {
        $this->hasMany('id', 'Item_has_product', 'product_id', array('alias' => 'Item_has_product'));
        $this->hasMany('id', 'ItemHasProduct', 'product_id', NULL);
    }

}
