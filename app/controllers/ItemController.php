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
        
        $items = Item::listMarker();

        return $this->jsonResponse($items);
    }
    
    /**
     * gets one marker item with details
     * 
     * @return json
     */
    public function apiGetAction() {

        if($id = (int)$this->dispatcher->getParam('id')) {
            if($item = Item::findFirst($id)) {
                return $this->jsonResponse([
                    'id' => (int)$item->id,
                    'name' => $item->name.'',
                    'street' => $item->street.'',
                    'products' => ['Cola', 'Bier'],
                    'city' => $item->city.'',
                    'zip' => $item->zip.'',
                    'web' => $item->url.'',
                    'email' => $item->email.''
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