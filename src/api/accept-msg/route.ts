import { getServerSession } from 'next-auth/next';
import Usermodel from '@/model/User';
import { User } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/option';
import { dbconnect } from '@/lib/dbconnect';

// POST request handler to update user's message acceptance status
export async function POST(request: Request) {
  // Connect to the database
  await dbconnect();

  // Get the current user's session
  const session = await getServerSession(authOption);
  const user: User = session?.user;

  // Check if user is authenticated
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Extract message acceptance preference from request
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    // Update user's message acceptance status in the database
    const updatedUser = await Usermodel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    // Handle case where user is not found
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    // Return success response with updated user
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors during the update process
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}

// GET request handler to retrieve user's current message acceptance status
export async function GET(request: Request) {
  // Connect to the database
  await dbconnect();

  // Get the current user's session
  const session = await getServerSession(authOption);
  const user = session?.user;

  // Check if user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Find the user in the database
    const foundUser = await Usermodel.findById(user._id);

    // Handle case where user is not found
    if (!foundUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's current message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isacceptingmsg,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors during the retrieval process
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}