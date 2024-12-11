import { dbconnect } from "@/lib/dbconnect";
import Usermodel from "@/model/User";
import { Message } from '@/model/User';

export async function POST(req: Request) {
    await dbconnect();
    // as we know it annoymouns msg so anybody can send the msg so there is noneed to be logged in 
    // get the username and the content 
    const { username, content } = await Request.json()
    try {
        const user = await Usermodel.findOne(username);
        // check that the user is present or not 
        if (!user) {
            return Response.json(
                { success: false, message: 'User is not found' },
                { status: 403 }
            );
        }

        // check it accdepting the messages
        if (!user.isacceptingmsg) {
            return Response.json(
                { success: false, message: 'messages is not acepted by the user' },
                { status: 200 }
            );
        }

        // if accepting the msg
        const newMessage = { content, createdAt: new Date() };

        // Push the new message to the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );

    } catch (error) {
        // Handle any errors during the update process
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );

    }
}