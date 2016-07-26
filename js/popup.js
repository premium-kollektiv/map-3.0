require('magnific-popup');

var popup = {
    init: function() {
        
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
        closeMarkup: '<button onclick="closePopup();" title="%title%" type="button" class="mfp-close"><i class="icon-cross" aria-hidden="true"></i></button>'
      });
    }
};
// dirty fix for chrome to close popup but works :)
window.closePopup = function() {
  $.magnificPopup.close();
}

module.exports = popup;