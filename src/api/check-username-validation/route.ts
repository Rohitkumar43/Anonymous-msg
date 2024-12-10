// HERE THE API IS DEFINED FOR THE CHECKING OF THR USERNAME UNIQUE
import { dbconnect } from "@/lib/dbconnect";
import { z } from 'zod';
import Usermodel from "@/model/User";
import { uservalidation } from '@/Schemas/signupSchema';

// Create a schema to validate username
const checkUserSchema = z.object({ username: uservalidation });

export async function GET(req: Request) {
    // make this route where it always acess GET method only 
    // APPLY ALL THESE IN ALL THE ROUTES 
    if(req.method !== 'GET'){
        return Response.json(
            {
                success: false,
                message: 'ONLY GET method is allowed',
            },
            { status: 200 }
        );

    }
   // Establish database connection
   await dbconnect();

   try {
       // Extract username from URL query parameters
       const { searchParams } = new URL(req.url);
       const queryparams = {
           username: searchParams.get('username')
       }

       // Validate username using Zod schema
       const result = checkUserSchema.safeParse(queryparams);

       // Handle validation errors
       if (!result.success) {
           const usernameError = result.error.format().username?._errors || [];
           return Response.json(
               {
                   success: false,
                   message: usernameError?.length > 0
                       ? usernameError.join(', ')
                       : 'Invalid query parameters',
               },
               { status: 400 }
           );
       }

       // Check if username already exists in verified users
       const { username } = result.data;
       const existingVerifiedUser = await Usermodel.findOne({
           username,
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
       console.log("Error checking username", error);
       return Response.json({
           message: "Error checking username",
           success: false
       }, {
           status: 500
       })
   }
}