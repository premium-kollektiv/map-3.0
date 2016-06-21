<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    

    <title>Premium Maps</title>

    
    <link href="/css/styles.css" rel="stylesheet" />
   
  </head>

  <body>

    {{ content() }}

    <div id="topbar">
        <input type="text" id="searchbar" placeholder="Stadt oder Adresse eingeben..." />
    </div>
    <div id="map" class="map"></div>

    <script src="//code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="/js/leaflet/leaflet.js"></script>
    <script src="/js/script.js"></script>
  </body>
</html>
