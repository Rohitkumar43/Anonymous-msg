import { getServerSession } from 'next-auth/next';
import Usermodel from '@/model/User';
import { User } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/option';
import { dbconnect } from '@/lib/dbconnect';
import mongoose from 'mongoose';

// in this route we will get all the msg and for that we will use the aggegation pipeline of mongoose 
export async function POST(req: Request) {
    // ssame as take the serversession for that annd the check user is logged in or not 
    await dbconnect();

  // Get the current user's session
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  // Check if user is authenticated
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  // want to get the userId but not in string form as we want to perform aggregation it will give the error
  // so we will just handle it well by mogosoose ID for that 
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await Usermodel.aggregate([
        {$match: {id: userId}},
        {$unwind: '$messages'},
        {$sort: {'messages.createdAt': -1}},
        {$group: {_id: '$_id' , messages: {$push: '$messages'}}}
    ])
    // check that user is present or not
    if (!user || user.length === 0) {
        return Response.json(
            { success: false, message: 'user not found' },
            { status: 400 }
          );        
    }
    // if the user is present send the Response 
    return Response.json(
        { success: false, messages: user[0].messages },
        { status: 200 }
      );
  } catch (error) {
    // Handle any errors during the update process
    console.error('Error in getting the messages', error);
    return Response.json(
      { success: false, message: 'Error in getting the messages' },
      { status: 500 }
    );
  }
}