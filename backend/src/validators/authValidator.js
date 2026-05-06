import z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: "Name must be atleast 3 characters long." })
    .max(100, { error: "Name must be no more than 100 characters long." }),
  email: z
    .email({error: "Please enter a valid email address."})
    .max(100, { error: "Email must be no more than 100 characters long." }),
  password: z
    .string()
    .min(6, { error: "Password must be atleast 6 characters long." })
    .max(100, { error: "Password must be no more than 100 characters long." }),
});

export const LoginSchema = z.object({
  email: z
    .email({error: "Please enter a valid email address."})
    .max(100, { error: "Email must be no more than 100 characters long." }),
  password: z
    .string()
    .min(6, { error: "Password must be atleast 6 characters long." })
    .max(100, { error: "Password must be no more than 100 characters long." }),
});