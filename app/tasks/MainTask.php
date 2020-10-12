<?php

class MainTask extends BaseTask
{
    public function mainAction()
    {
        $usage = "\n== premium update tool == \n\n";
        $usage .= "params:\n";
        $usage .= "  - update \t\t\t\t\t=> run collmex data update\n";
        $usage .= "  - update geo \t\t\t\t\t=> update only geolocations\n";
        $usage .= "  - product list \t\t\t\t=> List products\n";
        $usage .= "  - product add <name> <description> <collmex_id> \t=> Add new product\n";
        $usage .= "  - product delete <id> \t\t\t=> Delete product\n";
        $usage .= "\n";
        echo $usage;
    }
}