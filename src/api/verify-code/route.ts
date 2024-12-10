import { dbconnect } from "@/lib/dbconnect";
import Usermodel from "@/model/User"; 

export async function POST(request: Request) {
    // Establish database connection
    await dbconnect();

    try {
        // Extract username and verification code from the request body
        const { username, code } = await request.json();
        
        // Decode the URL-encoded username to handle special characters
        const decodedUsername = decodeURIComponent(username);

        // Find the user in the database by username
        const user = await Usermodel.findOne({ username: decodedUsername });

        // Return error if user is not found
        if (!user) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if the verification code is correct and not expired
        const isCodeValid = user.verifycode === code;
        const isCodeNotExpired = new Date(user.verifycodeexpirary) > new Date();

        // Handle verification process
        if (isCodeValid && isCodeNotExpired) {
            // Mark user as verified and save the updated user
            user.isverified = true;
            await user.save();

            return Response.json(
                { success: true, message: 'Account verified successfully' },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            // Return error if verification code has expired
            return Response.json(
                {
                    success: false,
                    message: 'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
            );
        } else {
            // Return error if verification code is incorrect
            return Response.json(
                { success: false, message: 'Incorrect verification code' },
                { status: 400 }
            );
        }
    } catch (error) {
        // Log and handle any unexpected errors 
        console.log("Error checking username", error);
        return Response.json({
            message: "Error checking username",
            success: false
        }, {
            status: 500
        });
    }
}