import Ajv from 'ajv';

const dateTimeRegex = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]) (2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?$');

const getAjv = (options: Ajv.Options) => {
  const ajv = new Ajv({
    coerceTypes: true,
    ...options,
  });
  ajv.addFormat('date-time', {
    validate: (dateTimeString: string) => dateTimeRegex.test(dateTimeString),
  });
  return ajv;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getAjv,
};
