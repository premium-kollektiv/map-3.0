require('magnific-popup');

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
            '<p>die Premium-"Sprecherinnen" vor Ort, welche sich um Handel und Läden kümmern, und für lokale Fragen jeder Art zur Verfügung stehen.</p>'
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
        closeMarkup: '<button onclick="closePopup();" title="%title%" type="button" class="mfp-close"><i class="icon-cross" aria-hidden="true"></i></button>'
      });
    }
};
// dirty fix for chrome to close popup but works :)
window.closePopup = function() {
  $.magnificPopup.close();
}

module.exports = popup;