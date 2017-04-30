import Ajv from 'ajv';
import i18n from 'ajv-i18n';
import _ from 'lodash';
/**
 * Object with methods to validate an object using JSON schemas
 * 
 * @author Victor Huerta <vhuertahnz@gmail.com>
 */

const validator = {
  // Initialize the object with schema, model and locale
  init(schema, model, locale = 'en', options = { allErrors: true }) {
    this.locale = locale;
    this.model = model;
    this.schema = schema;
    this.ajv = new Ajv(options);
    this.validator = this.ajv.compile(schema);

    this.$result = {
      $submitted: false,
      $pristine: true,
      $dirty: false,
      $valid: true,
      $errors: {}
    };

    this.validate();

    return this;
  },

  validate($submitted = false, model = null) {
    model = model || this.model;
    const valid = this.validator(model);
    const { errors } = this.validator;

    this.set(valid, errors);

    this.$result.$submitted = this.$result.$submitted || $submitted;
    this.$result.$pristine = false;
    this.$result.$dirty = true;

    return this.$result.$valid;
  },

  set(valid, errors = []) {
    errors = errors || [];
    i18n[this.locale](errors);
    this.$result.$valid = valid;
    this.$result.$errors = this.process(errors);
  },

  process(errors = []) {
    let result = {};
    errors.forEach(e => {
      const chunks = e.dataPath.split('.');
      let path = chunks.filter(e => !!e);
      switch(e.keyword) {
      case 'required':
        path.push(e.params.missingProperty);
      default:
        path.push(e.keyword);
        _.set(result, path, e.message);
      }
    });
    return result;
  },

  set $submitted(val) {
    this.$result.$submitted = !!val;
  },

  get $submitted() {
    return this.$result.$submitted;
  },

  get $errors() {
    return this.$result.$errors;
  }
};

export default(schema, model, options, locale) => {
  const v = Object.create(validator);
  return v.init(schema, model, options, locale);
};