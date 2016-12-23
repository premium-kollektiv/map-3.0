<?php

class IndexController extends ControllerBase
{

    public function indexAction()
    {
        $this->view->script = '';
        if ($id = (int)$this->dispatcher->getParam('id')) {

            if ($item = Item::findFirst($id)) {

                $products = [];

                $out = [];

                foreach ($item->products as $p) {
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
                if (count($item->offertypes) == 1 && $item->offertypes[0]->id == 3) {
                    $street = '';
                }

                $data = [
                    'id' => (int)$item->id,
                    'name' => $item->name . '',
                    'street' => $street . '',
                    'products' => $products,
                    'offertypes' => $offertypes,
                    'city' => $item->city . '',
                    'zip' => $item->zip . '',
                    'web' => $item->web . '',
                    'email' => $item->email . '',
                    'phone' => $item->phone,
                    'lat' => $item->lat,
                    'lng' => $item->lng,
                    'uri' => $item->id
                ];

                $this->view->script = '
                var initData = ' . json_encode($data) . ';
            ';
            }
        }
    }
}

