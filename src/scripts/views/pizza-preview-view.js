'use strict';

var Handlebars = require('handlebars');
var $ = require('jquery');

var PizzaPreviewView = function(model, $el) {
  this.model = model;
  this.$el = $el;
  this.render();
  
  Object.keys(model).forEach(function(key) {
    this[key] = model[key];
    Object.defineProperty(model, key, {
      get: function() { return this[key]; }.bind(this),
      set: function(value) { this[key] = value; this.render(); }.bind(this)
    });
  }.bind(this));
};

PizzaPreviewView.prototype = {
  render: function() {
    var template = Handlebars.compile($('#pizza-preview-template').html());
    this.$el.html(template(this.model));
  }
};

module.exports = PizzaPreviewView;
