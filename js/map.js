
/*
 * requirements
 */

var session = require('./session.js');
require('leaflet.markercluster');


/*
 * some data for map data
 */
ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
MB_ATTR = ' ' +
			', ' +
			'';
MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN;
OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
OSM_ATTRIB = '';

/*
 * map object to privide all premium map functions
 */
var map = {
    
    map: null,
    homeDetected:false,
    
    marker: null,
    
    /*
     * kick off
     */
    init:function(){
        
        /*
         * initiate map
         */
        L.Icon.Default.imagePath = '/img/marker';
        this.map = L.map('map',{zoomControl:false});
        
        /*
         * marker setup
         */
        
        
        
        /*
         * add tile layers
         */
        L.tileLayer(MB_URL, {attribution: '', id: 'mapbox.streets'}).addTo(this.map);
        new L.Control.Zoom({ position: 'bottomleft' }).addTo(this.map);

        /*
         * save state in session while browsing
         */
        this.map.on('zoomend', function(){
            map.saveState()
        });
        this.map.on('moveend', function(){
            map.saveState()
        });
        
        /*
         * init Controls
         */
        this.initControls();
        
        /*
         * check if therre is a state saved in session go to last state
         * otherwise center to germany and try to locate by browser
         * 
         */
        var state = session.get('state');
        
        if(state != undefined) {
            
            this.map.setView(state.center, state.zoom);
            
        } else {
            
           /*
            * set map in center of germany
            */
           this.map.setView([50.93766174471314,9.777832031250002], 6);

           /*
            * try to locate user
            */
           this.locateHome();
        }
    },
    
    locateHome: function() {
        
        var homeLocation = session.get('homelocation');
        
        if(this.homeDetected == false || homeLocation == undefined) {
            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(function(position){
                   map.homeDetected = true;
                   map.map.setView([position.coords.latitude, position.coords.longitude], 12);
                   session.set('homelocation',[position.coords.latitude, position.coords.longitude]);
               });
            }
        }
        else {
            map.map.setView(homeLocation, 12);
        }
    },
    
    initControls: function() {
        
        // home button
        $('.leaflet-bottom.leaflet-left').prepend('<div class="leaflet-control-home leaflet-bar leaflet-control"><a class="leaflet-control-zoom-home border-all" href="#" title="Center"><i class="fa fa-dot-circle-o" aria-hidden="true"></i></a></div>').click(function(ev){
            ev.preventDefault();
            map.locateHome();
        });
        
        $('.leaflet-control-zoom-in').text('').html('<i class="fa fa-plus" aria-hidden="true"></i>');
        $('.leaflet-control-zoom-out').text('').html('<i class="fa fa-minus" aria-hidden="true"></i>');
        
        // info button
        $('.leaflet-bottom.leaflet-right').prepend('<div class="leaflet-control-info leaflet-bar leaflet-control"><a class="leaflet-control-zoom-home border-all" href="#" title="Center"><i class="fa fa-info" aria-hidden="true"></i></a></div>').click(function(ev){
            ev.preventDefault();
            popup.info();
        });
    },
    
    saveState: function() {
        session.set('state',{
           zoom: map.map.getZoom(),
           center: map.map.getCenter()
        });
    },
    
    loadMarker: function() {
        loader.start();
        
        $.ajax({
            url: '/MOCK_DATA_SIMPLE.json',
            dataType: 'json',
            success: function(data) {
                var markers = L.markerClusterGroup({
                    polygonOptions: {
                        fillColor: '#000',
                        color: '#000',
                        weight: 4,
                        opacity: 0.5,
                        fillOpacity: 0.2
                    }
                });

                for(i=0;i<data.length;i++) {
                    
                    var latlng = [parseFloat(data[i].lat),parseFloat(data[i].lng)];
                    
                    markers.addLayer(new L.marker(getRandomLatLng(map.map)));
                }
                
                map.map.addLayer(markers);
                
            },
            complete: function() {
                loader.stop();
            }
        });
        
    }
};


function getRandomLatLng(map) {
			var bounds = map.getBounds(),
				southWest = bounds.getSouthWest(),
				northEast = bounds.getNorthEast(),
				lngSpan = northEast.lng - southWest.lng,
				latSpan = northEast.lat - southWest.lat;

			return new L.LatLng(
					southWest.lat + latSpan * Math.random(),
					southWest.lng + lngSpan * Math.random());
}

module.exports = map;