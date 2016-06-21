/*
 * Session Objects
 */
var session = {
    
    /*
     * set a session value
     */
    set: function(key,value) {
        var obj = {data:value};
        localStorage.setItem(key, JSON.stringify(obj));
    },
    
    /*
     * get a value
     */
    get: function(key) {
        var obj = JSON.parse(localStorage.getItem(key));
        if(obj != undefined) {
           return obj.data; 
        }
        return undefined;
    }
};

module.exports = session;
