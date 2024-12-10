// Importing necessary modules and types from NextAuth and other libraries
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { dbconnect } from "@/lib/dbconnect";
import Usermodel from "@/model/User";

// Configuration for NextAuth authentication
export const authOption: NextAuthOptions = {
    // Define authentication providers
    providers: [
        // Using Credentials Provider for email/password authentication
        CredentialsProvider({
            // Unique identifier and name for this provider
            id: "ceredential",
            name: "ceredetials",
            
            // Define the input fields for authentication
            credentials: {
                // Email or username input field
                email: { 
                    label: "Email", 
                    type: "text", 
                    placeholder: "jsmith" 
                },
                // Password input field
                password: { 
                    label: "Password", 
                    type: "password" 
                },
            },

            // Main authentication logic
            async authorize(credentials: any):  Promise<any> {
                // Ensure database connection
                await dbconnect;

                try {
                    // Find user by either email or username
                    const user = await Usermodel.findOne({
                        $or: [
                          { email: credentials.identifier },
                          { username: credentials.identifier },
                        ],
                    });

                    // Check if user exists
                    if (!user) {
                        throw new Error('No user found with this email');
                    }

                    // Check if user is verified
                    if (!user.isverified) {
                        throw new Error('Please verify your account before logging in');
                    }

                    // Verify password
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    // Return user if password is correct
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect password');
                    }
                    
                } catch (error) {
                    // Generic error handling
                    throw new Error("Authentication error occurred")
                }
            }
        })
    ],

    // Custom pages for authentication flow
    pages: {
        // Custom sign-in page
        signIn: '/sign-in',
    },

    // Callbacks for modifying session and JWT
    callbacks: {
        // Modify session to include additional user information
        async session({ session, token }) {
            // If token exists, add additional user details to session
            if (token) {
                // Add user ID to session
                // Use type assertion to handle potential 'unknown' type
                session.user._id = token._id as string;

                // Add verification status to session
                session.user.isVerified = token.isVerified as boolean;

                // Add message acceptance status to session
                session.user.isAcceptingMsg = token.isAcceptingMsg as boolean;

                // Add username to session
                session.user.username = token.username as string;
            }
            return session;
        },

        // Modify JWT to include additional user information
        async jwt({ token, user }) {
            // If user is available (during initial login), add user details to token
            if (user) {
                // Convert user ID to string
                token._id = user._id?.toString();

                // Add verification status to token
                token.isVerified = user.isVerified;

                // Add message acceptance status to token
                token.isAcceptingMsg = user.isAcceptingMsg;

                // Add username to token
                token.username = user.username;
            }
            return token;
        }
    },

    // Session management strategy
    session: {
        // Use JSON Web Token for session management
        strategy: 'jwt',
    },

    // Secret key for token encryption
    // Pulled from environment variables for security
    secret: process.env.NEXTAUTH_SECRET,
}