<?php

class FeedbackController extends ControllerBase
{
    // https://stackoverflow.com/questions/834303/startswith-and-endswith-functions-in-php
    public function startsWith($haystack, $needle) {
        // search backwards starting from haystack length characters from the end
        return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
    }

    public function indexAction() {}

    public function zipmailAction() {
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


                /*
                 * generate feedback mail content
                 */
                $feedback = strip_tags($_POST['feedback']);

                $feedback .= "\n\n===========================================\n\nLandkarten Adresse um die es geht:\n";

                $feedback .= $item->name . "\n" . $item->street . "\n" . $item->zip . " " . $item->city . "\nCollmex Address ID: " . $item->collmex_address_id;

                /*
                 * gnereate feedback mail subject
                 */
                $subject = 'Premium Landkarte: ' . $item->name;

                /*
                 * set from mail if valid mail is posted
                 */
                if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
                    $from = $_POST['email'];
                }

                $contacts_file = file_get_contents('../app/config/feedback.txt');
                $contacts_line = explode("\n", $contacts_file);
                $contacts = array();
                foreach($contacts_line as $contact) {
                    $contacts[] = explode(";", $contact);
                }

                // Default email address
                $contact_email = "elena@premium-cola.de";

                // Set specific email address if available
                foreach($contacts as $contact) {
                    if($country == $contact[0] && $this->startsWith($zip, $contact[1])) {
                        $contact_email = $contact[2];
                    }
                }

                if($this->mail($contact_email, $subject, $feedback, $from)) {
                    return $this->jsonResponse([
                        'msg' => 'Nachricht wurde an ' . $contact_email . ' versendet.',
                    ]);
                } else {
                    return $this->jsonResponseError('Nachricht konnte nicht gesendet werden.');
                }
            }

            return $this->jsonResponseError('Nachricht konnte nicht gesendet werden.');

        }
        
    }

}

