'use strict';

require('./handlebars-config');

var $                      = require('jquery');
var PizzaConfigurationView = require('./views/pizza-configuration-view');
var PizzaPreviewView       = require('./views/pizza-preview-view');
var PizzaOrderView         = require('./views/pizza-order-view');
var PizzaConfiguration     = require('./models/pizza-configuration');

$(document).ready(function() {
  loadPizzaConfiguration();
});

function loadPizzaConfiguration(pizzaConfiguration) {
  var $main = $('#main');
  var $pizzaConfiguration = $main.find('.pizza-configuration');
  var $pizzaPreview = $main.find('.pizza-preview');

  pizzaConfiguration = pizzaConfiguration || new PizzaConfiguration({
    size: 'medium',
    cheese: 'normal',
    toppings: ['tomatoes', 'salami']
  });

  new PizzaConfigurationView(pizzaConfiguration, $pizzaConfiguration, loadOrderConfirmation);
  new PizzaPreviewView(pizzaConfiguration, $pizzaPreview);
}

function loadOrderConfirmation(pizzaConfiguration) {
  new PizzaOrderView(pizzaConfiguration, $('#main'));
}
