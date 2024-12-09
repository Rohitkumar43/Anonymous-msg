import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { dbconnect } from "@/lib/dbconnect"; // to check the user in the db
import Usermodel from "@/model/User";
import Email from "next-auth/providers/email";
import { use } from "react";

export const authOption: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "ceredential",
            name: "ceredetials",
            // formm where it diawplay the fxn basically html aggreagated 
            credentials: {
                email: { label: "Email", type: "text ", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any):  Promise<any> {
                await dbconnect;
                try {
                    const user = await Usermodel.findOne({
                        $or: [
                          { email: credentials.identifier },
                          { username: credentials.identifier },
                        ],
                      });
                      if (!user) {
                        throw new Error('No user found with this email');
                      }
                      if (!user.isverified) {
                        throw new Error('Please verify your account before logging in');
                      }
                      // check the password is correct or not 
                      const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                      );
                      if (isPasswordCorrect) {
                        return user;
                      } else {
                        throw new Error('Incorrect password');
                      }
                    
                } catch (error) {
                    // it will throw the msg by the himself byu the fraMework 
                    throw new Error("getting an error")
                }

            }
        })
    ],
    pages: {
        signIn: '/sign-in',
        // here we can add the signout but we hVE MAKE A SEPRTATE api for that also all the fxn can be done at a single palce 

    },
    callbacks: {
        async session({ session, token }) {
            return session
          },
        async jwt({ token, user}) {

            // injecting all the data from the user to the token for the security

            if(user){
                token._id = user._id?.toString();
                token.isverified = user.isverified

            }






            return token
        }
    }
}
