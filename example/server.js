var zetta = require('zetta');
var Microphone = require('../index');

zetta()
  .use(Microphone, 0)
  .listen(1337);
