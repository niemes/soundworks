'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

/**
 * [client] Base class used to build a performance on the client side.
 *
 * The base class always has a view.
 *
 * (See also {@link src/server/ServerPerformance.js~ServerPerformance} on the server side.)
 */

var ClientPerformance = (function (_ClientModule) {
  _inherits(ClientPerformance, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */

  function ClientPerformance() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPerformance);

    _get(Object.getPrototypeOf(ClientPerformance.prototype), 'constructor', this).call(this, options.name || 'performance', true, options.color || 'black');
  }

  /**
   * Start the module.
   *
   * Send a message to the server side module to indicate that the client entered the performance.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   */

  _createClass(ClientPerformance, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientPerformance.prototype), 'start', this).call(this);
      this.send('start');
    }

    /**
     * Can be called to terminate the performance.
     * Send a message to the server side module to indicate that the client exited the performance.
     */
  }, {
    key: 'done',
    value: function done() {
      this.send('done');
      _get(Object.getPrototypeOf(ClientPerformance.prototype), 'done', this).call(this); // TODO: check if needs to be called lastly
    }
  }]);

  return ClientPerformance;
})(_ClientModule3['default']);

exports['default'] = ClientPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7OztJQVVwQixpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7OztBQU16QixXQU5RLGlCQUFpQixHQU1WO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxpQkFBaUI7O0FBT2xDLCtCQVBpQixpQkFBaUIsNkNBTzVCLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sRUFBRTtHQUN0RTs7Ozs7Ozs7OztlQVJrQixpQkFBaUI7O1dBaUIvQixpQkFBRztBQUNOLGlDQWxCaUIsaUJBQWlCLHVDQWtCcEI7QUFDZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ25COzs7Ozs7OztXQU1HLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqQixpQ0E1QmlCLGlCQUFpQixzQ0E0QnJCO0tBQ2Q7OztTQTdCa0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIEJhc2UgY2xhc3MgdXNlZCB0byBidWlsZCBhIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBhbHdheXMgaGFzIGEgdmlldy5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyUGVyZm9ybWFuY2UuanN+U2VydmVyUGVyZm9ybWFuY2V9IG9uIHRoZSBzZXJ2ZXIgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFBlcmZvcm1hbmNlIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BlcmZvcm1hbmNlJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdwZXJmb3JtYW5jZScsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICpcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNlbmQoJ3N0YXJ0JylcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgY2FsbGVkIHRvIHRlcm1pbmF0ZSB0aGUgcGVyZm9ybWFuY2UuXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGUgdG8gaW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50IGV4aXRlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBkb25lKCkge1xuICAgIHRoaXMuc2VuZCgnZG9uZScpXG4gICAgc3VwZXIuZG9uZSgpOyAvLyBUT0RPOiBjaGVjayBpZiBuZWVkcyB0byBiZSBjYWxsZWQgbGFzdGx5XG4gIH1cbn1cbiJdfQ==