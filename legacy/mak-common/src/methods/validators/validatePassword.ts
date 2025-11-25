import PasswordValidator from 'password-validator';

export const validatePassword = (password: string) => {
  const schema = new PasswordValidator();

  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 2 digits
    .is()
    .not()
    .oneOf(['Passw0rd', 'Password123', 'pa$$w0rd']);

  return schema.validate(password);
};
