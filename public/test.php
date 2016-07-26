<!DOCTYPE html>
<html>
<head>
    <title>Google Maps JavaScript API v3 Example: Places Autocomplete</title>
    <script src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=places"
            type="text/javascript"></script>

    <style type="text/css">
        body {
            font-family: sans-serif;
            font-size: 14px;
        }
        #map_canvas {
            height: 400px;
            width: 600px;
            margin-top: 0.6em;
        }
    </style>

    <script type="text/javascript">
        var ns = {}; // a name space
        ns.checktimes = 0; // a couter of check times
        // the check function
        // @param dropdown: the drop-down list of Places.AutoComplete
        // @param msg: the div to show message
        ns._doCheck = function (dropdown, msg) {
            if (dropdown.style.display == '') {
                msg.innerHTML = 'has results? true';
                ns.checkTimer = null;
            }
            else if (dropdown.style.display == 'none') {
                msg.innerHTML = 'has results? false';
                ns.checkTimer = null;
            } else if (ns.checktimes < 20) { // check at most 10 seconds
                ns.checktimes++;
                ns.checkTimer = setTimeout(function () {
                    ns._doCheck(dropdown, msg);
                }, 500);
            }
        }
        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(-33.8688, 151.2195),
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('map_canvas'),
                mapOptions);

            var input = document.getElementById('searchTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);

            autocomplete.bindTo('bounds', map);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map
            });

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                infowindow.close();
                var place = autocomplete.getPlace();
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);  // Why 17? Because it looks good.
                }

                var image = new google.maps.MarkerImage(
                    place.icon,
                    new google.maps.Size(71, 71),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(17, 34),
                    new google.maps.Size(35, 35));
                marker.setIcon(image);
                marker.setPosition(place.geometry.location);

                var address = '';
                if (place.address_components) {
                    address = [(place.address_components[0] &&
                    place.address_components[0].short_name || ''),
                        (place.address_components[1] &&
                        place.address_components[1].short_name || ''),
                        (place.address_components[2] &&
                        place.address_components[2].short_name || '')
                    ].join(' ');
                }

                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                infowindow.open(map, marker);
                // update stored value
                ns.oldValue = document.getElementById('searchTextField').value;
            });

            // Sets a listener on a radio button to change the filter type on Places
            // Autocomplete.
            function setupClickListener(id, types) {
                var radioButton = document.getElementById(id);
                google.maps.event.addDomListener(radioButton, 'click', function() {
                    autocomplete.setTypes(types);
                });
            }

            setupClickListener('changetype-all', []);
            setupClickListener('changetype-establishment', ['establishment']);
            setupClickListener('changetype-geocode', ['geocode']);
        }

        // to check whether responsee and has results
        function startCheck () {
            // the input node
            var inp = document.getElementById('searchTextField'),
                value = inp.value; // value of input node
            if (value && ns.oldValue != value) { // has value and changed, start check
                // drop-down list and message div
                var dropdown = document.getElementsByClassName('pac-container')[0],
                    msg = document.getElementById('msg');
                // trick! change style to display='block'
                dropdown.style.display = 'block';
                // update stored value
                ns.oldValue = value;
                // initiate checktimes
                ns.checktimes = 0;
                // clear previous timer if exists
                if (ns.checkTimer)
                    clearTimeout (ns.checkTimer);
                ns.checkTimer = setTimeout(function () {
                    ns._doCheck(dropdown, msg);
                }, 500);
            }
        }
        google.maps.event.addDomListener(window, 'load', initialize);
    </script>
</head>
<body>
<div>
    <div id="msg">has results? </div>
    <input id="searchTextField" type="text" size="50" onkeyup="startCheck();">
    <input type="radio" name="type" id="changetype-all" checked="checked">
    <label for="changetype-all">All</label>

    <input type="radio" name="type" id="changetype-establishment">
    <label for="changetype-establishment">Establishments</label>

    <input type="radio" name="type" id="changetype-geocode">
    <label for="changetype-geocode">Geocodes</lable>
</div>
<div id="map_canvas"></div>
</body>
</html>