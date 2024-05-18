const handelReqValidation = (payload, schema) => {
    if (!payload) {
        throw new Error('Payload is required');
    }
    if (!schema) {
        throw new Error('Schema is required');
    }
    const validate = schema.validate(payload);
    if (validate.error) {
        throw new Error(validate.error);
    }
}

module.exports = handelReqValidation;