import path from 'path';
import Experience from './Experience';
import Service from './Service';
import serviceManager from './serviceManager';
import StateManager from './StateManager';
import Client from './Client';
import server from './server';


/**
 * client-side part of *soundworks*
 *
 * @module @soundworks/core/client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 */
const soundworks = {
  // expose base classes for service plugins and application code
  Experience,
  Service,

  // soundworks instance
  // @todo - allow multiple instances (for client-side and thus for consistency)
  config: {},
  server,
  serviceManager,

  /**
   *
   * server config:
   *
   * @param {String} [options.defaultClient='player'] - Client that can access
   *   the application at its root url.
   * @param {String} [options.publicDirectory='public'] - The public directory
   *   to expose, for serving static assets.
   * @param {String} [options.port=8000] - Port on which the http(s) server will
   *   listen
   * @param {Object} [options.serveStaticOptions={}] - TBD
   * @param {Boolean} [options.useHttps=false] - Define wheter to use or not an
   *   an https server.
   * @param {Object} [options.httpsInfos=null] - if `useHttps` is `true`, object
   *   that give the path to `cert` and `key` files (`{ cert, key }`). If `null`
   *   an auto generated certificate will be generated, be aware that browsers
   *   will consider the application as not safe in the case.
   * @param {Object} [options.websocket={}] - TBD
   * @param {String} [options.env='development']
   * @param {String} [options.templateDirectory='src/server/tmpl'] - Folder in
   *   which the server will look for the `index.html` template.
   *
   * @param {Function} clientConfigFunction -
   */
  async init(config, clientConfigFunction) {
        // must be done this way to keep the instance shared
    this.config = config;

    if (this.config.port === undefined) {
       this.config.port = 8000;
    }

    if (this.config.publicDirectory === undefined) {
      this.config.publicDirectory = path.join(process.cwd(), 'public');
    }

    if (this.config.serveStaticOptions === undefined) {
      this.config.serveStaticOptions = {};
    }

    if (this.config.templateDirectory === undefined) {
      this.config.templateDirectory = path.join(process.cwd(), 'src', 'server', 'tmpl');
    }

    if (this.config.defaultClient === undefined) {
      this.config.defaultClient = 'player';
    }

    if (this.config.websockets === undefined) {
      this.config.websockets = {};
    }

    this.serviceManager.init();
    await this.server.init(config, clientConfigFunction);

    this.stateManager = new StateManager(this.server);

    return Promise.resolve();
  },

  async start() {
    try {
      // @todo - create some dist public path builded files
      // separate what comes from build and what comes from user
      await this.server.serveStatic();
      await this.server.initActivities();
      await this.server.createHttpServer();
      await this.server.initRouting();
      await this.server.startSocketServer();
      await this.serviceManager.start();
      await this.server.listen();

      return Promise.resolve();
    } catch(err) {
      console.error(err)
    }
  },

  registerService(serviceFactory) {
    const ctor = serviceFactory(this);
    this.serviceManager.register(serviceFactory.id, ctor);
  },
}

export default soundworks;
