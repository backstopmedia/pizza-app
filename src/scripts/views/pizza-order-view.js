'use strict';

var Handlebars = require('handlebars');
var $ = require('jquery');

var PizzaOrderView = function(model, $el) {
  this.model = model;
  var template = Handlebars.compile($('#pizza-order-template').html());
  $el.html(template(model));
};

module.exports = PizzaOrderView;
