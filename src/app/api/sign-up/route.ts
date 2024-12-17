import bcrypt from 'bcryptjs';
import { dbconnect } from "@/lib/dbconnect";
import { sendemailverfication } from "@/helpers/sendvarifiactionEMail";
import Usermodel from "@/model/User";

export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, email, password } = await request.json();

        // Check if the username is already taken by a verified user
        const existingVerifiedUserUsername = await Usermodel.findOne({
            username: username,
            isverified: true,
        });
        if (existingVerifiedUserUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken.",
                }),
                { status: 400 }
            );
        }

        // Check if the email is already registered
        const existingUserByEmail = await Usermodel.findOne({ email });
        let hashpassword;
        let expirarydate = new Date();
        expirarydate.setHours(expirarydate.getHours() + 1);

        const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isverified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "Email is already registered. Please log in.",
                    }),
                    { status: 400 }
                );
            } else {
                // Update the existing unverified user
                hashpassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashpassword;
                existingUserByEmail.verifycode = verifycode;
                existingUserByEmail.verifycodeexpirary = expirarydate.toISOString(); // using .toTSOstring method as in schema 
                // we have defines the verifycodeexpirary in string for that date fxn have to be string that's why you got the error

                await existingUserByEmail.save();
            }
        } else {
            // Register a new user
            hashpassword = await bcrypt.hash(password, 10);
            const newUser = new Usermodel({
                username,
                email,
                password: hashpassword,
                verifycode,
                verifycodeexpirary: expirarydate,
                isverified: false,
                isacceptingmsg: true,
                messages: [],
            });
            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendemailverfication(username, email, verifycode);

        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: emailResponse.message,
                }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Email registered successfully. Please verify your email.",
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during registration:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error during registration.",
            }),
            { status: 500 }
        );
    }
}
