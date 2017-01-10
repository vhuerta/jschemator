# jschemator
Simple npm package to validate an object using JSON Schema, and get errors in friendly form, useful to validate on frontend with VUE or maybe REACT!

## Install

```bash
$ npm install jschemator
```
## Options

| Parameter | Default | Description |
|-----------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| schema | None | The JSON schema to validate, this plugin uses[ajv](https://github.com/epoberezkin/ajv) check the docs to create your schemas |
| model | None | The object to validate |
| locale | 'en' | Locale to error messages, this plugin uses [ajv-i18n](https://github.com/epoberezkin/ajv-i18n), see the doc to all available languages |
| options | {allErrors: true} | ajv options, this plugin uses[ajv](https://github.com/epoberezkin/ajv) see the doc to all options |

## Usage

#### Simple



```js
const jschemator = require('jschemator')

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  },
  required: ['email']
 };
 
 const model = {};
 const validator = jschemator(schema, model, 'en');
 
 const valid = validator.validate();
 // => false
 
 validator.$errors;
 // => { email: { required: 'should have required property email' } }
 
```

#### Vue.JS example

```html

<div class="form-group" v-bind:class="[{ 'has-error': (validator.$submitted && validator.$errors.email)}]">
  <label for="email" class="control-label">Email:</label>
  <input class="form-control" type="text" id="email" v-model="email" @input="validate">
  <span class="text-danger" v-if="validator.$submitted && validator.$errors.email" v-for="(message, key) in validator.$errors.email">
    This field, {{message}}
  </span>
</div>

```

```javascript
import jschemator from 'jschemator';

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  },
  required: ['email']
};

export default {
  data() {
    return {
      email: null,
      validator: jschemator(schema, this, 'es')
    }
  },
  methods:  {
    validate()  {
      this.validator.validate();
    },
    submit() {
      if(this.validator.validate(true)) {
        console.log('valid');
      } else {
        console.log('no valid');
      }
    }
  }
};
  
```
