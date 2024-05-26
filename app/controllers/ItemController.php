<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;

class ItemController extends ControllerBase
{

    /**
     * Index action
     */
    public function indexAction() {
        $this->persistent->parameters = null;
    }

    public function getAllAction() {
        $items = Item::find();
        $cleaned = [];
        foreach($items as $item) {
            $cleaned_item = array();

            $products = array();
            foreach ($item->products as $p){
                $products[] = $p->name;
            }
            if(count($products) == 0) {
                continue;
            }

            $offertypes = array();
                foreach ($item->offertypes as $ot) {
                $offertypes[] = $ot->name;
            }

            $street = $item->street;
            if(count($item->offertypes) == 1 && $item->offertypes[0]->id == 3) {
                $street = '';
            }

            $contact = array();
            if($item->email) {
                $contact[] = $item->email;
            }

            $cleaned[] = [
                'id' => (int)$item->id,
                'name' => $item->name.'',
                'street' => $street.'',
                'products' => $products,
                'offertypes' => $offertypes,
                'city' => $item->city.'',
                'zip' => $item->zip.'',
                'contact' => $contact,
                'web' => $item->web.'',
            ];

        }
        return $this->jsonResponse($cleaned);
    }

    public function apiSearchAction() {
        if($string = $this->dispatcher->getParam('string')) {
            $string = preg_replace('/[^0-9a-zA-Z ßäöüÄÖÜé\-_]/', '', $string);

            if($items = Item::rawSql('SELECT * FROM item WHERE name LIKE REPLACE("' . $string . '%", " ", "%") AND name LIKE REPLACE("%' . $string . '%", " ", "%") LIMIT 0,3')) {
                $out = [];
                foreach ($items as $item) {
                    $street = $item->street;

                    // Skip if no offertype is set
                    if(count($item->offertypes) == 0) {
                        continue;
                    }
                    
                    // Skip if no product is set
                    if(count($item->products) == 0) {
                        continue;
                    }

                    $offertypes = [];
                    foreach ($item->offertypes as $ot) {
                        $offertypes[] = $ot->id;
                    }
                    /*
                     * if only speaker dont send the streenname
                     */
                    if(count($item->offertypes) == 1 && $item->offertypes[0]->id == 3) {
                        $street = '';
                    }
                    $out[] = [
                        'id' => (int)$item->id,
                        'name' => $item->name.'',
                        'street' => $street.'',
                        'city' => $item->city.'',
                        'zip' => $item->zip.'',
                        'web' => $item->web.'',
                        'email' => $item->email.'',
                        'uri' => $item->id,
                        'lat' => $item->lat,
                        'lng' => $item->lng,
                        'offertypes' => $offertypes
                    ];
                }

                return $this->jsonResponse([
                    'items' => $out,
                    'search' => $string
                ]);
            }
        }
        return $this->jsonResponse([]);
    }

    /**
     * get list of marker with geo location
     * @return json
     */
    public function apiListAction() {

        // defualt list all if no type defined
        $options = [1=>true,2=>true,3=>true,4=>true];

        if(isset($_GET['types'])) {
            $options = [];
            // predefined offertypes look at UpdateTask.php...
            $types = [
                'laeden' => 1,
                'haendler' => 2,
                'sprecher' => 3,
                'webshop' => 4
            ];

            $countries = array("DE", "AT", "CH");
            if(isset($_GET['countries'])) {
                $countries = $_GET['countries'];
            }

            $products = array("cola", "bier", "holunder", "muntermate");
            if(isset($_GET['products'])) {
                $products = $_GET['products'];
            }

            foreach ($_GET['types'] as $type) {
                if(isset($types[$type])) {
                    $options[(int)$types[$type]] = true;
                }
            }

            $items = Item::listMarker($countries, $products);
            // return var_dump($items);

            $out = [];
            foreach ($items as $r) {
                $collmex_groups = explode(',',$r->getCollmexAddressGroups());

                /*
                 * Hide items in group 16 or 93.
                 * 
                 * 16: ehemalige Kunden
                 * 93: möchte auf eigenen Wunsch nicht auf die Landkarte
                 */
                if(in_array('93',$collmex_groups) || in_array('16',$collmex_groups)){
                    continue;
                }

                if(!isset($out[(int)$r->id])) {
                    $out[(int)$r->id] = [(int)$r->id,[floatval($r->lat),floatval($r->lng)],[]];
                }
                if(!in_array((int)$r->offertype, $out[(int)$r->id][2])) {
                    $out[(int)$r->id][2][] = (int)$r->offertype;
                }
            }

            /*
             * Apply filter for offertypes
             */
            $out2 = [];
            foreach ($out as $r) {                
                $check = false;

                foreach ($r[2] as $offertype) {
                    if(isset($options[$offertype])) {
                        $check = true;
                    }
                }
                if($check) {
                    $out2[] = $r;
                }


            }
            return $this->jsonResponse(array_values($out2));

        }

        // if no types defined
        return $this->jsonResponse([]);
    }
    
    /**
     * gets one marker item with details
     * 
     * @return json
     */
    public function apiGetAction() {
        
        if($id = (int)$this->dispatcher->getParam('id')) {
            if($item = Item::findFirst($id)) {

                $products = [];
                
                $out = [];

                foreach ($item->products as $p){
                    $products[] = $p->name;
                }

                $offertypes = [];
                foreach ($item->offertypes as $ot) {
                    $offertypes[] = $ot->name;
                }

                $street = $item->street;

                /*
                 * if only speaker dont send the streenname
                 */
                if(count($item->offertypes) == 1 && $item->offertypes[0]->id == 3) {
                    $street = '';
                }

                return $this->jsonResponse([
                    'id' => (int)$item->id,
                    'name' => $item->name.'',
                    'street' => $street.'',
                    'products' => $products,
                    'offertypes' => $offertypes,
                    'city' => $item->city.'',
                    'zip' => $item->zip.'',
                    'web' => $item->web.'',
                    'email' => $item->email.'',
                    'uri' => $item->id
                ]);
            }
        }
        
        return $this->jsonResponseError();
    }
    
    /**
     * Searches for item
     */
    public function searchAction()
    {

        $numberPage = 1;
        if ($this->request->isPost()) {
            $query = Criteria::fromInput($this->di, "Item", $_POST);
            $this->persistent->parameters = $query->getParams();
        } else {
            $numberPage = $this->request->getQuery("page", "int");
        }

        $parameters = $this->persistent->parameters;
        if (!is_array($parameters)) {
            $parameters = array();
        }
        $parameters["order"] = "id";

        $item = Item::find($parameters);
        if (count($item) == 0) {
            $this->flash->notice("The search did not find any item");

            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "index"
            ));
        }

        $paginator = new Paginator(array(
            "data" => $item,
            "limit"=> 10,
            "page" => $numberPage
        ));

        $this->view->page = $paginator->getPaginate();
    }

    /**
     * Displays the creation form
     */
    public function newAction()
    {

    }

    /**
     * Edits a item
     *
     * @param string $id
     */
    public function editAction($id)
    {

        if (!$this->request->isPost()) {

            $item = Item::findFirstByid($id);
            if (!$item) {
                $this->flash->error("item was not found");

                return $this->dispatcher->forward(array(
                    "controller" => "item",
                    "action" => "index"
                ));
            }

            $this->view->id = $item->id;

            $this->tag->setDefault("id", $item->id);
            $this->tag->setDefault("collmex_customer_id", $item->collmex_customer_id);
            $this->tag->setDefault("name", $item->name);
            $this->tag->setDefault("street", $item->street);
            $this->tag->setDefault("street_number", $item->street_number);
            $this->tag->setDefault("zip", $item->zip);
            $this->tag->setDefault("city", $item->city);
            $this->tag->setDefault("country", $item->country);
            $this->tag->setDefault("lat", $item->lat);
            $this->tag->setDefault("lng", $item->lng);
            $this->tag->setDefault("web", $item->web);
            $this->tag->setDefault("email", $item->email);
            $this->tag->setDefault("location_checked", $item->location_checked);
            
        }
    }
}
