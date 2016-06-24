<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    

    <title>Premium Maps</title>

    <link href="/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
    <link href="/css/styles.css" rel="stylesheet" />
   
  </head>

  <body>

    {{ content() }}

    <div id="topbar">
        <form id="searchform">
            <input class="corner-all shadow" type="text" id="searchbar" placeholder="Stadt oder Adresse eingeben..." /><button id="searchbar-icon" type="submit"><i class="fa fa-search" aria-hidden="true"></i></button><a href="#" class="bt bt-laeden corner-all shadow" data-type="laeden"><i class="fa fa-shopping-basket" aria-hidden="true"></i> Läden</a><a class="bt bt-haendler corner-all shadow" href="#" data-type="haendler"><i class="fa fa-shopping-cart" aria-hidden="true"></i> Händler</a><a class="bt bt-sprecher corner-all shadow" href="#" data-type="sprecher"><i class="fa fa-comments" aria-hidden="true"></i> Sprecher</a>
        </form>
        
    </div>
    <div id="map" class="map"></div>

    <script src="/js/build.js"></script>
  </body>
</html>
