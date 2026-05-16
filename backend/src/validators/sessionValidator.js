import z from "zod";

export const SessionSchema = z.object({
  type: z.enum(["DSA", "Dev", "Applications", "Learning", "Other"]),
  status: z.enum(["Completed", "In Progress"]),
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(100, { message: "Title must not be more than 100 characters long" }),
  duration: z.number().positive({ message: "Duration must be a positive number." }),
  notes: z.string().optional(),
  link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});
