<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;

class OffertypeController extends ControllerBase
{

    /**
     * Index action
     */
    public function indexAction()
    {
        $this->persistent->parameters = null;
    }

    /**
     * Searches for offertype
     */
    public function searchAction()
    {

        $numberPage = 1;
        if ($this->request->isPost()) {
            $query = Criteria::fromInput($this->di, "Offertype", $_POST);
            $this->persistent->parameters = $query->getParams();
        } else {
            $numberPage = $this->request->getQuery("page", "int");
        }

        $parameters = $this->persistent->parameters;
        if (!is_array($parameters)) {
            $parameters = array();
        }
        $parameters["order"] = "id";

        $offertype = Offertype::find($parameters);
        if (count($offertype) == 0) {
            $this->flash->notice("The search did not find any offertype");

            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "index"
            ));
        }

        $paginator = new Paginator(array(
            "data" => $offertype,
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
     * Edits a offertype
     *
     * @param string $id
     */
    public function editAction($id)
    {

        if (!$this->request->isPost()) {

            $offertype = Offertype::findFirstByid($id);
            if (!$offertype) {
                $this->flash->error("offertype was not found");

                return $this->dispatcher->forward(array(
                    "controller" => "offertype",
                    "action" => "index"
                ));
            }

            $this->view->id = $offertype->id;

            $this->tag->setDefault("id", $offertype->id);
            $this->tag->setDefault("name", $offertype->name);
            $this->tag->setDefault("description", $offertype->description);
            
        }
    }

    /**
     * Creates a new offertype
     */
    public function createAction()
    {

        if (!$this->request->isPost()) {
            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "index"
            ));
        }

        $offertype = new Offertype();

        $offertype->name = $this->request->getPost("name");
        $offertype->description = $this->request->getPost("description");
        

        if (!$offertype->save()) {
            foreach ($offertype->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "new"
            ));
        }

        $this->flash->success("offertype was created successfully");

        return $this->dispatcher->forward(array(
            "controller" => "offertype",
            "action" => "index"
        ));

    }

    /**
     * Saves a offertype edited
     *
     */
    public function saveAction()
    {

        if (!$this->request->isPost()) {
            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "index"
            ));
        }

        $id = $this->request->getPost("id");

        $offertype = Offertype::findFirstByid($id);
        if (!$offertype) {
            $this->flash->error("offertype does not exist " . $id);

            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "index"
            ));
        }

        $offertype->name = $this->request->getPost("name");
        $offertype->description = $this->request->getPost("description");
        

        if (!$offertype->save()) {

            foreach ($offertype->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "edit",
                "params" => array($offertype->id)
            ));
        }

        $this->flash->success("offertype was updated successfully");

        return $this->dispatcher->forward(array(
            "controller" => "offertype",
            "action" => "index"
        ));

    }

    /**
     * Deletes a offertype
     *
     * @param string $id
     */
    public function deleteAction($id)
    {

        $offertype = Offertype::findFirstByid($id);
        if (!$offertype) {
            $this->flash->error("offertype was not found");

            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "index"
            ));
        }

        if (!$offertype->delete()) {

            foreach ($offertype->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "offertype",
                "action" => "search"
            ));
        }

        $this->flash->success("offertype was deleted successfully");

        return $this->dispatcher->forward(array(
            "controller" => "offertype",
            "action" => "index"
        ));
    }

}
