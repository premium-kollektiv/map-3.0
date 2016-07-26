<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    

    <title>Premium-Landkarte</title>

   <link href="/css/styles.css" rel="stylesheet" />
   
  </head>

  <body>

    {{ content() }}

    <div id="topbar">
        <div id="search">
            <input class="corner-all shadow" type="text" id="searchbar" placeholder="Stadt oder Adresse eingeben..." /><button id="searchbar-icon" type="button"><i class="icon-search" aria-hidden="true"></i></button>
        </div>
        <div id="tools" class="mobile-hidden">
            <a href="#" title="Cafe/Club/Bar/Restaurant/Designladen/Hackerspace/Kulturzentrum/etc. meist mit direktem Konsum vor Ort. Bei Interesse bitte direkt beim Laden nachfragen, ob man Flaschen/Kisten zum mitnehmen kaufen kann (wie zb. bei einem Kiosk)." class="bt bt-laeden corner-all shadow" data-type="laeden"><img src="/img/marker/marker-icon-l.svg" />Laden</a><a title="meist Getränkemarkt und Großhandel, kaufen von Premium-Kisten/Paletten für Privatpersonen und für Läden möglich" class="bt bt-haendler corner-all shadow" href="#" data-type="haendler"><img src="/img/marker/marker-icon-h.svg" />(Groß)Handel</a><a title='dies sind die sogenannten Premium-"Sprecher*innen" vor Ort, welche sich um Handel und Läden kümmern, und für lokale Fragen jeder Art zur Verfügung stehen.' class="bt bt-sprecher corner-all shadow" href="#" data-type="sprecher"><img src="/img/marker/marker-icon-s.svg" />lokaler Kontakt</a>
        </div>
        
    </div>
    <div id="map" class="map"></div>

    <script src="/js/build.js"></script>
  </body>
</html>
