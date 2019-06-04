import serviceManager from './serviceManager';
import socket from './socket';
import viewManager from './viewManager';
import viewport from '../views/viewport';

/**
 * Client side entry point for a `soundworks` application.
 *
 * This object hosts general informations about the user, as well as methods
 * to initialize and start the application.
 *
 * @memberof module:soundworks/client
 * @namespace
 *
 * @example
 * import * as soundworks from 'soundworks/client';
 * import MyExperience from './MyExperience';
 *
 * soundworks.client.init('player');
 * const myExperience = new MyExperience();
 * soundworks.client.start();
 */
const client = {
  /**
   * The type of the client, this can generally be considered as the role of the
   * client in the application. This value is defined in the
   * [`client.init`]{@link module:soundworks/server.server~serverConfig} object
   * and defaults to `'player'`.
   *
   * @type {String}
   */
  type: null,


  /**
   * Unique session id of the client (number), generated and retrieved by the server.
   *
   * @type {Number}
   */
  id: null,

  /**
   * Unique session id of the client (uuidv4), generated and retrieved by the server.
   *
   * @type {String}
   */
  uuid: null,

  /**
   * @note - remove all that, should be directly related to the services
   * @example
   * // client side
   * const index = this.checkin.getIndex();
   * // server side
   * const index = this.checkin.getIndex(client);
   *
   * // for plaform
   * const isCcompatible = this.platform.isCompatible
   */

  /**
   * Configuration informations from the server configuration if any.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.client~init}
   * @see {@link module:soundworks/client.SharedConfig}
   */
  config: {},

  /**
   * Array of optionnal parameters passed through the url
   *
   * @type {Array}
   */
  urlParams: null,

  /**
   * Information about the client platform. The properties are set by the
   * [`platform`]{@link module:soundworks/client.Platform} service.
   *
   * @type {Object}
   * @property {String} os - Operating system.
   * @property {Boolean} isMobile - Indicates whether the client is running on a
   *  mobile platform or not.
   * @property {String} audioFileExt - Audio file extension to use, depending on
   *  the platform.
   * @property {String} interaction - Type of interaction allowed by the
   *  viewport, `touch` or `mouse`
   *
   * @see {@link module:soundworks/client.Platform}
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
    interaction: null,
  },

  /**
   * Defines whether the user's device is compatible with the application
   * requirements.
   *
   * @type {Boolean}
   * @see {@link module:soundworks/client.Platform}
   */
  compatible: null,

  /**
   * Index (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {Number}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  index: null,

  /**
   * Ticket label (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {String}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  label: null,

  /**
   * Client coordinates (if any) given by a
   * [`locator`]{@link module:soundworks/client.Locator},
   * [`placer`]{@link module:soundworks/client.Placer} or
   * [`checkin`]{@link module:soundworks/client.Checkin} service.
   * (Format: `[x:Number, y:Number]`.)
   *
   * @type {Array<Number>}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Locator}
   * @see {@link module:soundworks/client.Placer}
   * @see {@link module:soundworks/client.Geolocation}
   */
  coordinates: null,

  /**
   * Full `geoposition` object as returned by `navigator.geolocation`, when
   * using the `geolocation` service.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.Geolocation}
   */
  geoposition: null,

  /**
   * Socket object that handle communications with the server, if any.
   * This object is automatically created if the experience requires any service
   * having a server-side counterpart.
   *
   * @type {module:soundworks/client.socket}
   * @private
   */
  socket: socket,

  /**
   * Initialize the application.
   *
   * @param {String} [clientType='player'] - The type of the client, defines the
   *  socket connection namespace. Should match a client type defined server side.
   * @param {Object} [config={}]
   * @param {Object} [config.appContainer='#container'] - A css selector
   *  matching a DOM element where the views should be inserted.
   * @param {Object} [config.websockets.url=''] - The url where the socket should
   *  connect _(unstable)_.
   * @param {Object} [config.websockets.transports=['websocket']] - The transport
   *  used to create the url (overrides default socket.io mecanism) _(unstable)_.
   */
  init(clientType = 'player', config = {}) {
    this.type = clientType;

    this._parseUrlParams();
    // if socket config given, mix it with defaults
    const websockets = Object.assign({
      url: '',
      transports: ['websocket'],
      path: '',
    }, config.websockets);

    // mix all other config and override with defined socket config
    Object.assign(this.config, config, { websockets });

    serviceManager.init();
    viewport.init();

    const el = config.appContainer;
    const $container = el instanceof Element ? el : document.querySelector(el);
    viewManager.setAppContainer($container);

    return Promise.resolve();
  },

  /**
   * Register a function to be executed when a service is instanciated.
   *
   * @param {serviceManager~serviceInstanciationHook} func - Function to
   *  register has a hook to be execute when a service is created.
   */
  /**
   * @callback serviceManager~serviceInstanciationHook
   * @param {String} id - id of the instanciated service.
   * @param {Service} instance - instance of the service.
   */
  setServiceInstanciationHook(func) {
    serviceManager.setServiceInstanciationHook(func);
  },

  /**
   * Start the application.
   */
  async start() {
    try {
      await this._initSocket();
      serviceManager.start();
    } catch(err) {
      console.error(err);
    }
  },

  /**
   * Returns a service configured with the given options.
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, options);
  },

  /**
   * Retrieve an array of optionnal parameters from the url excluding the client type
   * and store it in `this.urlParams`.
   * Parameters can be defined in two ways :
   * - as a regular route (ex: `/player/param1/param2`)
   * - as a hash (ex: `/player#param1-param2`)
   * The parameters are send along with the socket connection
   *
   * @see {@link module:soundworks/client.socket}
   * @private
   * @todo - When handshake implemented, define if these informations should be part of it
   */
  _parseUrlParams() {
    let pathParams = null;
    let hashParams = null;
    // handle path name first
    let pathname = window.location.pathname;
    // sanitize
    pathname = pathname
      .replace(/^\//, '')                               // leading slash
      .replace(new RegExp('^' + this.type + '/?'), '')  // remove clientType
      .replace(/\/$/, '');                              // trailing slash

    if (pathname.length > 0) {
      pathParams = pathname.split('/');
    }

    // handle hash
    let hash = window.location.hash;
    hash = hash.replace(/^#/, '');

    if (hash.length > 0) {
      hashParams = hash.split('-');
    }

    if (pathParams || hashParams) {
      this.urlParams = [];

      if (pathParams) {
        pathParams.forEach(param => this.urlParams.push(param));
      }

      if (hashParams) {
        hashParams.forEach(param => this.urlParams.push(param));
      }
    }
  },

  /**
   * Initialize socket connection and perform handshake with the server.
   * @private
   */
  async _initSocket() {
    await socket.init(this.type, this.config.websockets);

    return new Promise((resolve, reject) => {
      const payload = { urlParams: this.urlParams };

      if (this.config.env !== 'production') {
        Object.assign(payload, {
          requiredServices: serviceManager.getRequiredServices()
        });
      }

      // wait for handshake response to mark client as `ready`
      this.socket.addListener('soundworks:start', ({ id, uuid }) => {
        this.id = id;
        this.uuid = uuid;
        resolve();
      });

      this.socket.addListener('soundworks:error', (err) => {
        switch (err.type) {
          case 'services':
            // can only append if env !== 'production'
            const msg = `"${err.data.join(', ')}" required client-side but not server-side`;
            throw new Error(msg);
            break;
        }

        reject();
      });

      this.socket.send('soundworks:handshake', payload);
    });
  },
};

export default client;
