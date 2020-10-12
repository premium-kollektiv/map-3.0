<?php

use Phalcon\Config;

class ProductTask extends BaseTask {
    function mainAction() {
        $this->listAction();
    }

    function listAction() {
        $products = Product::find();

        $mask = "|%5.5s | %-30.30s | %-30.30s | %-10.10s |\n";
        printf($mask, 'id', 'name', 'description', 'Collmex Id');
        printf($mask, '----', '-------------------------------', '-------------------------------', '----------');

        foreach($products as $product) {
            $description = "-";
            if($product->description) {
                $description = $product->description;
            }
            printf($mask, $product->id, $product->name, $description, $product->collmexId);
        }
    }

    function deleteAction($id) {
        $product_id = $id[0];
        if(!is_numeric($product_id)) {
            echo "Invalid product id\n";
            return;
        }

        $product = Product::findFirst($product_id);
        if(!$product) {
            echo "Product not found\n";
            return;
        }

        $item_has_product = ItemHasProduct::findByProductId($product_id);
        $item_has_product->delete();

        if($product->delete()) {
            echo "Product '" . $product->name . "' (" . $product_id . ") successfully deleted\n";
        } else {
            echo "Could not delete product '" . $product->name . "' (id " . $product->id .")\n";
        }
    }

    function addAction($params) {
        $name = $params[0];
        $description = $params[1];
        $collmex_id = $params[2];

        if(!is_numeric($collmex_id)) {
            echo "Invalid product id\n";
            return;
        }

        if(empty($name)) {
            echo "No name specified\n";
            return;
        }

        $product = new Product();
        $product->setName($name);
        $product->setDescription($description);
        $product->setCollmexId($collmex_id);
        if($product->save()) {
            echo "Product '" . $product->name . "' (" . $product->id . ") successfully created\n";
        } else {
            echo "Could not create product '" . $product->name . "' (id " . $product->id .")\n";
        }

    }
}