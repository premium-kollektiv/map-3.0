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
        <form id="searchform"><input class="border-all shadow" type="text" id="searchbar" placeholder="Stadt oder Adresse eingeben..." /><button id="searchbar-icon" type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>
    </div>
    <div id="map" class="map"></div>


    <script src="http://maps.googleapis.com/maps/api/js?libraries=places&language=de"></script>
    <script src="/js/build.js"></script>
  </body>
</html>
