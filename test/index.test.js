import jschemator from './../src/index';

describe('jschemator test', () => {

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

  describe('#validate', () => {

    it('should run validations on an empty object, and return not valid', () => {
      const model = {};
      const validator = jschemator(schema, model, 'es');

      const valid = validator.validate();

      (valid === false).should.be.true();
      validator.should.have.ownProperty('$result');
      validator.$result.should.be.an.Object();
      validator.$result.should.have.ownProperty('$errors');
    });
  });
});