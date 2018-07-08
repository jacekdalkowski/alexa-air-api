module.exports = (function(){

    var log4js = require('log4js');

    function Db(collection){

        var _self = this,
            _collection = collection,
            _logger = log4js.getLogger('air.api.db.db');

        _self.getAirQuality = function(app, onSuccess, onError){
            _collection.aggregate([
                { $match: {'app': { $eq: app }}},
                { $project : { 
                  'air' : 1 } }])
            .toArray(function(err, items) {
                if(!err && items.length == 1){
                    onSuccess(items[0]);
                }else{
                    if(err){
                        _logger.error('An error occured when fetching air info for app ' + app + ': ' + err);
                    }else if(items.length != 1){
                        _logger.error('An error occured when fetching air info for app ' + app + ': number of items found is: ' + items.length + ". Should be 1.");
                    }
                    onError();
                }
            });
        };

        _self.getWeather = function(app, onSuccess, onError){
            _collection.aggregate([
                { $match: {'app': { $eq: app }}},
                { $unwind : '$weather.list' },  
                { $match : {'weather.list.dt' : { $gte: 1499520000 } } },  
                { $project : { 
                  'weather.dt' : '$weather.list.dt',  
                  'weather.temp' : '$weather.list.main.temp', 
                  'weather.descriptions' : '$weather.list.weather.description' } }])
            .toArray(function(err, items) {
                if(!err && items.length == 1){
                    onSuccess(items[0]);
                }else{
                    if(err){
                        _logger.error('An error occured when fetching weather info for app ' + app + ': ' + err);
                    }else if(items.length != 1){
                        _logger.error('An error occured when fetching weather info for app ' + app + ': number of items found is: ' + items.length + ". Should be 1.");
                    }
                    onError();
                }
            });
        };

        _self.getStatus = function(app, onSuccess, onError){
            _collection.aggregate([
                { $match: {'app': { $eq: app }}},
                { $project : { 
                  'status' : 1 } }])
            .toArray(function(err, items) {
                if(!err && items.length == 1){
                    onSuccess(items[0]);
                }else{
                    if(err){
                        _logger.error('An error occured when fetching status info for app ' + app + ': ' + err);
                    }else if(items.length != 1){
                        _logger.error('An error occured when fetching status info for app ' + app + ': number of items found is: ' + items.length + ". Should be 1.");
                    }
                    onError();
                }
            });
        };
    }

    return Db;

})();