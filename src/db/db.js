module.exports = (function(){

    var log4js = require('log4js');

    function Db(collection){

        var _self = this,
            _collection = collection,
            _logger = log4js.getLogger('air.api.db.db');

        _self.getAirQuality = function(apps, onSuccess, onError){
            _collection.aggregate([
                { $match: {'app': { $in: apps }}},
                { $project : { 
                  'app': 1,
                  'air' : 1 } }])
            .toArray(function(err, items) {
                if(!err){
                    onSuccess(items);
                }else{
                    _logger.error('An error occured when fetching air info for apps ' + apps + ': ' + err);
                    onError();
                }
            });
        };

        _self.getWeather = function(apps, onSuccess, onError){
            _collection.aggregate([
                { $match: {'app': { $in: apps }}},
                { $unwind : '$weather.list' },  
                { $match : {'weather.list.dt' : { $gte: 1499520000 } } },  
                { $project : { 
                  'app': 1,
                  'weather.dt' : '$weather.list.dt',  
                  'weather.temp' : '$weather.list.main.temp', 
                  'weather.descriptions' : '$weather.list.weather.description' } }])
            .toArray(function(err, items) {
                if(!err){
                    onSuccess(items);
                }else{
                    _logger.error('An error occured when fetching weather info for apps ' + apps + ': ' + err);
                    onError();
                }
            });
        };

        _self.getStatus = function(apps, onSuccess, onError){
            _collection.aggregate([
                { $match: {'app': { $in: apps }}},
                { $project : { 
                  'app': 1,
                  'status' : 1 } }])
            .toArray(function(err, items) {
                if(!err){
                    onSuccess(items);
                }else{
                    _logger.error('An error occured when fetching status info for apps ' + apps + ': ' + err);
                    onError();
                }
            });
        };
    }

    return Db;

})();