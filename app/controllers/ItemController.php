<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;

class ItemController extends ControllerBase
{

    /**
     * Index action
     */
    public function indexAction()
    {
        $this->persistent->parameters = null;
    }

    /**
     * get list of marker with geo location
     * @return json
     */
    public function apiListAction() {

        $options = [1=>true,2=>true,3=>true];

        if(isset($_GET['types'])) {
            $options = [];
            // predefined offertypes look at UpdateTask.php...
            $types = [
                'laeden' => 1,
                'haendler' => 2,
                'sprecher' => 3
            ];

            foreach ($_GET['types'] as $type) {
                if(isset($types[$type])) {
                    $options[(int)$types[$type]] = true;
                }
            }

            $items = Item::listMarker();

            $out = [];

            foreach ($items as $r) {


                $collmex_groups = explode(',',$r->getCollmexAddressGroups());

                /*
                 * hide all items with special group 93 :o)
                 * and hide all items with group 16
                 */

                if(in_array('93',$collmex_groups) || in_array('16',$collmex_groups)){
                    continue;
                }

                if(!isset($out[(int)$r->id])) {
                    $out[(int)$r->id] = [(int)$r->id,[floatval($r->lat),floatval($r->lng)],[]];
                }
                $out[(int)$r->id][2][] = (int)$r->offertype;
            }

            /*
             * filter items by offertype but send all offertypes of each item
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

        /*
         * simple output
         */
        /*
        $out = [];
        foreach ($items as $r) {
            $out[] = [(int)$r->id,[floatval($r->lat),floatval($r->lng)],[(int)$r->offertype]];
        }

        return $this->jsonResponse(array_values($out));
        */
        
        /*
         * reduce data outut
         */

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
                    'phone' => $item->phone
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

    /**
     * Creates a new item
     */
    public function createAction()
    {

        if (!$this->request->isPost()) {
            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "index"
            ));
        }

        $item = new Item();

        $item->collmex_customer_id = $this->request->getPost("collmex_customer_id");
        $item->name = $this->request->getPost("name");
        $item->street = $this->request->getPost("street");
        $item->street_number = $this->request->getPost("street_number");
        $item->zip = $this->request->getPost("zip");
        $item->city = $this->request->getPost("city");
        $item->country = $this->request->getPost("country");
        $item->lat = $this->request->getPost("lat");
        $item->lng = $this->request->getPost("lng");
        $item->web = $this->request->getPost("web");
        $item->email = $this->request->getPost("email", "email");
        $item->location_checked = $this->request->getPost("location_checked");
        

        if (!$item->save()) {
            foreach ($item->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "new"
            ));
        }

        $this->flash->success("item was created successfully");

        return $this->dispatcher->forward(array(
            "controller" => "item",
            "action" => "index"
        ));

    }

    /**
     * Saves a item edited
     *
     */
    public function saveAction()
    {

        if (!$this->request->isPost()) {
            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "index"
            ));
        }

        $id = $this->request->getPost("id");

        $item = Item::findFirstByid($id);
        if (!$item) {
            $this->flash->error("item does not exist " . $id);

            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "index"
            ));
        }

        $item->collmex_customer_id = $this->request->getPost("collmex_customer_id");
        $item->name = $this->request->getPost("name");
        $item->street = $this->request->getPost("street");
        $item->street_number = $this->request->getPost("street_number");
        $item->zip = $this->request->getPost("zip");
        $item->city = $this->request->getPost("city");
        $item->country = $this->request->getPost("country");
        $item->lat = $this->request->getPost("lat");
        $item->lng = $this->request->getPost("lng");
        $item->web = $this->request->getPost("web");
        $item->email = $this->request->getPost("email", "email");
        $item->location_checked = $this->request->getPost("location_checked");
        

        if (!$item->save()) {

            foreach ($item->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "edit",
                "params" => array($item->id)
            ));
        }

        $this->flash->success("item was updated successfully");

        return $this->dispatcher->forward(array(
            "controller" => "item",
            "action" => "index"
        ));

    }

    /**
     * Deletes a item
     *
     * @param string $id
     */
    public function deleteAction($id)
    {

        $item = Item::findFirstByid($id);
        if (!$item) {
            $this->flash->error("item was not found");

            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "index"
            ));
        }

        if (!$item->delete()) {

            foreach ($item->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "item",
                "action" => "search"
            ));
        }

        $this->flash->success("item was deleted successfully");

        return $this->dispatcher->forward(array(
            "controller" => "item",
            "action" => "index"
        ));
    }

}
