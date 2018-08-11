var express = require('express');
var alexaVerifier = require('alexa-verifier-middleware');
var bodyParser = require('body-parser');
var router = express.Router();
var Db = require('../db/db.js');

if (process.env.NODE_ENV !== 'development') {
  router.use(alexaVerifier);
}
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/cracow', GetRequestHandler('cracow'));
router.post('/nyc', GetRequestHandler('nyc'));
router.post('/la', GetRequestHandler('la'));
router.post('/vancouver', GetRequestHandler('Vancouver'));

function GetRequestHandler(appName){
  var requestHandler = function(req, res, next){
    var collection = req.app.locals.db.collection('airpolution'),
        db = new Db(collection);

    db.getAirQuality([appName],
      function onSuccess(items){
        res.json(buildGetAirQualityResponse(items[0]));
      },
      function onError(){
        res.json(buildErrorResponse());
      });
  };
  return requestHandler;
}

function mapPolutionDataToQualityIndex(airData){
  var pm10Level = airData.air.pm_10;
  if(pm10Level < 25){
    return "good";
  }else if(pm10Level < 50){
    return "moderate";
  }else if(pm10Level < 75){
    return "unhealthy";
  }else if(pm10Level < 100){
    return "very unhealthy";
  }else{
    return "hazardous";
  }
}

function buildGetAirQualityResponse(airData){

  var pm10Level = airData.air.pm_10;
  var qualityIndex = mapPolutionDataToQualityIndex(airData);

  var r = { 
  "version": "0.0.1", 
  "response": { 
    "outputSpeech": { 
      "type": "SSML", 
      "ssml": "<speak>" +
                "Air is <prosody volume='x-loud' pitch='x-low'>" + qualityIndex + "</prosody>. PM 10 level is " + pm10Level + "." +
              "</speak>", 
    }
  },
  "shouldEndSession": true 
  };

  return r;
}

module.exports = router