/**
 * @fileoverview Soundworks server side parameter module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var server = require('./server');

class ServerParameters extends ServerModule {
  constructor() {
    this.controls = {};
    this.commands = {};
    this.displays = {};
    this.namespaces = [];
  }

  addControlNumber(name, label, min, max, step, init) {
    this.controls[name] = {
      type: 'number',
      name: name,
      label: label,
      min: min,
      max: max,
      step: step,
      value: init
    };
  }

  addControlSelect(name, label, options, init) {
    this.controls[name] = {
      type: 'select',
      name: name,
      label: label,
      options: options,
      value: init
    };
  }

  addCommand(name, label, fun) {
    this.commands[name] = {
      name: name,
      label: label,
      fun: fun
    };
  }

  addDisplay(name, label, init) {
    this.displays[name] = {
      name: name,
      label: label,
      value: init
    };
  }

  connect(client) {
    var socket = client.socket;
    var namespace = socket.nsp;

    if (this.namespaces.indexOf(namespace) < 0)
      this.namespaces.push(namespace);

    // listen to control parameters
    socket.on('parameters_control', (name, val) => {
      this.controls[name].value = val;

      // send control parameter to other clients
      for(let namespace of this.namespaces)
        namespace.emit('parameters_control', name, val);
    });

    // listen to conductor commands
    socket.on('parameters_command', (name) => {
      this.commands[name].fun();
    });

    // init parameters controls, displays, and commands at client
    socket.emit("parameters_init", this.controls, this.displays, this.commands);
  }
}

module.exports = ServerParameters;