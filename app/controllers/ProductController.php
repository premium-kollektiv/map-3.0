<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;

class ProductController extends ControllerBase
{

    /**
     * Index action
     */
    public function indexAction()
    {
        $this->persistent->parameters = null;
    }

    /**
     * Searches for product
     */
    public function searchAction()
    {

        $numberPage = 1;
        if ($this->request->isPost()) {
            $query = Criteria::fromInput($this->di, "Product", $_POST);
            $this->persistent->parameters = $query->getParams();
        } else {
            $numberPage = $this->request->getQuery("page", "int");
        }

        $parameters = $this->persistent->parameters;
        if (!is_array($parameters)) {
            $parameters = array();
        }
        $parameters["order"] = "id";

        $product = Product::find($parameters);
        if (count($product) == 0) {
            $this->flash->notice("The search did not find any product");

            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "index"
            ));
        }

        $paginator = new Paginator(array(
            "data" => $product,
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
     * Edits a product
     *
     * @param string $id
     */
    public function editAction($id)
    {

        if (!$this->request->isPost()) {

            $product = Product::findFirstByid($id);
            if (!$product) {
                $this->flash->error("product was not found");

                return $this->dispatcher->forward(array(
                    "controller" => "product",
                    "action" => "index"
                ));
            }

            $this->view->id = $product->id;

            $this->tag->setDefault("id", $product->id);
            $this->tag->setDefault("name", $product->name);
            $this->tag->setDefault("description", $product->description);
            
        }
    }

    /**
     * Creates a new product
     */
    public function createAction()
    {

        if (!$this->request->isPost()) {
            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "index"
            ));
        }

        $product = new Product();

        $product->name = $this->request->getPost("name");
        $product->description = $this->request->getPost("description");
        

        if (!$product->save()) {
            foreach ($product->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "new"
            ));
        }

        $this->flash->success("product was created successfully");

        return $this->dispatcher->forward(array(
            "controller" => "product",
            "action" => "index"
        ));

    }

    /**
     * Saves a product edited
     *
     */
    public function saveAction()
    {

        if (!$this->request->isPost()) {
            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "index"
            ));
        }

        $id = $this->request->getPost("id");

        $product = Product::findFirstByid($id);
        if (!$product) {
            $this->flash->error("product does not exist " . $id);

            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "index"
            ));
        }

        $product->name = $this->request->getPost("name");
        $product->description = $this->request->getPost("description");
        

        if (!$product->save()) {

            foreach ($product->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "edit",
                "params" => array($product->id)
            ));
        }

        $this->flash->success("product was updated successfully");

        return $this->dispatcher->forward(array(
            "controller" => "product",
            "action" => "index"
        ));

    }

    /**
     * Deletes a product
     *
     * @param string $id
     */
    public function deleteAction($id)
    {

        $product = Product::findFirstByid($id);
        if (!$product) {
            $this->flash->error("product was not found");

            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "index"
            ));
        }

        if (!$product->delete()) {

            foreach ($product->getMessages() as $message) {
                $this->flash->error($message);
            }

            return $this->dispatcher->forward(array(
                "controller" => "product",
                "action" => "search"
            ));
        }

        $this->flash->success("product was deleted successfully");

        return $this->dispatcher->forward(array(
            "controller" => "product",
            "action" => "index"
        ));
    }

}
