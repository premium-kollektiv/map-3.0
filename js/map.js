
/*
 * requirements
 */

require('leaflet.markercluster');


/*
 * some data for map data
 */
ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN;

/*
 * map object to privide all premium map functions
 */
var map = {
    
    map: null,
    
    legend:null,
    
    homeDetected:false,
    
    marker: null,
    
    markerLayer:null,
    
    types: ['haendler','laeden','sprecher'],
    
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
         * popup setup
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
                   map.map.setView([position.coords.latitude, position.coords.longitude], 14);
                   session.set('homelocation',[position.coords.latitude, position.coords.longitude]);
               });
            }
        }
        else {
            map.map.setView(homeLocation, 14);
        }
    },
    
    initControls: function() {
        
        // home button
        $('.leaflet-bottom.leaflet-left').prepend('<div class="leaflet-control-home leaflet-bar leaflet-control"><a class="leaflet-control-zoom-home corner-all" href="#" title="Center"><i class="fa fa-dot-circle-o" aria-hidden="true"></i></a></div>').click(function(ev){
            ev.preventDefault();
            map.locateHome();
        });
        
        $('.leaflet-control-zoom-in').text('').html('<i class="fa fa-plus" aria-hidden="true"></i>');
        $('.leaflet-control-zoom-out').text('').html('<i class="fa fa-minus" aria-hidden="true"></i>');
        
        // info button
        $('.leaflet-bottom.leaflet-right').prepend('<div class="leaflet-control-info leaflet-bar leaflet-control"><a class="leaflet-control-zoom-home corner-all" href="#" title="Center"><i class="fa fa-info" aria-hidden="true"></i></a></div>').click(function(ev){
            ev.preventDefault();
            popup.info();
        });
        
        this.initLegend();
    },
    
    initLegend: function() {
        
        var session_types = session.get('types');
        
        if(session_types == undefined) {
            session_types = map.types;
            session.set('types',session_types);
        }
        
        this.legend = $('#topbar .bt');
        
        $('#topbar .bt:not(.bt-'+session_types.join(',.bt-')+')').addClass('disabled');
        
        
        this.legend.click(function(ev){
            ev.preventDefault();
            var $this = $(this);
            $this.toggleClass('disabled');
            
            var types = [];
            map.legend.each(function(){
                var $this = $(this);
                
                if(!$this.hasClass('disabled')) {
                    types.push($this.data('type'));
                }
            });
            
            session.set('types',types);
            map.loadMarker(types);
            
        });
        
    },
    
    saveState: function() {
        session.set('state',{
           zoom: map.map.getZoom(),
           center: map.map.getCenter()
        });
    },
    
    loadMarker: function(types) {
        
        
        
        if(types == undefined) {
            var types = map.types;
        }
        
        loader.start();
        
        $.ajax({
            url: '/MOCK_DATA_SIMPLE.json',
            dataType: 'json',
            data:{
                types:types
            },
            success: function(data) {
                map.printMarker(data);                
            },
            complete: function() {
                loader.stop();
            }
        });
        
    },
    
    printMarker: function(markers) {
        if (map.markerLayer != null) {
            map.map.removeLayer(map.markerLayer);
        }

        map.markerLayer = L.markerClusterGroup({
            polygonOptions: {
                fillColor: '#000',
                color: '#000',
                weight: 4,
                opacity: 0.5,
                fillOpacity: 0.2
            }
        });
        
        for (i = 0; i < 100; i++) {

            var latlng = [parseFloat(markers[i].lat), parseFloat(markers[i].lng)];
            var marker = new L.marker(getRandomLatLng(map.map));
            marker.bindPopup('<div style="text-align:center;"><i class="fa fa-refresh fa-spin fa-2x fa-fw"></i></div>');
            /*
             * Lazy loading popup Data
             */
            marker.on('click', function(e) {
                var popup = e.target.getPopup();
                
                $.ajax({
                url: '/SAMPLE_SINGLE_DATA.json?id=' + markers[i].id,
                    success: function(ret){
                        popup.setContent(map.popupTpl(ret)+'');
                        popup.update();
                    }
                });
            });
            map.markerLayer.addLayer(marker);
        }

        map.map.addLayer(map.markerLayer);
    },
    
    popupTpl: function(data) {
        
        return '<h2> ' + data.name + ' </h2>' + 
                '<small>' + data.products.join(', ') + '</small>' +
               '<p>' + 
                    data.street + '<br />' + 
                    data.zip + ' ' + data.city + 
               '</p>' + 
               '<p>' +
                    '<i class="fa fa-home" aria-hidden="true"></i> &nbsp;' + map.urlToLink(data.web) + '<br />' +
                    '<i class="fa fa-envelope" aria-hidden="true"></i> &nbsp;' + map.emailToLink(data.email)
               '</p>';
        
    },
    
    urlToLink: function(url) {
        var prefix = 'http://';
        if (url.substr(0, prefix.length) !== prefix)
        {
            url = prefix + url;
        }
        
        return '<a target="_blank" href="' + url + '">' + url.substr(7) + '</a>'
    },
    
    emailToLink: function(email) {
        return '<a href="mailto:'+email+'">'+email+'</a>';
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