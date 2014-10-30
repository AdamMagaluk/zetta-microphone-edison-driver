var Device = require('zetta-device');
var util = require('util');
var mraa = require('mraa-js');

var SAMPLE_TIME = 100; // ms

var Microphone = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin || 0;
  this._pin = new mraa.Aio(this.pin);
};
util.inherits(Microphone, Device);

Microphone.prototype.init = function(config) {
  config
    .type('microphone')
    .name('Microphone')
    .monitor('volume')

  var startTime = 0;
  var maxValue = 0;
  var minValue = 0;
  function reset() {
    startTime = new Date().getTime();
    maxValue = 0;
    minValue = 3000;
  }
  
  reset();
  var self = this;
  setInterval(function() {
    var value = self._pin.read(); // 0-1024

    if (value > maxValue) {
      maxValue = value;
    }
    
    if (value < minValue) {
      minValue = value;
    }
    
    if (new Date().getTime() - startTime > SAMPLE_TIME) {
      self.volume = (maxValue - minValue);
      reset();
    }
  }, 25);

};


