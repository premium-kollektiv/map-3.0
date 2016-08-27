
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
    
    tools: null,

    icon: {
        laden: null,
        haendler: null,
        sprecher: null
    },
    
    types: ['haendler','laeden','sprecher'],

    homelocation_default: [50.93766174471314,9.777832031250002],
    homelocation_default_zoom: 7,
    
    /*
     * kick off
     */
    init:function(){
        
        /*
         * initiate map
         */
        L.Icon.Default.imagePath = '/img/marker';
        this.map = L.map('map',{zoomControl:false});

        this.icon.default = new L.icon({
            iconUrl: '/img/marker/marker-icon-l.svg',
            shadowUrl: '/img/marker/marker-shadow.png',

            iconSize:     [36, 42], // size of the icon
            shadowSize:   [41, 41], // size of the shadow
            iconAnchor:   [18, 42], // point of the icon which will correspond to marker's location
            shadowAnchor: [10, 42],  // the same for the shadow
            popupAnchor:  [0, -38] // point from which the popup should open relative to the iconAnchor
        });
        this.icon.laden = new L.icon({
            iconUrl: '/img/marker/marker-icon-l.svg',
            shadowUrl: '/img/marker/marker-shadow.png',

            iconSize:     [36, 42], // size of the icon
            shadowSize:   [41, 41], // size of the shadow
            iconAnchor:   [18, 42], // point of the icon which will correspond to marker's location
            shadowAnchor: [10, 42],  // the same for the shadow
            popupAnchor:  [0, -38] // point from which the popup should open relative to the iconAnchor
        });
        this.icon.haendler = new L.icon({
            iconUrl: '/img/marker/marker-icon-h.svg',
            shadowUrl: '/img/marker/marker-shadow.png',

            iconSize:     [36, 42], // size of the icon
            shadowSize:   [41, 41], // size of the shadow
            iconAnchor:   [18, 42], // point of the icon which will correspond to marker's location
            shadowAnchor: [10, 42],  // the same for the shadow
            popupAnchor:  [0, -38] // point from which the popup should open relative to the iconAnchor
        });
        this.icon.sprecher = new L.icon({
            iconUrl: '/img/marker/marker-icon-s.svg',
            shadowUrl: '/img/marker/marker-shadow.png',

            iconSize:     [36, 42], // size of the icon
            shadowSize:   [41, 41], // size of the shadow
            iconAnchor:   [18, 42], // point of the icon which will correspond to marker's location
            shadowAnchor: [10, 42],  // the same for the shadow
            popupAnchor:  [0, -38] // point from which the popup should open relative to the iconAnchor
        });
        this.icon.sh = new L.icon({
            iconUrl: '/img/marker/marker-icon-sh.svg',
            shadowUrl: '/img/marker/marker-shadow.png',

            iconSize:     [36, 42], // size of the icon
            shadowSize:   [41, 41], // size of the shadow
            iconAnchor:   [18, 42], // point of the icon which will correspond to marker's location
            shadowAnchor: [10, 42],  // the same for the shadow
            popupAnchor:  [0, -38] // point from which the popup should open relative to the iconAnchor
        });
        this.icon.sl = new L.icon({
            iconUrl: '/img/marker/marker-icon-sl.svg',
            shadowUrl: '/img/marker/marker-shadow.png',

            iconSize:     [36, 42], // size of the icon
            shadowSize:   [41, 41], // size of the shadow
            iconAnchor:   [18, 42], // point of the icon which will correspond to marker's location
            shadowAnchor: [10, 42],  // the same for the shadow
            popupAnchor:  [0, -38] // point from which the popup should open relative to the iconAnchor
        });
        /*
         * tools setup
         */
        this.tools = $('#tools');
        
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
           this.map.setView(this.homelocation_default, this.homelocation_default_zoom);

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
               },function(){
                   // wenn keine standortabfrage möglich
                   map.map.setView(map.homelocation_default, map.homelocation_default_zoom);
               });
            }
        }
        else {
            map.map.setView(homeLocation, 14);
        }
    },
    
    initControls: function() {
        
        // home button
        $('.leaflet-bottom.leaflet-left').prepend('<div class="leaflet-control-home leaflet-bar leaflet-control"><a class="leaflet-control-zoom-home corner-all" href="#" title="eigener Standort"><i class="icon-home" aria-hidden="true"></i></a></div>').click(function(ev){
            ev.preventDefault();
            map.locateHome();
        });
        
        $('.leaflet-control-zoom-in').text('').html('<i class="icon-plus" aria-hidden="true"></i>');
        $('.leaflet-control-zoom-out').text('').html('<i class="icon-minus" aria-hidden="true"></i>');
        
        // info button
        $('.leaflet-bottom.leaflet-right').prepend('<div class="leaflet-control-info leaflet-bar leaflet-control"><a class="leaflet-control-zoom-info corner-all" href="#" title="zu meinem Standort"><i class="icon-info" aria-hidden="true"></i></a></div>').click(function(ev){
            ev.preventDefault();
            popup.info();
        });
        
        $('.leaflet-top.leaflet-right').prepend('<div class="leaflet-control-menu leaflet-bar leaflet-control"><a class="leaflet-control-menu corner-all" href="#" title="Öffne Menü"><i class="icon-bars" aria-hidden="true"></i></a></div>').click(function(ev){
            ev.preventDefault();
            map.tools.toggleClass('mobile-hidden');
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
        
        xhr.get('/item/list',{
            data: {
                types:types
            },
            success: function(marker) {
                map.printMarker(marker); 
            }
        });
        
    },
    
    printMarker: function(markers) {
        if (map.markerLayer != null) {
            map.map.removeLayer(map.markerLayer);
        }

        map.markerLayer = L.markerClusterGroup({
            maxClusterRadius:60,
            polygonOptions: {
                fillColor: '#000',
                color: '#000',
                weight: 4,
                opacity: 0.5,
                fillOpacity: 0.2
            }
        });
        
        for (i = 0; i<markers.length;i++) {

            var marker = new L.marker([parseFloat(markers[i][1][0]), parseFloat(markers[i][1][1])],{
                icon: map.getMarker(markers[i][2])
            });
            marker.id = markers[i][0];
            marker.offertype = markers[i][2];


            
            marker.bindPopup('<div style="text-align:center;"><i class="spinner-popup spinner--steps icon-spinner"></i></div>');
            /*
             * Lazy loading popup Data
             */
            marker.on('click', function(e) {
                
                var bubble = e.target.getPopup();
                
                xhr.get('/item/' + e.target.id,{
                    success: function(ret){
                        bubble.setContent(map.popupTpl(ret)+'');
                        bubble.update()
                        $('a.feedback').click(function(ev){
                            ev.preventDefault();
                            $this = $(this);
                            popup.feedback(ret);
                        });
                    },
                    fail: function(ret) {
                        bubble.setContent(ret.msg);
                        bubble.update();
                    },
                    loader: false
                });
            });
            
            map.markerLayer.addLayer(marker);
            
        }

        map.map.addLayer(map.markerLayer);
       
    },

    getMarker: function(offertypes) {

        /*
             'laeden' => 1,
             'haendler' => 2,
             'sprecher' => 3
         */

        var r = offertypes.join(':')+'';

        if(r == '1')  {
            return map.icon.laden;
        }
        else if(r == '2') {
            return map.icon.haendler;
        }
        else if(r == '3') {
            return map.icon.sprecher;
        }
        else if(r == '1:3') {
            return map.icon.sl;
        }
        else if(r == '2:3') {
            return map.icon.sh;
        }
        else if(r == '1:2') {
            return map.icon.haendler;
        }
        else {
            return map.icon.default;
        }
    },
    
    popupTpl: function(data) {
        
        var out = '<h2> ' + data.name + ' </h2>';
        document.zip = data.zip;
        console.log(data);

        // hide when only speaker
        if(data.products.length > 0 && false == (data.offertypes.length == 1 && data.offertypes[0] == 'Sprecher')) {
            out += '<small>' + data.products.join(', ') + '</small><br />';
        }

        if(data.street != '') {
            data.street = data.street + '<br />';
        }

        out +=

               '<p>' + 
                    data.street +
                    data.zip + ' ' + data.city + 
               '</p>' + 
               '<p>';
                
                    if(data.web) {
                        out += '<i style="width:12px;display:inline-block;" class="icon-globe" aria-hidden="true"></i> &nbsp;' + map.urlToLink(data.web) + '<br />';
                    }
                    
                    if(data.email) {
                        out += '<i style="width:12px;display:inline-block;" class="icon-envelope" aria-hidden="true"></i> &nbsp;' + map.emailToLink(data.email) + '<br />';
                    }

                    if(data.phone) {
                        out += '<i style="width:12px;display:inline-block;" class="icon-phone" aria-hidden="true"></i> &nbsp;' + map.phoneToLink(data.phone) + '<br />';
                    }
                    
                    out +=
               '</p>';

                out +=
                    '<p>' +
                        '<a class="feedback" href="#" data-zip="' + data.zip + '">Feedback zu diesem Eintrag?</a>' +
                    '</p>';
       
                return out;
        
    },

    feedback: function(zip) {
        alert(zip);
    },

    phoneToLink: function(phone) {
        return '<a href="tel:' + phone.replace(/^[0-9\+]/g,'') + '">' + phone + '</a>';
    },
    
    urlToLink: function(url) {

        console.log(url);
        
        var prefix = 'http://';

        if (url.substr(0, prefix.length) != prefix)
        {
            url = prefix + url;
        }

        var viewurl = url.substr(7);

        if(viewurl.substr(-1) == '/') {
            viewurl = viewurl.substr(0,(viewurl.length-1));
        }

        if(viewurl.substr(0,4) == 'www.') {
            viewurl = viewurl.substr(4);
        }

        console.log(viewurl);
        
        return '<a target="_blank" href="' + url + '">' + map.shorten(viewurl) + '</a>'
    },
    
    emailToLink: function(email) {
        return '<a href="mailto:'+email+'">' + map.shorten(email) + '</a>';
    },

    shorten: function(string, length) {

        if(length == undefined) {
            length = 30;
        }

        if(string.length > length) {
            return string.substr(0,(length-3)) + '...';
        }

        return string;
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