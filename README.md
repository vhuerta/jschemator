# jschemator
Simple npm package to validate an object using JSON Schema, and get errors in friendly form, useful to validate on frontend with VUE or maybe REACT!

## Install

```bash
$ npm install jschemator
```
## Options

| Parameter | Default | Description |
|-----------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| schema | None | The JSON schema to validate, this plugin uses [ajv](https://github.com/epoberezkin/ajv) check the docs to create your schemas |
| locale | 'en' | Locale to error messages, this plugin uses [ajv-i18n](https://github.com/epoberezkin/ajv-i18n), see the doc to all available languages |
| options | {allErrors: true, flat: false} | ajv options, this plugin uses [ajv](https://github.com/epoberezkin/ajv) see the doc to all options |

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
 let validator = jschemator(schema, 'en');
 
 const valid = validator.validate(model);
 // => false
 
 validator.errors;
 // => { email: { required: 'should have required property email' } }
 validator.paths;
 // => ['email.required']

 validator = jschemator(schema, 'en', {flat: true});
 
 const valid = validator.validate(model);

 validator.errors;
 // => { 'email..required': 'should have required property email' }
 validator.paths;
 // => ['email.required']
 
```