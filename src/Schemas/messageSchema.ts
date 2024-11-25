import {z} from 'zod';

// schema for the meassge which we sent  which contain 

export const userSignupSchema =z.object({
   message: z
   .string()
   .min(10 , {message: "Message must be of the 10 character minimum"})
   .max(300 , {message: "It not should not be more than the 300 character"})                              
})