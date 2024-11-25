import {z} from 'zod';

export const acceptMessageSchema =z.object({
    acceptedmessage: z.boolean()
                              
})