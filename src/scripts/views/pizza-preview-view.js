'use strict';

var Handlebars = require('handlebars');
var $ = require('jquery');

var PizzaPreviewView = function(model, $el) {
  this.model = model;
  this.$el = $el;
  this.render();

  Object.observe(model, this.render.bind(this));
};

PizzaPreviewView.prototype = {
  render: function() {
    var template = Handlebars.compile($('#pizza-preview-template').html());
    this.$el.html(template(this.model));
  }
};

module.exports = PizzaPreviewView;
