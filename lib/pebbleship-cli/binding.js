var got = require('got');

var PebbleshipAPI = module.exports = function(config) {
  this.endpoint = 'http://' + config.host;
  if (config.port) {
    this.endpoint = this.endpoint + ':' + config.port;
  }
  console.log('[pebbleship-cli] Connecting to server at: %s', this.endpoint);
}

PebbleshipAPI.prototype.createGrid = function(config) {
  console.log('[pebbleship-cli] Creating grid: %sx%s', config.x, config.y);

  return got.post(this.endpoint + '/grid', {
    body: config
  }).then(result => {
    return result.body;
  }).catch(err => {
    console.log('[pebbleship-cli] createGrid ERROR: ' + err);
  });
}

PebbleshipAPI.prototype.createShip = function(config) {
  console.log('[pebbleship-cli] Creating ship with dimension: %s', config.dimension);

  return got.post(this.endpoint + '/ships', {
    body: config
  }).then(result => {
    return result.body;
  }).catch(err => {
    console.log('[pebbleship-cli] createShip ERROR: ' + err);
  });
}

PebbleshipAPI.prototype.shoot = function(config) {
  // console.log('[pebbleship-cli] Shooting at: %s', JSON.stringify(config, null, 4));

  return got.post(this.endpoint + '/shots', {
    body: config
  }).then(result => {
    return result.body;
  }).catch(err => {
    console.log('[pebbleship-cli] shoot ERROR: ' + err);
  });
}
