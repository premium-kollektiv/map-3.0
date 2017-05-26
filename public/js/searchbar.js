/*! typeahead-addresspicker - v1.0.0 - 2014-05-18
 * https://github.com/sgruhier/typeahead-addresspicker
 * Copyright (c) 2014 Sebastien Gruhier; Licensed MIT */(function(){var a=function(a,b){return function(){return a.apply(b,arguments)}},b={}.hasOwnProperty,c=function(a,c){function d(){this.constructor=a}for(var e in c)b.call(c,e)&&(a[e]=c[e]);return d.prototype=c.prototype,a.prototype=new d,a.__super__=c.prototype,a};!function(b){return this.AddressPickerResult=function(){function a(a,b){this.placeResult=a,this.fromReverseGeocoding=null!=b?b:!1,this.latitude=this.placeResult.geometry.location.lat(),this.longitude=this.placeResult.geometry.location.lng()}return a.prototype.addressTypes=function(){var a,b,c,d,e,f,g,h,i;for(c=[],h=this.addressComponents(),d=0,f=h.length;f>d;d++)for(a=h[d],i=a.types,e=0,g=i.length;g>e;e++)b=i[e],-1===c.indexOf(b)&&c.push(b);return c},a.prototype.addressComponents=function(){return this.placeResult.address_components||[]},a.prototype.address=function(){return this.placeResult.formatted_address},a.prototype.nameForType=function(a,b){var c,d,e,f;for(null==b&&(b=!1),f=this.addressComponents(),d=0,e=f.length;e>d;d++)if(c=f[d],-1!==c.types.indexOf(a))return b?c.short_name:c.long_name;return null},a.prototype.lat=function(){return this.latitude},a.prototype.lng=function(){return this.longitude},a.prototype.setLatLng=function(a,b){this.latitude=a,this.longitude=b},a.prototype.isAccurate=function(){return!this.placeResult.geometry.viewport},a.prototype.isReverseGeocoding=function(){return this.fromReverseGeocoding},a}(),this.AddressPicker=function(d){function e(c){null==c&&(c={}),this.markerDragged=a(this.markerDragged,this),this.updateBoundsForPlace=a(this.updateBoundsForPlace,this),this.updateMap=a(this.updateMap,this),this.options=b.extend({local:[],datumTokenizer:function(a){return Bloodhound.tokenizers.whitespace(a.num)},queryTokenizer:Bloodhound.tokenizers.whitespace,autocompleteService:{types:["geocode"]},zoomForLocation:16,reverseGeocoding:!1},c),e.__super__.constructor.call(this,this.options),this.options.map&&this.initMap(),this.placeService=new google.maps.places.PlacesService(document.createElement("div"))}return c(e,d),e.prototype.bindDefaultTypeaheadEvent=function(a){return a.bind("typeahead:selected",this.updateMap),a.bind("typeahead:cursorchanged",this.updateMap)},e.prototype.initMap=function(){var a,c,d;return(null!=(c=this.options)?null!=(d=c.map)?d.gmap:void 0:void 0)?this.map=this.options.map.gmap:(this.mapOptions=b.extend({zoom:3,center:new google.maps.LatLng(0,0),mapTypeId:google.maps.MapTypeId.ROADMAP,boundsForLocation:this.updateBoundsForPlace},this.options.map),this.map=new google.maps.Map(b(this.mapOptions.id)[0],this.mapOptions)),this.lastResult=null,a=b.extend({draggable:!0,visible:!1,position:this.map.getCenter(),map:this.map},this.options.marker||{}),this.marker=new google.maps.Marker(a),a.draggable?google.maps.event.addListener(this.marker,"dragend",this.markerDragged):void 0},e.prototype.get=function(a,c){var d;return d=new google.maps.places.AutocompleteService,this.options.autocompleteService.input=a,d.getPlacePredictions(this.options.autocompleteService,function(a){return function(d){return b(a).trigger("addresspicker:predictions",[d]),c(d)}}(this))},e.prototype.updateMap=function(a,c){return this.placeService.getDetails(c,function(a){return function(c){var d;return a.lastResult=new AddressPickerResult(c),a.marker&&(a.marker.setPosition(c.geometry.location),a.marker.setVisible(!0)),a.map&&null!=(d=a.mapOptions)&&d.boundsForLocation(c),b(a).trigger("addresspicker:selected",a.lastResult)}}(this))},e.prototype.updateBoundsForPlace=function(a){return a.geometry.viewport?this.map.fitBounds(a.geometry.viewport):(this.map.setCenter(a.geometry.location),this.map.setZoom(this.options.zoomForLocation))},e.prototype.markerDragged=function(){return this.options.reverseGeocoding?this.reverseGeocode(this.marker.getPosition()):(this.lastResult?this.lastResult.setLatLng(this.marker.getPosition().lat(),this.marker.getPosition().lng()):this.lastResult=new AddressPickerResult({geometry:{location:this.marker.getPosition()}}),b(this).trigger("addresspicker:selected",this.lastResult))},e.prototype.reverseGeocode=function(a){return null==this.geocoder&&(this.geocoder=new google.maps.Geocoder),this.geocoder.geocode({location:a},function(a){return function(c){return c&&c.length>0?(a.lastResult=new AddressPickerResult(c[0],!0),b(a).trigger("addresspicker:selected",a.lastResult)):void 0}}(this))},e.prototype.getGMap=function(){return this.map},e.prototype.getGMarker=function(){return this.marker},e}(Bloodhound)}(jQuery)}).call(this);

var search = {

    searchbar: null,
    searchbarIcon: null,
    checkTimer: null,
    checktimes: 0,


    init: function () {


        this.searchbar = $('#searchbar');
        this.searchbarIcon = $('#searchbar-icon');

        this.initSearch();


        this.searchbar.css({
            'vertical-align': 'inherit',
            'background-color': '#fff'
        });
        this.searchbarIcon.css({
            position: 'absolute'
        });

    },
    initSearch: function() {

        var addressPicker = new AddressPicker();

        $('#searchbar').typeahead(null, {
            displayKey: 'description',
            source: addressPicker.ttAdapter()
        });

        // Proxy inputs typeahead events to addressPicker
        addressPicker.bindDefaultTypeaheadEvent($('#searchbar'))

        // Listen for selected places result
        $(addressPicker).on('addresspicker:selected', function (event, result) {

            console.log(map);
            map.setView(new L.latLng(result.lat(),result.lng()));

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

$(document).ready(function(){
   search.init();
});