<?php

class ItemHasProduct extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    protected $item_id;

    /**
     *
     * @var integer
     */
    protected $product_id;

    /**
     * Method to set the value of field item_id
     *
     * @param integer $item_id
     * @return $this
     */
    public function setItemId($item_id)
    {
        $this->item_id = $item_id;

        return $this;
    }

    /**
     * Method to set the value of field product_id
     *
     * @param integer $product_id
     * @return $this
     */
    public function setProductId($product_id)
    {
        $this->product_id = $product_id;

        return $this;
    }

    /**
     * Returns the value of field item_id
     *
     * @return integer
     */
    public function getItemId()
    {
        return $this->item_id;
    }

    /**
     * Returns the value of field product_id
     *
     * @return integer
     */
    public function getProductId()
    {
        return $this->product_id;
    }
    public function initialize()
    {
        $this->belongsTo('item_id', 'Item', 'id', array('alias' => 'Item'));
        $this->belongsTo('product_id', 'Product', 'id', array('alias' => 'Product'));
        $this->belongsTo('item_id', 'Item', 'id', NULL);
        $this->belongsTo('product_id', 'Product', 'id', NULL);
    }

}
