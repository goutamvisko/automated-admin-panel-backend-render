import Joi from 'joi';

export const clientRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  dbUri: Joi.string().uri().required(),
});


export const clientLoginSchema = Joi.object({
  apiKey: Joi.string().length(64).required(), 
});

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
