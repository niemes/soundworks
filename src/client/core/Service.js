import Activity from './Activity';
import debug from 'debug';
import serviceManager from './serviceManager';
import Signal from './Signal';
import SignalAll from './SignalAll';

const log = debug('soundworks:services');

export default class Service extends Activity {
  constructor(id, hasNetwork) {
    super(id, hasNetwork);

    this._requiredSignals = new SignalAll();
    this._requiredSignals.addObserver((value) => {
      if (value) {
        this.start();
        this.hasStarted = true;
      } else {
        this.stop();
      }
    });

    /**
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */
    this.signals.ready = new Signal();

    // add the serviceManager bootstart signal to the required signals
    this._requiredSignals.add(serviceManager.signals.start);
  }

  ready() {
    this.stop();
    this.signals.ready.set(true);
    log(`"${this.id}" ready`);
  }

  require(id) {
    const service = serviceManager.require(id);
    const signal = service.signals.ready;

    if (signal)
      this._requiredSignals.add(signal);
    else
      throw new Error(`signal "continue" doesn't exist on service :`, service);

    return service;
  }

  start() {
    super.start();
    log(`"${this.id}" started`);
  }

  stop() {
    super.stop();
    log(`"${this.id}" stopped`);
  }
}

