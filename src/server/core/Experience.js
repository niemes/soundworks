import Activity from './Activity';
import serviceManager from './serviceManager';

/**
 * Base class used to build a experience on the server side.
 *
 * Along with the classic {@link src/server/core/Activity#connect} and
 * {@link src/server/core/Activity#disconnect} methods, the base class has two
 * additional methods:
 * - {@link Experience#enter}: called when the client enters the `Experience`
 * (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the
 * client side calls its {@link src/client/scene/Experience.js~Experience#start} method);
 * - {@link Experience#exit}: called when the client leaves the `Experience`
 * (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the
 * client side calls its {@link src/client/scene/Experience.js~Experience#done}
 * method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the
 * performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/scene/Experience.js~Experience} on the client side.)
 *
 * @memberof module:soundworks/server
 */
class Experience extends Activity {
  constructor(clientTypes) {
    super('experience');

    /**
     * List of the clients who are currently in the performance.
     * @type {Client[]}
     */
    this.clients = [];

    this.addClientTypes(clientTypes);
    this.waitFor(serviceManager.signals.ready);

    this._errorReporter = this.require('error-reporter');
  }


  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   */
  connect(client) {
    super.connect(client);

    // listen for `'enter'` and `'exit'` socket messages from the client
    this.receive(client, 'enter', () => this.enter(client));
    this.receive(client, 'exit', () => this.exit(client));
  }

  /**
   * Called when the client disconnects from the server.
   * @param {Client} client Disconnected client.
   */
  disconnect(client) {
    super.disconnect(client);

    // call `exit()` only if the client previously `enter()`ed
    // aka, finished its initialization
    if (this.clients.indexOf(client) !== -1) {
      this.exit(client);
    }
  }

  /**
   * Called when the client starts the performance on the client side.
   * @param {Client} client Client who enters the performance.
   */
  enter(client) {
    // add the client to the `this.clients` array
    this.clients.push(client);
  }

  /**
   * Called when the client exits the performance on the client side (*i.e.*
   * when the `done` method of the client side experience is called, or when
   * the client disconnects from the server).
   * @param {Client} client - Client who exits the performance.
   */
  exit(client) {
    const index = this.clients.indexOf(client);

    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }
}

export default Experience;
