import * as yup from "yup";

export const signupSchema = yup.object({
    userName: yup
        .string()
        .max(20, "Too Long!")
        .required("Username is required")
        .matches(/^\S*$/, "Username cannot contain spaces"),
    userDisplayName: yup
        .string()
        .max(20, "Too Long!")
        .required("Display name is required"),
    userEmail: yup
        .string()
        .required("Email can't be empty")
        .email("Enter valid email"),
    userPassword: yup
        .string()
        .required("Password is required")
        .trim()
        .nonNullable()
        .min(4, "Minimum length should be 4")
        .matches(/^\S+$/, "Password cannot be empty spaces"),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .trim()
        .nonNullable()
        .min(4, "Minimum length should be 4")
        .matches(/^\S*$/, "Confirm password cannot be empty spaces")
        .oneOf([yup.ref("userPassword"), null], "Passwords must match"),
});

export const loginSchema = yup.object({
    userEmail: yup
        .string()
        .required("Email can't be empty")
        .email("Enter valid email"),
    userPassword: yup
        .string()
        .required("Password is required")
        .trim()
        .nonNullable()
        .min(4, "Minimum length should be 4")
        .matches(/^\S*$/, "Password cannot be empty spaces"),
});

export const inviteSchema = yup.object({
    inviteeEmail: yup
        .string()
        .required("Email can't be empty")
        .email("Enter valid email")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Enter a valid email",
        ),
});

export const resetSchema = yup.object({
    userPassword: yup
        .string()
        .required("Password is required")
        .trim()
        .nonNullable()
        .min(4, "Minimum length should be 4")
        .matches(/^\S*$/, "Password cannot be empty spaces"),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .trim()
        .nonNullable()
        .matches(/^\S*$/, "Confirm password cannot be empty spaces")
        .oneOf([yup.ref("userPassword"), null], "Passwords must match"),
});
