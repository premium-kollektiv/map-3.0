require('typeahead.js');
var Bloodhound = require('bloodhound-js');

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

        /*
            INIT BLOODHOUND FOR ADDRESSES
         */
        var addresses = new Bloodhound({
            datumTokenizer: function(datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit:4,
            cache:false,
            name: 'addresses',
            remote: {
                url: config.protocol + '//photon.komoot.de/api/?',
                transform: function(response) {
                    // Map the remote source JSON array to a JavaScript object array

                    //console.log(response.features);


                    loader.stop();

                    return $.map(response.features, function(item) {

                        if(item.geometry.coordinates != undefined) {

                            return {
                                value: helper.formatResult(item),
                                data: item,
                                latLng: [item.geometry.coordinates[1], item.geometry.coordinates[0]]
                            };
                        }
                    });
                },
                prepare: function(query, settings) {

                    loader.start();

                    reqParams.q = query;

                    settings.url += $.param(reqParams);

                    return settings;
                }
            }
        });

        /*
            BLOODHOUND FOR Premium Places
         */
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
                transform: function(response) {
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

                    settings.url += query;

                    return settings;
                }
            }
        });

        addresses.initialize();
        premiumPlaces.initialize();

        this.typeahead({},
        {
            name: 'premium',
            displayKey: 'value',
            source: premiumPlaces.ttAdapter(),
            templates: {
                //header: '<h3 class="league-name">Premium</h3>',
                suggestion: function (obj) {

                    console.log('suggest:');
                    console.log(obj);

                    var address = obj.data.zip + ' ' + obj.data.city;

                    if(obj.data.street != '')  {
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
            displayKey: 'value',
            source: addresses.ttAdapter(),
            templates: {
                //header: '<h3 class="addressses">Addressen</h3>',
                suggestion: function (obj) {

                    var name = '';

                    if(obj.data.properties.name != undefined) {
                        name = obj.data.properties.name;
                    }

                    return '<span class="premium-list">' +
                        '<img src="/img/marker/marker-icon.svg" />' +
                        '<span class="cnt">' +
                            '<h5>' + name + '</h5>' +
                            '<span class="address">' + obj.value + '</span>'
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