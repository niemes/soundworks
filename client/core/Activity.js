'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _displayView = require('../display/View');

var _displayView2 = _interopRequireDefault(_displayView);

var _viewManager = require('./viewManager');

var _viewManager2 = _interopRequireDefault(_viewManager);

/**
 * Base class for services and scenes. Basically a process with view and optionnal network abilities.
 */

var Activity = (function (_EventEmitter) {
  _inherits(Activity, _EventEmitter);

  function Activity(id) {
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Activity);

    _get(Object.getPrototypeOf(Activity.prototype), 'constructor', this).call(this);
    /**
     * Name of the module.
     * @type {String}
     */
    this.id = id;

    /**
     * If `true`, define if the process has been started once.
     * @type {Boolean}
     */
    this.hasStarted = false;

    /**
     * Register as a networked service.
     */
    if (hasNetwork) _socket2['default'].required = true;

    /**
     * View of the module.
     * @type {View}
     */
    this.view = null;

    /**
     * Events to bind to the view. (cf. Backbone's syntax).
     * @type {Object}
     */
    this.events = {};

    /**
     * Additionnal options to pass to the view.
     * @type {Object}
     */
    this.viewOptions = {};

    /**
     * Defines a view constructor to be used in `createView`.
     * @type {View}
     */
    this.viewCtor = _displayView2['default'];

    /**
     * The template of the view (use `lodash.template` syntax).
     * @type {String}
     */
    this.template = null;

    /**
     * Signals defining the process state.
     * @type {Object}
     */
    this.signals = {};
    this.signals.active = new _Signal2['default']();

    /**
     * Options of the process.
     * @type {Object}
     */
    this.options = {};
    this.configure({ viewPriority: 0 });

    this.send = this.send.bind(this);
    this.sendVolatile = this.sendVolatile.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  /**
   * Configure the process with the given options.
   * @param {Object} options
   */

  _createClass(Activity, [{
    key: 'configure',
    value: function configure(options) {
      _Object$assign(this.options, options);
    }

    /**
     * Share the defined templates with all `Activity` instances.
     * @param {Object} defs - An object containing the templates.
     * @private
     */
  }, {
    key: 'createView',

    /**
     * Create the view of the module according to its attributes.
     */
    value: function createView() {
      var options = _Object$assign({
        id: this.id,
        className: 'module',
        priority: this.options.viewPriority
      }, this.viewOptions);

      return new this.viewCtor(this.template, this.content, this.events, options);
    }

    /**
     * Handle the logic and steps that starts the module.
     * Is mainly used to attach listeners to communication with the server or other modules (e.g. motionInput). If the module has a view, it is attach to the DOM.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'start',
    value: function start() {
      this.signals.active.set(true);
    }

    /**
     * This method should be considered as the opposite of {@link Activity#start}, removing listeners from socket or other module (aka motionInput).
     * It is internally called at 2 different moment of the module's lifecycle:
     * - when the module is {@link Activity#done}
     * - when the module has to restart because of a socket reconnection during the active state of the module. In this particular case the module is stopped, initialized and started again.
     *
     * **Note:** the method is called automatically when necessary, you should not call it manually.
     * @abstract
     */
  }, {
    key: 'stop',
    value: function stop() {
      this.signals.active.set(false);
    }

    /**
     * Display the view of a module if it owns one.
     */
  }, {
    key: 'show',
    value: function show() {
      if (!this.view) {
        return;
      }

      this.view.render();
      _viewManager2['default'].register(this.view);
    }

    /**
     * Hide the view of an activity if it owns one.
     */
  }, {
    key: 'hide',
    value: function hide() {
      if (!this.view) {
        return;
      }

      _viewManager2['default'].remove(this.view);
    }

    /**
     * Sends a WebSocket message to the server side socket.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(channel) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _socket2['default'].send.apply(_socket2['default'], [this.id + ':' + channel].concat(args));
    }

    /**
     * Sends a WebSocket message to the server side socket.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'sendVolatile',
    value: function sendVolatile(channel) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      _socket2['default'].sendVolatile.apply(_socket2['default'], [this.id + ':' + channel].concat(args));
    }

    /**
     * Listen a WebSocket message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */
  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      _socket2['default'].receive(this.id + ':' + channel, callback);
    }

    /**
     * Stop listening to a message from the server.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to cancel.
     */
  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      _socket2['default'].removeListener(this.id + ':' + channel, callback);
    }
  }, {
    key: 'template',

    /**
     * Returns the template associated to the current module.
     * @returns {Function} - The template related to the `name` of the current module.
     */
    get: function get() {
      var template = this._template || this.templateDefinitions[this.id];
      // if (!template)
      //   throw new Error(`No template defined for module "${this.id}"`);
      return template;
    },
    set: function set(tmpl) {
      this._template = tmpl;
    }

    /**
     * Returns the text associated to the current module.
     * @returns {Object} - The text contents related to the `name` of the current module. The returned object is extended with a pointer to the `globals` entry of the defined text contents.
     */
  }, {
    key: 'content',
    get: function get() {
      var content = this._content || this.contentDefinitions[this.id];

      if (content) content.globals = this.contentDefinitions.globals;

      return content;
    },
    set: function set(obj) {
      this._content = obj;
    }
  }], [{
    key: 'setViewTemplateDefinitions',
    value: function setViewTemplateDefinitions(defs) {
      Activity.prototype.templateDefinitions = defs;
    }

    /**
     * Share the text content configuration (name and data) with all the `Activity` instances
     * @param {Object} defs - The text contents of the application.
     * @private
     */
  }, {
    key: 'setViewContentDefinitions',
    value: function setViewContentDefinitions(defs) {
      Activity.prototype.contentDefinitions = defs;
    }
  }]);

  return Activity;
})(_events.EventEmitter);

exports['default'] = Activity;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9BY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O3NCQUNsQixVQUFVOzs7O3lCQUNQLGFBQWE7Ozs7c0JBQ2hCLFVBQVU7Ozs7MkJBQ1osaUJBQWlCOzs7OzJCQUNWLGVBQWU7Ozs7Ozs7O0lBT2xCLFFBQVE7WUFBUixRQUFROztBQUNoQixXQURRLFFBQVEsQ0FDZixFQUFFLEVBQXFCO1FBQW5CLFVBQVUseURBQUcsSUFBSTs7MEJBRGQsUUFBUTs7QUFFekIsK0JBRmlCLFFBQVEsNkNBRWpCOzs7OztBQUtSLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNYixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs7Ozs7QUFLeEIsUUFBSSxVQUFVLEVBQ1osb0JBQU8sUUFBUSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXpCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTXRCLFFBQUksQ0FBQyxRQUFRLDJCQUFPLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXJCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLHlCQUFZLENBQUM7Ozs7OztBQU1uQyxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXBDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMs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SSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVsRSxVQUFJLE9BQU8sRUFDVCxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7O0FBRXBELGFBQU8sT0FBTyxDQUFDO0tBQ2hCO1NBRVUsYUFBQyxHQUFHLEVBQUU7QUFDZixVQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztLQUNyQjs7O1dBM0NnQyxvQ0FBQyxJQUFJLEVBQUU7QUFDdEMsY0FBUSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7S0FDL0M7Ozs7Ozs7OztXQU8rQixtQ0FBQyxJQUFJLEVBQUU7QUFDckMsY0FBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7S0FDOUM7OztTQS9Ga0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL0FjdGl2aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL1NpZ25hbEFsbCc7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBWaWV3IGZyb20gJy4uL2Rpc3BsYXkvVmlldyc7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5cblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHNlcnZpY2VzIGFuZCBzY2VuZXMuIEJhc2ljYWxseSBhIHByb2Nlc3Mgd2l0aCB2aWV3IGFuZCBvcHRpb25uYWwgbmV0d29yayBhYmlsaXRpZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmsgPSB0cnVlKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBJZiBgdHJ1ZWAsIGRlZmluZSBpZiB0aGUgcHJvY2VzcyBoYXMgYmVlbiBzdGFydGVkIG9uY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5oYXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhcyBhIG5ldHdvcmtlZCBzZXJ2aWNlLlxuICAgICAqL1xuICAgIGlmIChoYXNOZXR3b3JrKVxuICAgICAgc29ja2V0LnJlcXVpcmVkID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFZpZXcgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGJpbmQgdG8gdGhlIHZpZXcuIChjZi4gQmFja2JvbmUncyBzeW50YXgpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFkZGl0aW9ubmFsIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSB2aWV3IGNvbnN0cnVjdG9yIHRvIGJlIHVzZWQgaW4gYGNyZWF0ZVZpZXdgLlxuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMudmlld0N0b3IgPSBWaWV3O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHRlbXBsYXRlIG9mIHRoZSB2aWV3ICh1c2UgYGxvZGFzaC50ZW1wbGF0ZWAgc3ludGF4KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMudGVtcGxhdGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogU2lnbmFscyBkZWZpbmluZyB0aGUgcHJvY2VzcyBzdGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBwcm9jZXNzLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgdGhpcy5jb25maWd1cmUoeyB2aWV3UHJpb3JpdHk6IDAgfSk7XG5cbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlbmRWb2xhdGlsZSA9IHRoaXMuc2VuZFZvbGF0aWxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgdGhlIHByb2Nlc3Mgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlIHRoZSBkZWZpbmVkIHRlbXBsYXRlcyB3aXRoIGFsbCBgQWN0aXZpdHlgIGluc3RhbmNlcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgdGVtcGxhdGVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICBBY3Rpdml0eS5wcm90b3R5cGUudGVtcGxhdGVEZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmUgdGhlIHRleHQgY29udGVudCBjb25maWd1cmF0aW9uIChuYW1lIGFuZCBkYXRhKSB3aXRoIGFsbCB0aGUgYEFjdGl2aXR5YCBpbnN0YW5jZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBUaGUgdGV4dCBjb250ZW50cyBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgQWN0aXZpdHkucHJvdG90eXBlLmNvbnRlbnREZWZpbml0aW9ucyA9IGRlZnM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGVtcGxhdGUgYXNzb2NpYXRlZCB0byB0aGUgY3VycmVudCBtb2R1bGUuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gLSBUaGUgdGVtcGxhdGUgcmVsYXRlZCB0byB0aGUgYG5hbWVgIG9mIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuX3RlbXBsYXRlIHx8wqB0aGlzLnRlbXBsYXRlRGVmaW5pdGlvbnNbdGhpcy5pZF07XG4gICAgLy8gaWYgKCF0ZW1wbGF0ZSlcbiAgICAvLyAgIHRocm93IG5ldyBFcnJvcihgTm8gdGVtcGxhdGUgZGVmaW5lZCBmb3IgbW9kdWxlIFwiJHt0aGlzLmlkfVwiYCk7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHRlbXBsYXRlKHRtcGwpIHtcbiAgICB0aGlzLl90ZW1wbGF0ZSA9IHRtcGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGV4dCBhc3NvY2lhdGVkIHRvIHRoZSBjdXJyZW50IG1vZHVsZS5cbiAgICogQHJldHVybnMge09iamVjdH0gLSBUaGUgdGV4dCBjb250ZW50cyByZWxhdGVkIHRvIHRoZSBgbmFtZWAgb2YgdGhlIGN1cnJlbnQgbW9kdWxlLiBUaGUgcmV0dXJuZWQgb2JqZWN0IGlzIGV4dGVuZGVkIHdpdGggYSBwb2ludGVyIHRvIHRoZSBgZ2xvYmFsc2AgZW50cnkgb2YgdGhlIGRlZmluZWQgdGV4dCBjb250ZW50cy5cbiAgICovXG4gIGdldCBjb250ZW50KCkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLl9jb250ZW50IHx8wqB0aGlzLmNvbnRlbnREZWZpbml0aW9uc1t0aGlzLmlkXTtcblxuICAgIGlmIChjb250ZW50KVxuICAgICAgY29udGVudC5nbG9iYWxzID0gdGhpcy5jb250ZW50RGVmaW5pdGlvbnMuZ2xvYmFscztcblxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgc2V0IGNvbnRlbnQob2JqKSB7XG4gICAgdGhpcy5fY29udGVudCA9IG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHZpZXcgb2YgdGhlIG1vZHVsZSBhY2NvcmRpbmcgdG8gaXRzIGF0dHJpYnV0ZXMuXG4gICAqL1xuICBjcmVhdGVWaWV3KCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgY2xhc3NOYW1lOiAnbW9kdWxlJyxcbiAgICAgIHByaW9yaXR5OiB0aGlzLm9wdGlvbnMudmlld1ByaW9yaXR5LFxuICAgIH0sIHRoaXMudmlld09wdGlvbnMpO1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzLnZpZXdDdG9yKHRoaXMudGVtcGxhdGUsIHRoaXMuY29udGVudCwgdGhpcy5ldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSB0aGUgbG9naWMgYW5kIHN0ZXBzIHRoYXQgc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIElzIG1haW5seSB1c2VkIHRvIGF0dGFjaCBsaXN0ZW5lcnMgdG8gY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBzZXJ2ZXIgb3Igb3RoZXIgbW9kdWxlcyAoZS5nLiBtb3Rpb25JbnB1dCkuIElmIHRoZSBtb2R1bGUgaGFzIGEgdmlldywgaXQgaXMgYXR0YWNoIHRvIHRoZSBET00uXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUuc2V0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHRoZSBvcHBvc2l0ZSBvZiB7QGxpbmsgQWN0aXZpdHkjc3RhcnR9LCByZW1vdmluZyBsaXN0ZW5lcnMgZnJvbSBzb2NrZXQgb3Igb3RoZXIgbW9kdWxlIChha2EgbW90aW9uSW5wdXQpLlxuICAgKiBJdCBpcyBpbnRlcm5hbGx5IGNhbGxlZCBhdCAyIGRpZmZlcmVudCBtb21lbnQgb2YgdGhlIG1vZHVsZSdzIGxpZmVjeWNsZTpcbiAgICogLSB3aGVuIHRoZSBtb2R1bGUgaXMge0BsaW5rIEFjdGl2aXR5I2RvbmV9XG4gICAqIC0gd2hlbiB0aGUgbW9kdWxlIGhhcyB0byByZXN0YXJ0IGJlY2F1c2Ugb2YgYSBzb2NrZXQgcmVjb25uZWN0aW9uIGR1cmluZyB0aGUgYWN0aXZlIHN0YXRlIG9mIHRoZSBtb2R1bGUuIEluIHRoaXMgcGFydGljdWxhciBjYXNlIHRoZSBtb2R1bGUgaXMgc3RvcHBlZCwgaW5pdGlhbGl6ZWQgYW5kIHN0YXJ0ZWQgYWdhaW4uXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IHdoZW4gbmVjZXNzYXJ5LCB5b3Ugc2hvdWxkIG5vdCBjYWxsIGl0IG1hbnVhbGx5LlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZS5zZXQoZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgdGhlIHZpZXcgb2YgYSBtb2R1bGUgaWYgaXQgb3ducyBvbmUuXG4gICAqL1xuICBzaG93KCkge1xuICAgIGlmICghdGhpcy52aWV3KSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy52aWV3LnJlbmRlcigpO1xuICAgIHZpZXdNYW5hZ2VyLnJlZ2lzdGVyKHRoaXMudmlldyk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBvZiBhbiBhY3Rpdml0eSBpZiBpdCBvd25zIG9uZS5cbiAgICovXG4gIGhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLnZpZXcpIHsgcmV0dXJuOyB9XG5cbiAgICB2aWV3TWFuYWdlci5yZW1vdmUodGhpcy52aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLmlkfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHNvY2tldC5zZW5kKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBzb2NrZXQuc2VuZFZvbGF0aWxlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCAuLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZWNlaXZlKGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcihgJHt0aGlzLmlkfToke2NoYW5uZWx9YCwgY2FsbGJhY2spO1xuICB9XG59XG4iXX0=