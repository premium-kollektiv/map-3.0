
var loader = {
    
    element: null,
    icon:null,
    
    init: function() {
        this.element = $('#searchbar-icon');
        this.icon = $('#searchbar-icon i');
    },
    
    start: function() {
        this.icon.removeClass('fa-search');
        this.icon.addClass('fa-refresh fa-spin fa-fw');
    },
    
    stop: function() {
        this.icon.removeClass('fa-refresh fa-spin fa-fw');
        this.icon.addClass('fa-search');
    }
};

module.exports = loader;