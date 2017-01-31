;(function () {
  'use strict';

  class EventEmitter {
    constructor() {
      this._listeners = {};
    }

    hasListeners(type) {
      return this._listeners.hasOwnProperty(type);
    }

    on(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('listener must be a function');
      }
      if (!this.hasListeners(type)) {
        this._listeners[type] = [];
      }
      this._listeners[type].push(listener);
      return this;
    }

    off(type, listener) {
      if (!arguments.length) {
        this._listeners = {};
      } else if (arguments.length === 1) {
        if (this._listeners.hasOwnProperty(type)) {
          delete this._listeners[type];
        }
      } else if (this._listeners.hasOwnProperty(type)) {
        const listeners = this._listeners[type];
        let i = listeners.length;
        while (i--) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
          }
        }
        if (!listeners.length) {
          delete this._listeners[type];
        }
      }
      return this;
    }

    emit(type, ...args) {
      const onfunc = 'on' + type;
      if (this.hasOwnProperty(onfunc) && typeof this[onfunc] === 'function') {
        this[onfunc](...args);
      }
      if (this.hasListeners(type)) {
        for (let listener of this._listeners[type]) {
          listener.apply(this, args);
        }
      }
      return this;
    }
  }

  if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = EventEmitter;
  } else {
    window.EventEmitter = EventEmitter;
  }
}());
