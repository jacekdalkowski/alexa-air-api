var express = require('express');
var alexaVerifier = require('alexa-verifier-middleware');
var bodyParser = require('body-parser');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger('routes.apiCracow');
var Db = require('../db/db.js');

if (process.env.NODE_ENV !== 'development') {
  router.use(alexaVerifier);
}
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var intentToHandler = new Map();
intentToHandler.set('GetAirQuality', handleGetAirQualityRequest);
intentToHandler.set('GetWeatherForecast', handleGetWeatherForecastRequest);

function handleGetAirQualityRequest(req, res, next) {
  var app = ['cracow'],
    collection = req.app.locals.db.collection('airpolution'),
    db = new Db(collection);

  db.getAirQuality(app,
    function onSuccess(items){
      res.json(buildGetAirQualityResponse(items[0]));
    },
    function onError(){
      res.json(buildErrorResponse());
    });
}

function handleGetWeatherForecastRequest(req, res, next) {
  var app = 'cracow',
    collection = req.app.locals.db.collection('airpolution'),
    db = new Db(collection);

  db.getWeather(app,
    function onSuccess(item){
      res.json(buildGetWeatherForecastResponse(item));
    },
    function onError(){
      res.json(buildErrorResponse());
    });
}

router.post('/', function(req, res, next) {
  var requestType = req.body.request.type,
      intentName,
      intentHandler;

  logger.debug('Handling request of type: ' + requestType);
  if(requestType === 'IntentRequest'){
    intentName = req.body.request.intent.name;
    logger.debug('Handling intent of name: ' + intentName);
    if(intentToHandler.has(intentName)){
      intentHandler = intentToHandler.get(intentName);
      intentHandler(req, res, next);
    }else{
      logger.error('Returning 404');
      res.status(404).send('Not found');
    }
  }else if(requestType === 'LaunchRequest'){
    intentHandler = intentToHandler.get('GetAirQuality');
    intentHandler(req, res, next);
  }else if(requestType === 'SessionEndedRequest'){
    res.end();
  }else{
    logger.error('Returning 404');
    res.status(404).send('Not found');
  }
});

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

function buildGetWeatherForecastResponse(weatherData){

  var description = weatherData.weather.descriptions[0];
  var temperature = weatherData.weather.temp;

  var r = { 
  "version": "0.0.1", 
  "response": { 
    "outputSpeech": { 
      "type": "SSML", 
      "ssml": "<speak>" +
                "It will be " + description + ". Temperature will be " + temperature + "." +
              "</speak>", 
    }
  },
  "shouldEndSession": true 
  };

  return r;
}

function buildErrorResponse(){
  
    var r = { 
    "version": "0.0.1", 
    "response": { 
      "outputSpeech": { 
        "type": "SSML", 
        "ssml": "<speak>" +
                  "An error occured. Please try again later." + 
                "</speak>", 
      }
    },
    "shouldEndSession": true 
    };
  
    return r;
  }

module.exports = router