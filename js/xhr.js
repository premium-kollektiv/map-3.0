
var loader = require('./loader.js');

var xhr = {
    
    startRequest: function() {
        loader.start();
    },
    
    stopRequest: function() {
        loader.stop();
    },
    
    get: function(url, options) {
        
        var settings = {
            loader:true
        };
        
        $.extend(settings, options);
        if(settings.loader) {
            this.startRequest();
        }
        
        
        $.ajax({
            url: config.baseUri + url,
            type:'get',
            dataType:'json',
            success:function(ret) {
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
            complete: function() {
                if(settings.loader) {
                    xhr.stopRequest();
                }
            }
        });
    },
    
    post: function() {
        
    }
};

module.exports = xhr;