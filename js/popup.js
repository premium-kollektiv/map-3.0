require('magnific-popup');

var popup = {
    init: function() {
        
    },
    
    info: function() {
        this.html(
                '<h1>attribution</h1>' +
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
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fa fa-times" aria-hidden="true"></i></button>'
      });
    }
};

module.exports = popup;