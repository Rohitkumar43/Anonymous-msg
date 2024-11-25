import {z} from 'zod';

export const uservalidation = z
    .string()
    .min(2 , "min char for this will be the 2 c")
    .max(20 , "it can't will be more than the 20 char")
    .regex(/^[a-zA-Z0-9_]+$/ , "username must not contain special character")

// schema for the signup page which contain 

export const userSignupSchema =z.object({
    username: uservalidation,
    email: z.string().email({message: "give your right email" }),
    password: z.string().min(6 , {message: "password must will be of 6 character"})                               
})