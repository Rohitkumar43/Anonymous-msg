// Extend NextAuth default types to include custom user properties
import 'next-auth';
import { DefaultSession } from 'next-auth';

// Declare module to augment existing NextAuth types
declare module 'next-auth' {
  // Extend User interface to include additional properties
  interface User {
    // Optional user ID
    _id?: string;
    // Optional username
    username?: string;
    // User verification status
    isVerified: boolean;
    // Flag to accept/reject messages
    isAcceptingMsg: boolean;
  }

  // Extend Session interface to include custom user properties
  interface Session {
    user: {
      // Optional user ID
      _id?: string;
      // Optional username
      username?: string;
      // User verification status
      isVerified: boolean;
      // Flag to accept/reject messages
      isAcceptingMsg: boolean;
    } & DefaultSession['user']; // Preserve default session user properties
  }

  // Extend JWT interface to include custom properties
  interface JWT {
    // Optional user ID
    _id?: string;
    // Optional username
    username?: string;
    // User verification status (note the lowercase 'v')
    isVerified: boolean;
    // Flag to accept/reject messages
    isAcceptingMsg: boolean;
  }
}

// Optional: Additional type extension for JWT
declare module 'next-auth/jwt' {
  interface JWT {
    // Same properties as in the previous declaration
    _id?: string;
    username?: string;
    isVerified: boolean;
    isAcceptingMsg: boolean;
  }
}