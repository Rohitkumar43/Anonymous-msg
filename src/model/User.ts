import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document  {
    content: string,
    createdAt: Date
}

const messageSchema :  Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});
// interface for the user means the type of the ope we used in the var ....
export interface User extends Document  {
    username: string,
    email: string,
    password: string,
    verifycode: string,
    verifycodeexpirary: string,
    isverified: boolean,
    isacceptingmsg: boolean,
    messages: [Message]
}
// schema for the user
const UserSchema :  Schema<User> = new Schema({
    username: {
        type: String,
        required: [true , 'Username is required'],
        trim: true,
        unique: true

    },
    email: {
        type: String,
        required: [true , "email is required "],
        unique: true,
        match: [/^\S+@\S+\.\S+$/ , "please provide a valid email "]
    },
    password: {
        type: String,
        required: [true , "password is required"],
        unique: true
    },
    verifycode: {
        type: String,
        required: true,
    },
    verifycodeexpirary: {
        type: String,
        required: [true , "verify code expirary is required "]
    },
    isverified: {
        type: Boolean,
        required: false
    },
    isacceptingmsg: {
        type: Boolean,
        required: true
    },
    messages: [messageSchema]
});
// here we export the model and for the type safety we have to define the schema this is the typescript wali bimari
const Usermodel = (mongoose.models.User as mongoose.Model<User> ) || (mongoose.model<User>("User" , UserSchema))

export default Usermodel;