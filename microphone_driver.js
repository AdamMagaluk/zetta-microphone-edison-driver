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
  var samples = [];
  function reset() {
    startTime = new Date().getTime();
    samples = [];
  }

  function removeMin(samples) {
    samples.sort(function(a,b) {
      if (a > b) {
        return 1;
      } else if(a < b) {
        return -1;
      } else {
        return 0;
      }
    });
    samples.splice(0, 1);
    return samples;
  }
  
  reset();
  var self = this;
  setInterval(function() {
    var value = self._pin.read(); // 0-1024
    samples.push(value);

    if (new Date().getTime() - startTime > SAMPLE_TIME) {
      samples = removeMin(samples);
      self.volume = (samples[samples.length-1] - samples[0]);
      reset();
    }
  }, 5);

};


