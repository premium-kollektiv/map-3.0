
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

module.exports = loader;