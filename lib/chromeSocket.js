var EventEmitter = require('events').EventEmitter;
var util = require('util');

var _chromeSocket = chrome.experimental.socket || chrome.socket;

var stringToUint8Array = function(string) {
  var buffer = new ArrayBuffer(string.length);
  var view = new Uint8Array(buffer);
  for(var i = 0; i < string.length; i++) {
    view[i] = string.charCodeAt(i);
  }
  return view;
};

function chromeSocket(options) {
  var self = this;

  self._socketId = null;
  self.writable = false;

  // options hash should be Chrome Socket API specific
  options = options || {};

  stream.Duplex.call(this, options);

  // only support tcp sockets
  _chromeSocket.create("tcp", options, function(socketInfo) {
    self._socketId = socketInfo.socketId;
  });
};
util.inherits(Socket, EventEmitter);

chromeSocket.prototype.read = function(n) {
};

chromeSocket.prototype.listen = function() {
};

chromeSocket.prototype.setTimeout = function(msecs, callback) {
  // noop
};

chromeSocket.prototype.setMaxListeners = function(num, callback) {
  // noop
};

chromeSocket.prototype.setNoDelay = function(enable) {
  var self = this;
  _chromeSocket.setNoDelay(self._socketId, enable, function() {});
};

chromeSocket.prototype.setKeepAlive = function(setting, msecs) {

};

chromeSocket.prototype.address = function() {

};

Object.defineProperty(chromeSocket.prototype, 'readyState', {
  get: function() {

  }
});

Object.defineProperty(chromeSocket.prototype, 'bufferSize', {
  get: function() {
    // always return zero
    // as chrome sockets doesn't expose buffering
    return 0;
  }
});

chromeSocket.prototype.end = function(data, encoding) {
  var self = this;
  self.writable = false;
  _chromeSocket.disconnect(self._socketId);
  self.emit('end');
};

chromeSocket.prototype.destroy = function(exception) {
  var self = this;
  self.writable = false;
  _chromeSocket.destroy(self._socketId);
  self.emit('close', true);
};

chromeSocket.prototype._getpeername = function() {

};

chromeSocket.prototype.__defineGetter__('remoteAddress', function() {

});

chromeSocket.prototype.__defineGetter__('remotePort', function() {

});


chromeSocket.prototype._getsockname = function() {

};

chromeSocket.prototype.__defineGetter__('localAddress', function() {

});

chromeSocket.prototype.__defineGetter__('localPort', function() {
});

chromeSocket.prototype.write = function(chunk, encoding, cb) {
  var self = this;
  var buffer = stringToUint8Array(chunk);
  _chromeSocket.write(self._socketId, buffer, function(bytesWritten) {
    if (bytesWritten > 0) {
      if (bytesWritten === buffer.length) {
        self.emit('drain');
      }
    } else {
      // if an error occurrs while writingg close the socket
      self.emit('error', bytesWritten);
      self.destroy();
    }
  });
};

chromeSocket.prototype.__defineGetter__('bytesWritten', function() {
  // noop
});

chromeSocket.prototype.connect = function(port, host) {
  var self = this;
  _chromeSocket.connect(self.socketId, host, port, function() {
    // Start polling for reads.
    setInterval(this._periodicallyRead.bind(this), 500);

    self.writable = true;
    self.emit('connect');
  });
};

chromeSocket.prototype._periodicallyRead = function() {
  var self = this;
  socket.read(self._socketId, null, self._onDataRead.bind(self));
};

chromeSocket.prototype._onDataRead = function(readInfo) {
  if (readInfo.resultCode > 0) {
    self.emit('data', readInfo.data);
  }
};

chromeSocket.prototype.ref = function() {

};

chromeSocket.prototype.unref = function() {

};

module.exports = chromeSocket;
