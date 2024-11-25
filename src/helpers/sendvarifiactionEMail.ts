import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/emailverification";
import { apiResponse } from "@/types/apiresponses";

export async function sendemailverfication(
    email: string,
    username: string,
    verifycode: string
): Promise<apiResponse> {
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Annoymous Msg || Verification email',
            react: VerificationEmail({username , otp: verifycode}),
          });
        return {success: true , message: 'Email is sent succesfully '}
    } catch (emailerror) {
        console.error("there is something error in sending the email" , emailerror)
        return {success: false , message: 'failed to send the verification email'}
    }
}