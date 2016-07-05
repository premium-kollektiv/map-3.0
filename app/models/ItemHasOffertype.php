<?php

class ItemHasOffertype extends \Phalcon\Mvc\Model
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
    protected $offertype_id;

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
     * Method to set the value of field offertype_id
     *
     * @param integer $offertype_id
     * @return $this
     */
    public function setOffertypeId($offertype_id)
    {
        $this->offertype_id = $offertype_id;

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
     * Returns the value of field offertype_id
     *
     * @return integer
     */
    public function getOffertypeId()
    {
        return $this->offertype_id;
    }
    
    public function initialize()
    {
        $this->belongsTo('item_id', 'Item', 'id', array('alias' => 'Item'));
        $this->belongsTo('offertype_id', 'Offertype', 'id', array('alias' => 'Offertype'));
        $this->belongsTo('item_id', 'Item', 'id', NULL);
        $this->belongsTo('offertype_id', 'Offertype', 'id', NULL);
    }

}
