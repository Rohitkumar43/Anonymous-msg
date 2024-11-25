
import { Message } from "@/model/User";


// api response type 
export interface apiResponse {
    success: boolean,
    message: string,
    isAcceptingmessage?: boolean,
    messages: Array<Message>,
}