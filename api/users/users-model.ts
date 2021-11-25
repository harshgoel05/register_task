import * as yup from 'yup';

export const userSchema = yup.object().shape({
  phone: yup.number().required(),
  password: yup.string().required(),
});
