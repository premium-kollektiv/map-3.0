//require('./geocomplete.js');
var map = require('./map.js');
var base = require('./base64.js');

var PremiumAddressEngine = require('./premium-search.js');


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

module.exports = search;