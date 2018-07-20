module.exports = (function() {
    
    var log4js = require('log4js');
    var isInited = false;

    function setup(){

        if(isInited){
            return;
        }

        log4js.configure({
            appenders: { 
                file: { 
                    type: 'dateFile', 
                    filename: 'logs/alexa-air.log', 
                    pattern: "--yyyy-MM-dd",
                    layout: {
                        type: 'pattern',
                        pattern: '[%d{ISO8601_WITH_TZ_OFFSET}] [%p] %c - %m' //  yyyy-MM-ddThh:mm:ss:SSSZ
                    }
                }
            },
            categories: { default: { appenders: ['file'], level: 'trace' } }
        });

        isInited = true;
    }

    return {
        setup: setup
    };

})();
            
            