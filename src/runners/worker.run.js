var worker = require('./worker');
var commonSetup = require('./common');
commonSetup.setup();
worker.run();