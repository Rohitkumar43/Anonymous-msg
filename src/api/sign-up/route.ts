import bcrypt from 'bcryptjs'
import { dbconnect } from "@/lib/dbconnect";
import { sendemailverfication } from "@/helpers/sendvarifiactionEMail";
import { DevBundlerService } from 'next/dist/server/lib/dev-bundler-service';
import Usermodel from '@/model/User';
import { allowedNodeEnvironmentFlags } from 'process';


export async function POST(request: Request) {
    try {
        const {username , email , password} = await request.json()

    const checkUserByUsername = await Usermodel.findOne({
        username: username,
        isverified: true 
    })
    if(checkUserByUsername){
        return Response.json({
            success: false,
            status: 400,
            message: 'username is not found'
        })
    }

    const checkUserByEmail = await Usermodel.findOne({
        email
    })
    // code for the opt genration 
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString

    if (checkUserByEmail) {
        if(checkUserByEmail.isverified){
            return Response.json({
                success: false,
                message: 'email is already registerd please check ' 
            }, {
                status: 400
            });

        }else {
            // new registration karwao with the passwod 
            const hashpassword = await bcrypt.hash(password , 10)
            checkUserByEmail.password = hashpassword;
            checkUserByEmail.verifycode = verifycode,
            checkUserByEmail.
            
        }
    } else {
        const hashpassword = await bcrypt.hash(password , 10);
        // set the expirary date for that
        const expirarydate = new Date();
        expirarydate.setHours(expirarydate.getHours() + 1 );
    }
    // take all the value and sAVED THE Value for that i.e saved the user 
    const newUser = new Usermodel({
        username,
        email,
        password: hashpassword,
        verifycode,
        verifycodeexpirary: expirarydate,
        isverified: false,
        isacceptingmsg: true,
        messages: []
    });

    await newUser.save();

    const emailResponse = await sendemailverfication(
        username,
        email,
        verifycode
    )

    if (!emailResponse) {
        return Response.json({
            success: false,
            message: emailResponse.message
        }, {
            status: 500
        });
    }

    return Response.json({
        success: true,
        message: "Email is registered succcesfully Now verify your email "
    }, {
        status: 201
    })
        
    } catch (error) {
        console.error("there is somerhig issue in the registering" , error);
        return Response.json({
            success: false,
            message: "Error in the registering"
        },
        {
            status: 500

        }
    )
    }
}