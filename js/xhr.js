
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

module.exports = xhr;