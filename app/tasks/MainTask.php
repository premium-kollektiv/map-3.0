<?php

class MainTask extends BaseTask
{
    public function mainAction()
    {
        echo "\n== premium update tool == \n\nparams:\n  - update \t=> run collmex data update\n  - update geo \t=> update only geolocations\n\n";
    }
}