// In a types file or declaration file
import 'next-auth';

declare module 'next-auth' {
  interface User {
    _id?: string,
    username?: string,
    isverified: boolean,
    isacceptingmsg: boolean
    
    // Add other custom properties as needed
  }
}