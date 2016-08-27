/*
 * Session Objects
 */
var session = {

    /*
    switch to check localstorage
     */
    ls: null,

    init: function(){

        /*
        check local storage
         */
        if(this.lsTest() === true) {
            this.ls = true;
        } else {
            ls = false;
        }

    },
    
    /*
     * set a session value
     */
    set: function(key,value) {
        if(this.ls) {
            var obj = {data:value};
            localStorage.setItem(key, JSON.stringify(obj));
        }
    },
    
    /*
     * get a value
     */
    get: function(key) {
        if(this.ls) {
            var obj = JSON.parse(localStorage.getItem(key));

            if(obj != undefined) {
                return obj.data;
            }
        }
        return undefined;
    },

    /*
     * Test function for local storage
     */
    lsTest: function (){
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }
};

module.exports = session;
