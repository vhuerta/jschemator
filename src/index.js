const Ajv = require('ajv');
const i18n = require('ajv-i18n');
const set = require('lodash.set');

const pathDelimiter = '.';

function flatten(source, flattened = {}, keySoFar = '') {
  function getNextKey(key) {
    return `${keySoFar}${keySoFar ? pathDelimiter : ''}${key}`;
  }
  if (typeof source === 'object') {
    for (const key in source) {
      flatten(source[key], flattened, getNextKey(key));
    }
  } else {
    flattened[keySoFar] = source;
  }
  return flattened;
}

/**
 * Object with methods to validate an object using JSON schemas
 *
 * @author Victor Huerta <vhuertahnz@gmail.com>
 */

const validator = {
  // Initialize the object with schema, model and locale
  init(
    schema,
    locale = 'en',
    { flat = false, allErrors = true, ...options } = {}
  ) {
    this.flat = flat;
    this.locale = locale;
    this.schema = schema;
    this.ajv = new Ajv({ allErrors, ...options });
    this.validator = this.ajv.compile(schema);

    this.result = {
      valid : true,
      errors: {}
    };

    return this;
  },

  validate(model = null) {
    const valid = this.validator(model);
    const { errors } = this.validator;
    this.set(valid, errors);
    return this.result.valid;
  },

  set(valid, errors = []) {
    errors = errors || [];
    i18n[this.locale](errors);
    this.result.valid = valid;
    this.result.errors = this.process(errors);
  },

  process(errors = []) {
    let result = {};
    errors.forEach(e => {
      const chunks = e.dataPath.split('.');
      let path = chunks.filter(e => !!e);
      switch (e.keyword) {
      case 'required':
        path.push(e.params.missingProperty);
        path.push(e.keyword);
        set(result, path, e.message);
        break;
      default:
        path.push(e.keyword);
        set(result, path, e.message);
      }
    });
    return result;
  },

  get errors() {
    return !this.flat ? this.result.errors : flatten(this.result.errors);
  },

  get paths() {
    return Object.keys(flatten(this.result.errors));
  }
};

module.exports = (schema, model, options, locale) => {
  const v = Object.create(validator);
  return v.init(schema, model, options, locale);
};
