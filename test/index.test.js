const jschemator = require('./../src/index');

const schema = {
  type      : 'object',
  properties: {
    email: {
      type  : 'string',
      format: 'email'
    },
    nested: {
      type      : 'object',
      properties: {
        date: {
          type  : 'string',
          format: 'date-time'
        }
      },
      required: ['date']
    }
  },
  required: ['email', 'nested']
};

describe('jschemator test', () => {
  describe('#validate', () => {
    it('should fail validating an invalid payload, errors should have \'deep\' format', () => {
      const model = { nested: { date: 'bad-format-date' } };
      const expectedErrorsObject = {
        email : { required: 'should have required property email' },
        nested: { date: { format: 'should match format "date-time"' } }
      };

      const validator = jschemator(schema, 'en');

      const valid = validator.validate(model);

      valid.should.be.false();
      validator.errors.should.deepEqual(expectedErrorsObject);
    });

    it('should fail validating an invalid payload, errors should have \'flat\' format', () => {
      const model = { nested: { date: 'bad-format-date' } };
      const expectedErrorsObject = {
        'email.required'    : 'debe tener la propiedad requerida email',
        'nested.date.format': 'debe coincidir con el formato "date-time"'
      };
      const expectedPaths = ['email.required', 'nested.date.format'];

      const validator = jschemator(schema, 'es', { flat: true });

      const valid = validator.validate(model);

      valid.should.be.false();
      validator.errors.should.deepEqual(expectedErrorsObject);
      validator.paths.should.deepEqual(expectedPaths);
    });
  });
});
