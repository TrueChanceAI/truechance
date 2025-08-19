import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  // Email validation rules
  email: yup
    .string()
    .required("Email is a required field.") // Error for empty email
    .email("Please enter a valid email address."), // Error for invalid email format

  // Password validation rules with separate error messages
  password: yup
    .string()
    .required("Password is a required field.") // Error for empty password
    .min(8, "Password must be at least 8 characters long.") // Error for minimum length
    .max(16, "Password must not exceed 16 characters.") // Error for maximum length
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.") // Error for missing lowercase
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.") // Error for missing uppercase
    .matches(/\d/, "Password must contain at least one number.") // Error for missing number
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>\/?]/,
      "Password must contain at least one special character." // Error for missing special character
    ),
});
