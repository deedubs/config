var util = require('util');

module.exports = Config;

function Config () {
  this._callbacks = [];
  this._loaded = false;
  this._loading = false;
}

Config.prototype.env = function (env) {
  this._env = env;
  
  return this;
};

Config.prototype.key = function (key) {
  this._key = key;
  
  return this;
};

Config.prototype.cachePath = function (cachePath) {
  this._cachePath = cachePath;

  return this;
};

Config.prototype.ready = function (fn) {
  if(this._loaded) {
    return fn(null, this.cfg);
  } 
  
  if (fn)
    this._callbacks.push(fn);
  
  if(!this._loading) this._load();

  return this;
};

Config.prototype._ready = function () {
  var config = this;
  config._loaded = true;
    
  config._callbacks.forEach(function (cb) {
    cb(null, config.cfg);
  });
};

Config.prototype.populateEnv = function () {
  var config = this;
  
  config._callbacks.unshift(function () {
    Object.keys(config.cfg).forEach(function (configKey) {
      process.env[configKey] = config.cfg[configKey];
    });
  });
  
  return this;
};

Config.prototype._load = function () {
  var config = this;
  
  this._loading = true;
  
  config.cfg = require(config._cachePath);
    
  config._ready();
};
