var app = {
    init: function() {
        popup.init();

        loader.init();

        if($('#map').length > 0) {
            map.init();
        }

        if($('#searchbar').length > 0) {
            search.init();
        }

        map.loadMarker();


    }
};

$(document).ready(function(){

    app.init();

});

var Base64 = {


    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

};
// AIzaSyC_Kz1w7iY6jsU04Rb2uPN46la6QEwGRVA

var config = {
    baseUri: window.location.origin + '/',
    protocol: window.location.protocol
};



!(function (root, $, Bloodhound) {

    //   'use strict';

    /**
     * Default function that returns string representation of OSM place type.
     * Used by default implementation of method formatResult.
     *
     * @param feature photon feature
     *
     * @return formatted string representation of OSM place type
     */

    var _formatType = function (feature) {
        return feature.properties.osm_value;
    };

    /**
     * Supplier of default formatResult function.
     *
     * @param formatType implementation of formatType function
     *
     * @return default implementation of formatResult function
     */
    var _formatResultSupplier = function (formatType) {
        return function (feature) {
            var formatted = feature.properties.name,
                type = formatType(feature);

            if (type) {
                formatted += ', ' + type;
            }

            if (feature.properties.city &&
                feature.properties.city !== feature.properties.name) {
                formatted += ', ' + feature.properties.city;
            }

            if (feature.properties.country) {
                formatted += ', ' + feature.properties.country;
            }

            return formatted;
        };
    };

    /**
     * Constructor of suggestion engine. Take options as litteral object. All
     * options are optionals.
     *
     * @param options#url URL of the Photon API to use. Default:
     *        'http://photon.komoot.de'
     * @param options#limit limit number of results. Default: 5
     * @param options#formatResult function to control the way geojson features
     *        are displayed in the results box
     * @param options#formatType function to control the way features types
     *        (amenity, school, etc.) are displayed in the default formatResult
     *        function
     * @param options#lat, options#lon latitude and longitude to make search with
     *        priority to a geo position
     * @param options#lang preferred language
     */

    PhotonAddressEngine = function (options) {

        options = options || {};

        var formatType = options.formatType || _formatType,
            formatResult = options.formatResult ||
                _formatResultSupplier(formatType),
            url = options.url || 'http://photon.komoot.de',
            limit = options.limit || 5,
            reqParams = {};

        if (options.lat && options.lon) {
            reqParams.lat = options.lat;
            reqParams.lon = options.lon;
        }

        if (options.lang) {
            reqParams.lang = options.lang;
        }

        reqParams.limit = limit;

        console.log(reqParams);

        var bloodhound = new Bloodhound({

            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('description'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,

            /*
             local: [],
             queryTokenizer: Bloodhound.tokenizers.nonword,
             datumTokenizer: function (feature) {
             return Bloodhound.tokenizers.obj.whitespace([
             'country', 'city', 'postcode', 'name', 'state'
             ])(feature.properties);
             },
             */
            identify: function (feature) {
                return feature.properties.osm_id;
            },
            remote: {
                url: url + '/api/',
                sufficient: limit,
                prepare: function (query, settings) {


                    reqParams.q = query;
                    settings.url += '?' + $.param(reqParams);

                    settings.type = "GET";

                    return settings;
                },

                transform: function (response) {
                    var self = this;

                    for(i=0;i<response.features.length;i++) {
                        response.features[i].description = formatResult(response.features[i]);
                    }

                    return response.features || [];
                }
            }
        });

        /* Redefine bloodhound.search(query, sync, async) function */
        var _oldSearch = bloodhound.search;

        bloodhound.search = function (query, sync, async) {
            var syncPromise = jQuery.Deferred(),
                asyncPromise = jQuery.Deferred();

            _oldSearch.call(bloodhound, query, function (datums) {
                syncPromise.resolve(datums);
            }, function (datums) {
                asyncPromise.resolve(datums);
            });

            $.when(syncPromise, asyncPromise)
                .then(function (syncResults, asyncResults) {
                    var allResults = [].concat(syncResults, asyncResults);

                    $(bloodhound).trigger('addresspicker:predictions', [ allResults ]);

                    sync(syncResults);
                    async(asyncResults);
                });
        };

        /**
         * Transforms default typeahead event typeahead:selected to
         * addresspicker:selected. The same event is triggered by
         * bloodhound.reverseGeocode.
         *
         * @param typeahead jquery wrapper around address input
         */
        bloodhound.bindDefaultTypeaheadEvent = function (typeahead) {
            typeahead.bind('typeahead:selected', function (event, place) {
                $(bloodhound).trigger('addresspicker:selected', [ place ]);
            });
        };

        /**
         * Makes reverse geocoding of position and triggers event
         * addresspicker:selected with result.
         *
         * @param position array with latitude & longitude
         */
        bloodhound.reverseGeocode = function (position) {
            $.get(url + '/reverse', {
                lat: position[0],
                lon: position[1]
            }).then(function (response) {
                if (response.features) {
                    var feature = response.features[0];
                    feature.description = formatResult(feature);

                    $(bloodhound).trigger('addresspicker:selected', [ feature ]);
                }
            });
        };

        /* test-code */
        bloodhound.__testonly__ = {};
        bloodhound.__testonly__.defaultFormatType = _formatType;
        bloodhound.__testonly__.defaultFormatResult =
            _formatResultSupplier(_formatType);
        /* end-test-code */
        return bloodhound;
    };



    //export PhotonAddressEngine;

})(this, jQuery, Bloodhound);

var loader = {

    element: null,
    icon:null,

    init: function() {
        this.element = $('#searchbar-icon');
        this.icon = $('#searchbar-icon i');
    },

    start: function() {
        this.icon.removeClass('icon-search');
        this.icon.addClass('spinner spinner--steps icon-spinner');
    },

    stop: function() {
        this.icon.removeClass('spinner spinner--steps icon-spinner');
        this.icon.addClass('icon-search');
    }
};

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

    types: ['haendler','laeden','sprecher','webshop'],

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

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

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
         * check is there are an hash tag to provide item information to zoom and center
         * otherwise check if therre is a state saved in session go to last state
         * otherwise center to germany and try to locate by browser
         *
         */
        var state = session.get('state');

        if(window.initData != undefined) {

            var popupLat = window.initData.lat;
            var winLat = parseFloat(window.initData.lat)+0.0005;

            this.map.setView(new L.LatLng(winLat,window.initData.lng), 16);

            var popup = new L.Popup();

            popup.setLatLng(new L.LatLng(winLat,window.initData.lng));
            popup.setContent(this.popupTpl(window.initData));

            this.map.addLayer(popup);

        }
        else if(state != undefined) {

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

    getLatLng: function() {
        var latLng = this.map.getCenter();
        return [latLng.lat,latLng.lng];
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

        //console.log(markers);

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

        var out = '<h2> ' + data.name + '</h2>';
        document.zip = data.zip;
        //console.log(data);

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
            '<i style="width:12px;display:inline-block;" class="icon-bullhorn" aria-hidden="true"></i> &nbsp;<a class="feedback" href="#" data-zip="' + data.zip + '">Feedback zu diesem Eintrag?</a><br />' +
            '<i class="icon-link" aria-hidden="true"></i> &nbsp;<a onclick="this.style.display=\'none\';this.nextSibling.style.display=\'inline\';this.nextSibling.select();return false" id="link-item" href="' + config.BaseUri + '#' + data.id + '" title="Eintrag verlinken">Eintrag verlinken</a><input style="display:none;" type="text" id="link-item-url" value="' + config.baseUri + data.uri + '" />'
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

        //console.log(url);

        var prefix = 'http://';

        if (!(url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://'))
        {
            url = prefix + url;
        }

        var viewurl = url.substr(7);

        if(viewurl.substr(-1) == '/') {
            viewurl = viewurl.substr(0,(viewurl.length-1));
        }

        if(viewurl.substr(0,1) == '/') {
            viewurl = viewurl.substr(1);
        }

        if(viewurl.substr(0,4) == 'www.') {
            viewurl = viewurl.substr(4);
        }

        console.log(viewurl);
        console.log(url);

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



var popup = {

    feedback: function(data) {
        this.html(

            '<h1>Feedback zu ' + data.name + '</h1>' +
            '<div id="feedback-msg" class="info" style="display:none;"></div>' +

            '<div style="display:none;text-align: center; font-size: 36px;margin:50px;" id="feedback-loader"><i class="spinner spinner--steps icon-spinner"></i></div>' +
            '<div id="feedback">' +
            '<p class="info">' +
            'Ist Dir ein Fehler aufgefallen? Gib uns gerne bescheid..' +
            '</p>' +

            '<form id="feedbackform">' +
            '<p>' +
            '<input class="corner-all" type="email" name="email" placeholder="Deine Mailadresse" />' +
            '</p>' +
            '<p>' +
            '<textarea class="corner-all" name="feedback" placeholder="Deine Nachricht" /> ' +
            '<input type="hidden" name="id" value="' + data.id + '"/> ' +
            '<input type="hidden" name="zip" value="' + data.zip + '"/> ' +
            '</p>' +
            '<p>' +
            '<button class="corner-all" type="submit">Absenden</button>' +
            '</p>' +
            '</form>' +
            '</div>'

        );

        var $feedbackform = $('#feedbackform');

        $feedbackform.submit(function(ev){
            ev.preventDefault();
            $feedbackloader = $('#feedback-loader');
            $feedbackloader.show();
            $('#feedback').hide();
            xhr.post('/feedback',{
                data: $feedbackform.serialize(),
                success: function(ret){
                    $('#feedback-msg').text(ret.msg).fadeIn(200);
                    $feedbackloader.hide();
                },
                complete: function() {
                    $feedbackloader.hide();
                }
            });
        });
    },

    init: function() {

        $('.bt-legend').click(function(ev){
            ev.preventDefault();
            popup.legend();
        });

    },

    legend: function() {
        popup.html(
            '<h1>Legende</h1>' +

            '<div class="info">'+
            '<p>Einzelne Marker-Icon Typen können durch einen Klick auf das Icon in der Toolbar aus oder eingeblendet werden</p>' +
            '<p>Standardmäßig werden alle Marker-Icons eingeblendet</p>' +
            '</div>' +

            '<h2><img src="' + config.baseUri + '/img/marker/marker-icon-l.svg" /> Laden</h2>' +
            '<p>Cafe/Club/Bar/Restaurant/Designladen/Hackerspace/Kulturzentrum/etc. meist mit direktem Konsum vor Ort. Bei Interesse bitte direkt beim Laden nachfragen, ob man Flaschen/Kisten zum mitnehmen kaufen kann (wie zb. bei einem Kiosk).</p>' +

            '<hr />' +

            '<h2><img src="' + config.baseUri + '/img/marker/marker-icon-h.svg" /> (Groß)Handel</h2>' +
            '<p>meist Getränkemarkt und Großhandel, kaufen von Premium-Kisten/Paletten für Privatpersonen und für Läden möglich</p>' +

            '<hr />' +

            '<h2><img src="' + config.baseUri + '/img/marker/marker-icon-s.svg" /> Lokaler Kontakt</h2>' +
            '<p>die Premium-"Sprecherinnen" vor Ort, welche sich um Handel und Läden kümmern, und für lokale Fragen jeder Art zur Verfügung stehen.</p>' +

            '<hr />' +

            '<h2><img src="' + config.baseUri + '/img/marker/marker-icon-l.svg" /> Onlinehandel</h2>' +
            '<p>Eine Bestellung von Premium-Getränken über den Versandweg ist der un-ökologischste Weg an Premium zu kommen. Trotzdem wollen wir dies als Option anbieten, denn in manchen Regionen ist das nicht zu umgehen ohne auf dem Trockenen zu sitzen. Bitte wähle den regional nächstgelegenen Onlinehandel. Der Gesamtpreis einer Bestellung (Produkt + Versand) ist üblicherweise bei jedem Anbieter gleich, denn diese orientieren sich an einer unverbindlichen und ökologischen Preisempfehlung.</p>'
        );
    },

    info: function() {
        this.html(
            '<h1>Impressum</h1>' +

            '<p>Uwe Lübbermann</p>' +
            '<p>Brauerknechtgraben 45<br></p>' +
            '<p>20459 Hamburg</p>' +
            '<p><br></p>' +
            '<p>Mail: <a href="mailto:uwe@premium-cola.de" mce_href="mailto:uwe@premium-cola.de">uwe@premium-cola.de</a> (<a target="_blank" mce_href="http://www.premium-cola.de/downloads/pgp/uwe@premium-cola.de-0xC67412EB-pub.asc" href="http://www.premium-cola.de/downloads/pgp/uwe@premium-cola.de-0xC67412EB-pub.asc">PGP-Key</a>) oder übers <a href="http://www.premium-cola.de/component/contact/47-kontakt/7-premium-kontakt" mce_href="http://www.premium-cola.de/component/contact/47-kontakt/7-premium-kontakt">Mail-Formular</a><br mce_bogus="1"></p><p>Twitter: <a target="_blank" mce_href="http://twitter.com/luebbermann" href="http://twitter.com/luebbermann">@luebbermann</a><br></p>' +

            '<p>Fax: +49 (0)40 74 02 09 81 87</p>' +

            '<p><span style="display: none;" mce_style="display: none;">Diese E-Mail-Adresse ist gegen Spambots geschützt! Sie müssen JavaScript aktivieren, damit Sie sie sehen können </span></p>' +
            '<p>Telefon: +49 (0)172 86 58 588 (telefoniert eher ungern)</p><p><br></p>' +
            '<p>USt-IdNr: DE243037244</p>' +
            '<p>Inhaltlich verantwortlich nach § 55 Abs. 2 RStV: Uwe Lübbermann</p><p><br></p><p>Bio-zertifiziert für Bier und Limonaden, Öko-Kontrollstelle DE-ÖKO-006 via <a href="http://www.abcert.de" mce_href="http://www.abcert.de" target="_blank">ABCERT</a>.</p>' +
            '<p><br></p>' +
            '<p>Map data &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a> contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a></p>' +
            ' Imagery © <a target="_blank" href="http://mapbox.com">Mapbox</a></p>' +
            ' <p><a target="_blank" title="A JS library for interactive maps" href="http://leafletjs.com">Leaflet</a> A JS library for interactive maps</p>');
    },

    html: function(html) {
        $.magnificPopup.open({
            items: {
                src: '<div class="white-popup border-all">' + html + '</div>', // can be a HTML string, jQuery object, or CSS selector
                type: 'inline'
            },
            closeMarkup: '<button onclick="closePopup();" title="%title%" type="button" class="mfp-close"><i class="icon-close" aria-hidden="true"></i></button>'
        });
    }
};
// dirty fix for chrome to close popup but works :)
window.closePopup = function() {
    $.magnificPopup.close();
}

var search = {

    searchbar: null,
    searchbarIcon:null,
    checkTimer: null,
    checktimes:0,


    init: function() {


        this.searchbar = $('#searchbar');
        this.searchbarIcon = $('#searchbar-icon');

        this.searchbar.premiumSearch({
            lang: 'de',
            latLng: map.getLatLng(),
            map: map
        });


        this.searchbar.css({
            'vertical-align': 'inherit',
            'background-color': '#fff'
        });
        this.searchbarIcon.css({
            position:'absolute'
        });




        // fix for lazy loading gapi
        /*
         window.gcallback = function() {
         search.gcallback();
         }

         eval(base.decode('JC5nZXRTY3JpcHQoYmFzZS5kZWNvZGUoJ0x5OXRZWEJ6TG1kdmIyZHNaV0Z3YVhNdVkyOXRMMjFoY0hNdllYQnBMMnB6UDJ4cFluSmhjbWxsY3oxd2JHRmpaWE1tYkdGdVozVmhaMlU5WkdVbVkyRnNiR0poWTJzOVoyTmhiR3hpWVdOcicpLGZ1bmN0aW9uKCl7fSk7'));
         */
        /*
         $('#searchbar').keyup(function(){

         search.searchbar.val($(this).val());
         e = jQuery.Event("keyup");
         e.which = 13 //enter key
         search.searchbar.trigger(e);
         });
         */

    },

    /*
     WORKAROUND:
     check if there are no place results check own database
     */
    doCheck: function (dropdown) {
        var paccontainer = $('.pac-container');

        if (dropdown.style.display == '') {

            //paccontainer.children('.areasearch-owndb').remove();

            console.log('has results? true');
            search.checkTimer = null;
        }
        else if (dropdown.style.display == 'none') {

            /*
             IF there are no results check the remium db
             */


            paccontainer.css('display','block');
            paccontainer.append('<div class="areasearch-owndb pac-item areasearch" onclick="alert(\'make onclick\')"><span class="pac-icon pac-icon-areas"></span><span class="pac-item-query"><span class="pac-matched"></span>qwerty</span> <span>Area</span></div>');

            console.log('has results? false');
            search.checkTimer = null;
        } else if (search.checktimes < 20) { // check at most 10 seconds
            search.checktimes++;
            search.checkTimer = setTimeout(function () {
                search.doCheck(dropdown);
            }, 100);
        }
    },
    doCheckInit: function() {

        this.searchbar.keyup(function () {

            // the input node
            var inp = search.searchbar[0],
                value = inp.value; // value of input node
            if (value && search.oldValue != value) { // has value and changed, start check
                // drop-down list and message div
                var dropdown = document.getElementsByClassName('pac-container')[0],
                    msg = document.getElementById('msg');
                // trick! change style to display='block'
                dropdown.style.display = 'block';
                // update stored value
                search.oldValue = value;
                // initiate checktimes
                search.checktimes = 0;
                // clear previous timer if exists
                if (search.checkTimer)
                    clearTimeout (search.checkTimer);
                search.checkTimer = setTimeout(function () {
                    search.doCheck(dropdown, msg);
                }, 100);
            }
        });
    },

    /*
     Callback when address api is loaded
     */
    gcallback: function() {

        this.doCheckInit();

        this.searchbar.geocomplete({
            types:['establishment','geocode'],
            placeChanged: function() {
                console.log('TEst123');
                search.oldValue = search.searchbar[0].value;
            }
        }).bind("geocode:result", function(event, result){

            search.setViewport(result);
        });
    },

    setViewport: function(result) {

        //console.log(result);
        //map.map.fitBounds();
        //map.map.setView([result.geometry.location.lat(),result.geometry.location.lng()],12);
        if (result.geometry.viewport != undefined) {
            map.map.fitBounds([[result.geometry.viewport.getSouthWest().lat(),
                result.geometry.viewport.getSouthWest().lng()],
                [result.geometry.viewport.getNorthEast().lat(),
                    result.geometry.viewport.getNorthEast().lng()]]);
            //map.map.setZoom(18);
        } else if (result.geometry.bounds != undefined) {
            map.fitBounds([[result.geometry.bounds.getSouthWest().lat(),
                result.geometry.bounds.getSouthWest().lng()],
                [result.geometry.bounds.getNorthEast().lat(),
                    result.geometry.bounds.getNorthEast().lng()]]);
        } else { // give up, pick an arbitrary zoom level
            map.map.setView([result.geometry.location.lat(),result.geometry.location.lng()],15);
        }

    }
};

/*
 * Session Objects
 */
var session = {

    /*
     switch to check localstorage
     */
    ls: null,

    init: function(){

        /*
         check local storage
         */
        if(this.lsTest() === true) {
            this.ls = true;
        } else {
            ls = false;
        }

    },

    /*
     * set a session value
     */
    set: function(key,value) {
        if(this.ls) {
            var obj = {data:value};
            localStorage.setItem(key, JSON.stringify(obj));
        }
    },

    /*
     * get a value
     */
    get: function(key) {
        if(this.ls) {
            var obj = JSON.parse(localStorage.getItem(key));

            if(obj != undefined) {
                return obj.data;
            }
        }
        return undefined;
    },

    /*
     * Test function for local storage
     */
    lsTest: function (){
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }
};


var xhr = {

    startRequest: function() {
        loader.start();
    },

    stopRequest: function() {
        loader.stop();
    },

    get: function(url, options) {

        var settings = {
            loader:true,
            data:null,
        };

        $.extend(settings, options);
        if(settings.loader) {
            this.startRequest();
        }


        $.ajax({
            url: config.baseUri + url,
            type:'get',
            dataType:'json',
            data:settings.data,
            success:function(ret) {

                if(settings.loader) {
                    xhr.stopRequest();
                }

                if(ret.status == 1) {
                    if(settings.success != undefined) {
                        settings.success(ret.data);
                    }
                }
                else if(ret.status == 0) {

                    if(settings.fail != undefined) {
                        settings.fail(ret);
                    }
                    else {
                        if(ret.msg) {
                            popup.html(ret.msg);
                        }
                    }
                }

            },
            error: function() {
                if(settings.loader) {
                    xhr.stopRequest();
                }
            },
            complete: function() {

            }
        });
    },

    post: function(url, options) {

        var settings = {
            loader:true,
            data:null,
        };

        $.extend(settings, options);
        if(settings.loader) {
            this.startRequest();
        }

        $.ajax({
            url: config.baseUri + url,
            type:'post',
            dataType:'json',
            data:settings.data,
            success:function(ret) {

                if(settings.loader) {
                    xhr.stopRequest();
                }

                if(ret.status == 1) {
                    if(settings.success != undefined) {
                        settings.success(ret.data);
                    }
                }
                else if(ret.status == 0) {

                    if(settings.fail != undefined) {
                        settings.fail(ret);
                    }
                    else {
                        if(ret.msg) {
                            popup.html(ret.msg);
                        }
                    }
                }

            },
            error: function() {
                if(settings.loader) {
                    xhr.stopRequest();
                }
            },
            complete: function() {

            }
        });

    }
};


var helper = {

    /*
     Method format komoot results
     */
    formatResult: function(feature) {

        var items = [];

        /*
         if(feature.properties.name != undefined) {
         items.push(feature.properties.name);
         }*/

        var type = helper.formatType(feature);

        if (type) {
            items.push(type);
        }

        if (feature.properties.city &&
            feature.properties.city !== feature.properties.name) {
            items.push(feature.properties.city);
        }

        if (feature.properties.country) {
            items.push(feature.properties.country);
        }

        return items.join(', ');
    },

    formatResultPremium: function (item) {
        return item.name;
    },

    formatType: function (feature) {
        return feature.properties.osm_value;
    }
};

(function ( $ ) {

    $.fn.premiumSearch = function(options) {

        console.log(options);

        var reqParams = {};
        var map = false;

        this.setLocation = function(latLng) {
            reqParams.lat = latLng[0]+''.substr(0, 7);
            reqParams.lon = latLng[1]+''.substr(0, 7);
        };

        if(options.latLng != undefined) {
            this.setLocation(options.latLng);
        }

        if(options.lang != undefined) {
            reqParams.lang = options.lang;
        }

        if(options.map != undefined) {
            map = options.map;
        }

        //var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];


        var premiumPlaces = new Bloodhound({
            datumTokenizer: function(datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit:4,
            cache:false,
            name: 'premium',
            remote: {
                url: config.baseUri + 'search/',
                replace: function(url, uriEncodedQuery) {

                    return '/search/' + uriEncodedQuery;
                },

                filter: function(response) {
                    // Map the remote source JSON array to a JavaScript object array

                    //console.log(response.features);


                    loader.stop();

                    return $.map(response.data.items, function(item) {


                        console.log('getIcon');
                        console.log(item.offertypes);
                        var iconObj = map.getMarker(item.offertypes);

                        var icon = '/img/marker/marker-icon-l.svg';

                        console.log(iconObj);

                        if(iconObj.options.iconUrl != undefined){
                            icon = iconObj.options.iconUrl;
                        }

                        return {
                            value: helper.formatResultPremium(item),
                            data: item,
                            latLng:[item.lat,item.lng],
                            icon: icon
                        };
                    });
                },

                prepare: function(query, settings) {

                    loader.start();

                    alert(query);

                    settings.url += query;

                    return settings;
                }
            }
        });

// Initialize the Bloodhound suggestion engine
        premiumPlaces.initialize();

        $(premiumPlaces).on('addresspicker:selected', function (event, result) {

            //console.log(result.lat());
            map.map.setView(new L.latLng(result.lat(), result.lng()),12);

        });

// Instantiate the Typeahead UI
        /*
        this.typeahead(null, {
            // Use 'value' as the displayKey because the filter function
            // returns suggestions in a javascript object with a variable called 'value'
            displayKey: 'value',
            source: premiumPlaces.ttAdapter(),
            templates: {
                //header: '<h3 class="league-name">Premium</h3>',
                suggestion: function (obj) {

                    console.log('suggest:');
                    console.log(obj);

                    var address = obj.data.zip + ' ' + obj.data.city;

                    if (obj.data.street != '') {
                        address = obj.data.street + ', ' + address;
                    }

                    return '<span class="premium-list">' +
                        '<img src="' + obj.icon + '" />' +
                        '<span class="cnt">' +
                        '<h5>' + obj.data.name + '</h5>' +
                        '<span class="address">' + address + '</span>'
                    '</span>' +
                    '</span>';
                }
            }
        });
        */


        var addressPicker = new AddressPicker({

        });

        addressPicker.initialize();



        addressPicker.bindDefaultTypeaheadEvent(this);

        // Listen for selected places result

        $(addressPicker).on('addresspicker:selected', function (event, result) {

            //console.log(result.lat());
            map.map.setView(new L.latLng(result.lat(), result.lng()),20);

        });



        /*
        this.typeahead(null, {
            displayKey: 'description',
            source: addressPicker.ttAdapter()
        });
        */


         this.typeahead({},
         {
             // Use 'value' as the displayKey because the filter function
             // returns suggestions in a javascript object with a variable called 'value'
             displayKey: 'value',
             source: premiumPlaces.ttAdapter(),
             templates: {
                 //header: '<h3 class="league-name">Premium</h3>',
                 suggestion: function (obj) {

                     console.log('suggest:');
                     console.log(obj);

                     var address = obj.data.zip + ' ' + obj.data.city;

                     if (obj.data.street != '') {
                         address = obj.data.street + ', ' + address;
                     }

                     return '<span class="premium-list">' +
                         '<img src="' + obj.icon + '" />' +
                         '<span class="cnt">' +
                         '<h5>' + obj.data.name + '</h5>' +
                         '<span class="address">' + address + '</span>'
                     '</span>' +
                     '</span>';
                 }
             }
         },
         {
             name: 'addresses',
             displayKey: 'description',
             source: addressPicker.ttAdapter(),
             templates: {
                //header: '<h3 class="addressses">Addressen</h3>',
                 suggestion: function (obj) {



                 return '<span class="premium-list">' +
                 '<img src="/img/marker/marker-icon.svg" />' +
                 '<span class="cnt">' +
                 '<h5>' + obj.description + '</h5>' +
                 '<span class="address"></span>'
                 '</span>' +
                 '</span>';
                 }
             }
         }
         ).on('typeahead:selected', function (obj, datum) {

             if(map !== false) {

                 if(datum.latLng != undefined && datum.latLng.length >= 2) {

                     map.map.setView(new L.latLng(datum.latLng[0],datum.latLng[1]));
                 }
             }
         });
         /*
         this.bind('typeahead:select',function(ev, suggestion){
         console.log(suggestion, ev);
         });
         */

        return this;
    };

}( jQuery ));

(function() {
    var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    (function($) {
        this.AddressPickerResult = (function() {
            function AddressPickerResult(placeResult, fromReverseGeocoding) {
                if(placeResult) {
                    this.placeResult = placeResult;
                    this.fromReverseGeocoding = fromReverseGeocoding != null ? fromReverseGeocoding : false;
                    this.latitude = this.placeResult.geometry.location.lat();
                    this.longitude = this.placeResult.geometry.location.lng();
                }
            }

            AddressPickerResult.prototype.addressTypes = function() {
                var component, type, types, _i, _j, _len, _len1, _ref, _ref1;
                types = [];
                _ref = this.addressComponents();
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    component = _ref[_i];
                    _ref1 = component.types;
                    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                        type = _ref1[_j];
                        if (types.indexOf(type) === -1) {
                            types.push(type);
                        }
                    }
                }
                return types;
            };

            AddressPickerResult.prototype.addressComponents = function() {
                return this.placeResult.address_components || [];
            };

            AddressPickerResult.prototype.address = function() {
                return this.placeResult.formatted_address;
            };

            AddressPickerResult.prototype.nameForType = function(type, shortName) {
                var component, _i, _len, _ref;
                if (shortName == null) {
                    shortName = false;
                }
                _ref = this.addressComponents();
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    component = _ref[_i];
                    if (component.types.indexOf(type) !== -1) {
                        return (shortName ? component.short_name : component.long_name);
                    }
                }
                return null;
            };

            AddressPickerResult.prototype.lat = function() {
                return this.latitude;
            };

            AddressPickerResult.prototype.lng = function() {
                return this.longitude;
            };

            AddressPickerResult.prototype.setLatLng = function(latitude, longitude) {
                this.latitude = latitude;
                this.longitude = longitude;
            };

            AddressPickerResult.prototype.isAccurate = function() {
                return !this.placeResult.geometry.viewport;
            };

            AddressPickerResult.prototype.isReverseGeocoding = function() {
                return this.fromReverseGeocoding;
            };

            return AddressPickerResult;

        })();
        return this.AddressPicker = (function(_super) {
            __extends(AddressPicker, _super);

            function AddressPicker(options) {
                if (options == null) {
                    options = {};
                }
                this.markerDragged = __bind(this.markerDragged, this);
                this.updateBoundsForPlace = __bind(this.updateBoundsForPlace, this);
                this.updateMap = __bind(this.updateMap, this);
                this.options = $.extend({
                    local: [],
                    datumTokenizer: function(d) {
                        return Bloodhound.tokenizers.whitespace(d.num);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    autocompleteService: {
                        types: ["geocode"]
                    },
                    zoomForLocation: 16,
                    reverseGeocoding: false,
                    placeDetails: true
                }, options);
                AddressPicker.__super__.constructor.call(this, this.options);
                if (this.options.map) {
                    this.initMap();
                }
                this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
            }

            AddressPicker.prototype.bindDefaultTypeaheadEvent = function(typeahead) {
                typeahead.bind("typeahead:selected", this.updateMap);
                return typeahead.bind("typeahead:cursorchanged", this.updateMap);
            };

            AddressPicker.prototype.initMap = function() {
                var markerOptions, _ref, _ref1;
                if ((_ref = this.options) != null ? (_ref1 = _ref.map) != null ? _ref1.gmap : void 0 : void 0) {
                    this.map = this.options.map.gmap;
                } else {
                    this.mapOptions = $.extend({
                        zoom: 3,
                        center: new google.maps.LatLng(0, 0),
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        boundsForLocation: this.updateBoundsForPlace
                    }, this.options.map);
                    this.map = new google.maps.Map($(this.mapOptions.id)[0], this.mapOptions);
                }
                this.lastResult = null;
                markerOptions = $.extend({
                    draggable: true,
                    visible: false,
                    position: this.map.getCenter(),
                    map: this.map
                }, this.options.marker || {});
                this.marker = new google.maps.Marker(markerOptions);
                if (markerOptions.draggable) {
                    return google.maps.event.addListener(this.marker, 'dragend', this.markerDragged);
                }
            };

            AddressPicker.prototype.get = function(query, cb) {
                var service;
                service = new google.maps.places.AutocompleteService();
                this.options.autocompleteService.input = query;
                return service.getPlacePredictions(this.options.autocompleteService, (function(_this) {
                    return function(predictions) {
                        $(_this).trigger('addresspicker:predictions', [predictions]);
                        return cb(predictions);
                    };
                })(this));
            };

            AddressPicker.prototype.updateMap = function(event, place) {

                if(place.place_id != undefined) {

                    if (this.options.placeDetails) {
                        return this.placeService.getDetails(place, (function (_this) {
                            return function (response) {
                                var _ref;
                                _this.lastResult = new AddressPickerResult(response);
                                if (_this.marker) {
                                    _this.marker.setPosition(response.geometry.location);
                                    _this.marker.setVisible(true);
                                }
                                if (_this.map) {
                                    if ((_ref = _this.mapOptions) != null) {
                                        _ref.boundsForLocation(response);
                                    }
                                }
                                return $(_this).trigger('addresspicker:selected', _this.lastResult);
                            };
                        })(this));
                    } else {

                        return $(this).trigger('addresspicker:selected', place);
                    }
                }
            };

            AddressPicker.prototype.updateBoundsForPlace = function(response) {
                if (response.geometry.viewport) {
                    return this.map.fitBounds(response.geometry.viewport);
                } else {
                    this.map.setCenter(response.geometry.location);
                    return this.map.setZoom(this.options.zoomForLocation);
                }
            };

            AddressPicker.prototype.markerDragged = function() {
                if (this.options.reverseGeocoding) {
                    return this.reverseGeocode(this.marker.getPosition());
                } else {
                    if (this.lastResult) {
                        this.lastResult.setLatLng(this.marker.getPosition().lat(), this.marker.getPosition().lng());
                    } else {
                        this.lastResult = new AddressPickerResult({
                            geometry: {
                                location: this.marker.getPosition()
                            }
                        });
                    }
                    return $(this).trigger('addresspicker:selected', this.lastResult);
                }
            };

            AddressPicker.prototype.reverseGeocode = function(position) {
                if (this.geocoder == null) {
                    this.geocoder = new google.maps.Geocoder();
                }
                return this.geocoder.geocode({
                    location: position
                }, (function(_this) {
                    return function(results) {
                        if (results && results.length > 0) {
                            _this.lastResult = new AddressPickerResult(results[0], true);
                            return $(_this).trigger('addresspicker:selected', _this.lastResult);
                        }
                    };
                })(this));
            };

            AddressPicker.prototype.getGMap = function() {
                return this.map;
            };

            AddressPicker.prototype.getGMarker = function() {
                return this.marker;
            };

            return AddressPicker;

        })(Bloodhound);
    })(jQuery);

}).call(this);