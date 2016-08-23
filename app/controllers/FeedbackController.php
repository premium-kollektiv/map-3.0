<?php

class FeedbackController extends ControllerBase
{

    public function indexAction()
    {

    }

    public function updateAction()
    {

        require_once '../app/lib/simple_html_dom.php';

        try{

            $out = [
                'elena@premium-cola.de' => [
                    'country' => ['DE']
                ]
            ];

            $table = file_get_html('http://www.premium-cola.de/kontakte');

            // Find all images
            foreach($table->find('table[class=contentpaneopen]') as $table) {

                $html = str_get_html($table);

                foreach ($html->find('p') as $p) {
                    $text = trim($p->innertext);
                    $text = strtolower($text);

                    if(substr($text,0, 4) == 'plz ') {
                        //echo 'check: ' . $text .'<br><hr>';

                        $text = substr($text,4);
                        $text = trim($text);

                        $mail = 'elena@premium-cola.de';

                        $item = str_get_html($text);
                        foreach ($item->find('a') as $maillink) {
                            if($maillink->href != '' && substr($maillink->href,0,7) == 'mailto:') {
                                $mail = trim(substr($maillink->href,7));
                                if(!isset($out[$mail])) {
                                    $out[$mail] = [];
                                }
                            }
                        }

                        $text = explode('<a ', $text);

                        $text = $text[0];

                        $parts = explode(',',$text);


                        //echo $mail . ' = ' . print_r($parts,true) . '<br><hr>';

                        if(count($parts > 0)) {
                            $out[$mail]['country'] = [];

                            foreach ($parts as $p) {
                                $p = trim($p);
                                $p = str_replace([':'],'',$p);

                                if($p == '0') {

                                    $out[$mail][0] = 0;
                                    continue;
                                }

                                if(strlen($p) > 1 && (int)$p == 0) {
                                    $p = trim($p);

                                    $out[$mail]['country'][] = strtoupper($p);
                                    continue;
                                }

                                if(strpos($p,'-') !== false) {

                                    $pp = explode('-',$p);

                                    $range = range((int)$pp[0],(int)end($pp));

                                    foreach ($range as $r) {
                                        $out[$mail][$r] = $r;
                                    }

                                    continue;
                                }

                                if((int)$p > 0) {
                                    $out[$mail][(int)$p] = (int)$p;
                                }

                            }

                            if(empty($out[$mail]['country'])) {
                                $out[$mail]['country'] = ['DE'];
                            }
                        }
                    }
                }
            }

            file_put_contents('../app/config/feedback.txt',serialize($out));

            echo '<h1>Kontake update erfolgreich!</h1>';

            foreach ($out as $mail => $values) {

                echo '<h4>' . $mail . ' ('.implode(', ',$values['country']).')</h4>';

                unset($values['country']);
                echo implode(', ', $values) . '<br /><br /><hr />';

            }


            exit();

        } catch(Exception $e) {
            echo 'Fehler..';
            die();
        }
    }

    public function zipmailAction()
    {
        if(
            isset($_POST['email']) &&
            isset($_POST['feedback']) && 
            isset($_POST['id']) && 
            isset($_POST['zip'])
        ) {

            $id = (int)$_POST['id'];

            $from = false;

            if($item = Item::findFirst($id)) {
                $country = $item->country;
                $zip = $item->zip;


                $feedback = strip_tags($_POST['feedback']);

                $feedback .= "\n\n===========================================\n\nLandkarten Adresse um die es geht:\n";

                $feedback .= $item->name . "\n" . $item->street . "\n" . $item->zip . ' ' . $item->city;

                $subject = 'Premium Landkarte: ' . $item->name;

                if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
                    $from = $_POST['email'];
                }


                $contact = file_get_contents('../app/config/feedback.txt');
                $contact = unserialize($contact);

                // set one default contact for each country
                // its the first simply

                $default_contact_for_country = false;
                $zip_match = false;

                foreach ($contact as $mail => $c) {
                    //check is contact for country?
                    if(in_array($country,$c['country'])) {
                        if($default_contact_for_country === false) {
                            $default_contact_for_country = $c;
                            $default_contact_for_country['mail'] = $mail;
                        }

                        // not important for zips
                        unset($c['country']);

                        foreach ($c as $ziparea){

                            // checked for matched ziparea
                            if($ziparea.'' == substr($zip.'',0,strlen($ziparea))) {
                                $zip_match = true;

                                // send mail...



                                $this->mail($mail,$subject,$feedback,$from);

                                return $this->jsonResponse([
                                    'msg' => 'Nachricht wurde an ' . $mail . ' versendet.'
                                ]);
                            }
                        }
                    }
                }

                if(!$zip_match) {

                    // send mail to default
                    $this->mail($default_contact_for_country['mail'],$subject,$feedback,$from);

                    return $this->jsonResponse([
                        'msg' => 'Nachricht wurde an ' . $default_contact_for_country['mail'] . ' versendet.'
                    ]);
                }
            }

            return $this->jsonResponseError('Nachricht konnte nicht gesendet werden.');

        }
        
    }

}

