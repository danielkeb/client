import * as Yup from "yup";
import { REPORT_REASONS } from "../reportReasons";

// Form input validation logic definitions
export const firstNameValidation = Yup.string()
  .min(2, "First name must be at least two characters long")
  .max(30, "First name must not be more than 30 characters long")
  .required("First name is required");

export const lastNameValidation = Yup.string()
  .min(2, "Last name must be at least two characters long")
  .max(30, "First name must not be more than 30 characters long")
  .required("Last name is required");

export const emailValidation = Yup.string()
  .email("Invalid email address")
  .required("Email address is required");

export const phoneValidation = Yup.string()
  .matches(
    /^\+(?:[0-9] ?){6,14}[0-9]$/,
    "Invalid phone number format. Please include country code.",
  )
  .required("Phone number is required");

export const usernameValidation = Yup.string()
  .min(5, "Username must be at least 6 characters long")
  .max(20, "Username must not be more than 20 characters long")
  .required("User name is required");

export const locationValidation = Yup.string().required("Location is required");

export const passwordValidation = Yup.string()
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one numeric digit",
  )
  .min(8, "Password must be at least 8 characters long")
  .max(20, "Password must not be more than 20 characters long")
  .required("Password is required");

export const repeatPasswordValidation = Yup.string()
  .oneOf([Yup.ref("password")], "Passwords must match")
  .required("Repeat password is required");

export const bioTextValidation = Yup.string().max(
  500,
  "Bio must not exceed 500 characters",
);

export const ageValidation = Yup.number()
  .integer("Age must be an integer")
  .positive("Age must be a positive number")
  .required("Age is required")
  .min(18, "You must be at least 18 years old")
  .max(100, "You must be less than 100 years old");

export const genderValidation = Yup.string()
  .required("Gender is required")
  .oneOf(["MALE", "FEMALE"]);

export const urlValidation = Yup.string()
  .url("Invalid URL format")
  .trim()
  .nullable();

// Input field used in `Add Education Info` form - START
export const fieldNameValidation = Yup.string()
  .required("Field of study is required")
  .min(5, "Field of study must be at least 5 characters long");

export const instituteValidation = Yup.string()
  .required("Institute name is required")
  .min(5, "Institute name must be at least 5 characters long");

export const startDateValidation = Yup.date()
  .required("Start date is required")
  .max(new Date(), "Start date must be less than today");

export const endDateValidation = Yup.date().when(
  "stillStudying",
  (stillStudying, schema) =>
    !stillStudying
      ? schema
          .required("End date is required")
          .min(Yup.ref("startDate"), "End date must be after start date")
      : schema,
);

export const descriptionValidation = Yup.string().max(
  500,
  "Description must be at most 500 characters",
);
// Input field used in `Add Education Info` form - END

// Input field used in `Create organization` form - START
export const orgNameValidation = Yup.string()
  .min(5, "Organization name must be at least five characters long")
  .max(50, "Organization name must not be more than 50 characters long")
  .required("Organization name is required");

export const missionTextValidation = Yup.string().max(
  500,
  "Mission statement must not exceed 500 characters",
);

export const foundingDateValidation = Yup.date()
  .required("Founding date is required")
  .max(new Date(), "Founding date must be less than today")
  .optional();

export const contactEmailValidation = Yup.string().email(
  "Invalid email address",
);
// Input field used in `Create organization` form - END

// Input field used in `Add Project Info` form - START
export const projectTitleValidation = Yup.string()
  .max(100, "Project title must not exceed 100 characters")
  .required("Project title is required.");

export const projectDescriptionValidation = Yup.string()
  .max(500, "Project description must not exceed 500 characters")
  .required("Project description is required.");

export const projectStartDateValidation = Yup.date()
  .required("Start date is required")
  .min(new Date(), "Start date must be greater than today");

export const projectEndDateValidation = Yup.date()
  .required("End date is required")
  .min(Yup.ref("startDate"), "End date must be after start date");
// Input field used in `Add Project Info` form - END

// Input field used in `Report` form - START
export const reportReasonValidation = Yup.string()
  .oneOf(REPORT_REASONS, "Please select a valid reason")
  .required("Reason is required");

export const reportDescriptionValidation = Yup.string()
  .optional()
  .min(10, "Description must be at least 10 characters long")
  .max(500, "Description must not be more than 500 characters long");
// Input field used in `Report` form - END
