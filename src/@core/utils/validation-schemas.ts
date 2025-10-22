import * as yup from 'yup'

/**
 * Common validation schemas using yup
 * Reusable validation rules for forms across the application
 */

// Email validation
export const emailSchema = yup
  .string()
  .email('Invalid email format')
  .required('Email is required')

// Password validation
export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required')

// Phone validation (Uzbekistan format)
export const phoneSchema = yup
  .string()
  .matches(/^[0-9]{9}$/, 'Invalid phone number format')
  .required('Phone number is required')

// Passport validation
export const passportSchema = yup
  .string()
  .matches(/^[A-Z]{2}[0-9]{7}$/, 'Invalid passport format (e.g., AA1234567)')
  .required('Passport is required')

// Required string
export const requiredString = (fieldName = 'This field') =>
  yup.string().required(`${fieldName} is required`)

// Optional string
export const optionalString = yup.string().optional()

// Required number
export const requiredNumber = (fieldName = 'This field') =>
  yup.number().required(`${fieldName} is required`)

// Positive number
export const positiveNumber = (fieldName = 'This field') =>
  yup.number().positive(`${fieldName} must be positive`).required(`${fieldName} is required`)

// Date schema
export const dateSchema = yup.date().required('Date is required')

// URL schema
export const urlSchema = yup.string().url('Invalid URL format').optional()

/**
 * Login form validation schema
 */
export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  company_schema: requiredString('Company subdomain')
})

/**
 * Client form validation schema
 */
export const clientSchema = yup.object({
  name: requiredString('Name'),
  surname: requiredString('Surname'),
  middle_name: optionalString,
  passport: passportSchema,
  phone: phoneSchema,
  email: emailSchema.optional(),
  date_of_birth: dateSchema,
  place_of_birth: requiredString('Place of birth'),
  place_of_registration: requiredString('Place of registration'),
  place_of_residence: requiredString('Place of residence')
})

/**
 * Password change validation schema
 */
export const changePasswordSchema = yup.object({
  current_password: requiredString('Current password'),
  new_password: passwordSchema,
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required('Please confirm your password')
})

/**
 * Generic search form schema
 */
export const searchSchema = yup.object({
  query: yup.string().optional(),
  status: yup.string().optional(),
  dateFrom: yup.date().optional(),
  dateTo: yup
    .date()
    .optional()
    .min(yup.ref('dateFrom'), 'End date must be after start date')
})

