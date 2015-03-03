/**
 * @fileoverview Soundworks client side module base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var container = window.container || (window.container = document.getElementById('container'));

class ClientModule extends EventEmitter {
  constructor(name, hasView = true, viewColor = 'black') {
    super();

    this.view = null;

    if (hasView) {
      var div = document.createElement('div');
      div.setAttribute('id', name);
      div.classList.add(name);
      div.classList.add('module');
      div.classList.add(viewColor);

      this.view = div;
    }

    this.isDone = false;
  }

  start() {
    if (this.view)
      container.appendChild(this.view);
  }

  done() {
    if (this.view)
      container.removeChild(this.view);

    if (!this.isDone) {
      this.isDone = true;
      this.emit('done', this);
    }
  }

  setViewText(text, ...cssClasses) {
    if (this.view) {
      let textDiv = document.createElement('div');
      textDiv.classList.add('centered-content');

      if (text) {
        var paragraph = document.createElement('p');
        
        for (let cssClass of cssClasses)
          paragraph.classList.add(cssClass);

        paragraph.innerHTML = text;
        textDiv.appendChild(paragraph);
      }

      this.view.appendChild(textDiv);

      return textDiv;
    }
  }
}

module.exports = ClientModule;