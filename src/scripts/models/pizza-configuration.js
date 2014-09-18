'use strict';

var $ = require('jquery');

var PizzaConfiguration = function(attrs) {
  this.size = 'medium';
  this.cheese = 'normal';
  this.extras = [];
  this.toppings = [];

  $.extend(this, attrs);
};

PizzaConfiguration.prototype = {
  availableSizes: {
    'small': { label: 'Small (25cm)', price: 400 },
    'medium': { label: 'Medium (28cm)', price: 500 },
    'large': { label: 'Large (32cm)', price: 600 }
  },
  availableCheese: {
    'normal': { label: 'Normal', price: 0 },
    'mozzarella': { label: 'Mozzarella', price: 100 }
  },
  availableToppings: {
    'tomatoes': { label: 'Tomatoes', price: 100 },
    'salami': { label: 'Salami', price: 100 },
    'ham': { label: 'Ham', price: 100 },
    'pepperoni': { label: 'Pepperoni', price: 100 },
    'onions': { label: 'Onions', price: 100 },
    'fried-onions': { label: 'Fried Onions', price: 100 },
    'tuna': { label: 'Tuna', price: 100 }
  },
  availableExtras: {
    'cheese-crust': { label: 'Cheese Crust', price: 200 }
  },
  validate: function() {
    var errors = {};

    if (!this.size || !this.availableSizes[this.cheese]) {
      errors.size = 'You must select a pizza size';
    }

    if (!this.cheese || !this.availableCheese[this.cheese]) {
      errors.cheese = 'There is no pizza without cheese';
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }

    return errors;
  },
  totalPrice: function() {
    var availableToppings = this.availableToppings;
    var availableExtras = this.availableExtras;

    var price = this.availableSizes[this.size].price + this.availableCheese[this.cheese].price;

    price += this.toppings
      .map(function(topping) {
        return availableToppings[topping].price;
      })
      .concat(this.extras.map(function(extra) {
        return availableExtras[extra].price;
      }))
      .reduce(function(previous, current) {
        return previous + current;
      }, 0);

    return price;
  },
  totalPriceInDollars: function() {
    return this.totalPrice() / 100;
  }
};

module.exports = PizzaConfiguration;
