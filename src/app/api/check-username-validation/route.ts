import { dbconnect } from "@/lib/dbconnect";
import { z } from 'zod';
import Usermodel from "@/model/User";
import { uservalidation } from '@/Schemas/signupSchema';
import { NextRequest } from 'next/server';

// Create a schema to validate username
const checkUserSchema = z.object({ username: uservalidation });

export async function GET(req: NextRequest) {
   // Establish database connection
   await dbconnect();

   try {
       // Extract username from URL query parameters
       const { searchParams } = new URL(req.url);
       const username = searchParams.get('username');

       // Validate username using Zod schema
       const result = checkUserSchema.safeParse({ username });

       // Handle validation errors
       if (!result.success) {
           const usernameError = result.error.format().username?._errors || [];
           return Response.json(
               {
                   success: false,
                   message: usernameError?.length > 0
                       ? usernameError.join(', ')
                       : 'Invalid username',
               },
               { status: 400 }
           );
       }

       // Check if username already exists in verified users
       const existingVerifiedUser = await Usermodel.findOne({
           username: result.data.username,
           isVerified: true,
       });

       // Return response based on username availability
       if (existingVerifiedUser) {
           return Response.json(
               {
                   success: false,
                   message: 'Username is already taken',
               },
               { status: 200 }
           );
       }

       return Response.json(
           {
               success: true,
               message: 'Username is unique',
           },
           { status: 200 }
       );

   } catch (error) {
       // Handle any unexpected errors
       console.error("Error checking username", error);
       return Response.json({
           message: "Error checking username",
           success: false
       }, {
           status: 500
       });
   }
}
