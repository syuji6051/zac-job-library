import ajv from '../core/ajv';

const validate = (validateJson: any, data: any) => {
  const compileFunc = ajv.compile(validateJson);

  const compile = compileFunc;
  if (!compile(data)) {
    const errorMessage = compile.errors
      ? `request miss match ${compile.errors.map((e) => e.message).join()}`
      : 'request miss match';
    throw new TypeError(errorMessage);
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  validate,
};
