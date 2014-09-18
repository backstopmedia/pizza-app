'use strict';

var Handlebars = require('handlebars');
var $ = require('jquery');

Handlebars.registerPartial('pizzaPreview', $('#pizza-preview-template').html());

Handlebars.registerHelper('checkRadio', function(value, expectedValue) {
  if (value === expectedValue) {
    return new Handlebars.SafeString('checked="checked"');
  }

  return new Handlebars.SafeString('');
});

Handlebars.registerHelper('checkCheckbox', function(values, expectedValue) {
  if (!values) {
    return;
  }

  for (var i = 0; i < values.length; i++) {
    if (values[i] === expectedValue) {
      return new Handlebars.SafeString('checked="checked"');
    }
  }

  return new Handlebars.SafeString('');
});

Handlebars.registerHelper('getLabel', function(object, key) {
  return object[key].label;
});
