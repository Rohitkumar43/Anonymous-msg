'use client';

import { MessageCard } from '@/components/MsgCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User';
import { apiResponse } from '@/types/apiresponses';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {acceptMessageSchema } from '@/Schemas/acceptMessageSchema';

const dashboard = () => {
  // all the states are defined
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
// fxn to delte the msg also this si used for the optimistic UI menas it doesn't del immedatily server fxn after some time 
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  // take the value from the form 
  const {register , watch , setValue} = form

  const acceptMessages = watch('acceptMessages');
  
  // calling all the api where we get all the message 
   const fetchAcceptMessage = useCallback(async() => {
    // start the loading
    try {
      const response = await axios.get('/api/accept-msg')
      // set the value if ant changes
      setValue('acceptMessages' , response.data.isacceptingmsg)

    } catch (error) {
      const AxiosError = error as AxiosError<apiResponse>
      toast({
        title: "Error",
        description: AxiosError.response?.data.message ||
        "Failed to fetch message setting ",
        variant: 'destructive'
      });
      
    } finally {
      setIsSwitchLoading(false);
    }

   } , [setValue])


// for calling the the fetch message of me only 
const fetchMessage = useCallback(async(refresh : boolean = false ) => {
  setIsLoading(true);
  setIsSwitchLoading(false)
  try {
    const response = await axios.get<apiResponse>('/api/get-msg');
    setMessages(response.data.messages || [])
    if(refresh){
      toast({
        title: "Refeshed Message",
        description: 'Showing latest Message '
      })
    }

  } catch (error) {
    const AxiosError = error as AxiosError<apiResponse>
      toast({
        title: "Error",
        description: AxiosError.response?.data.message ||
        "Failed to fetch message setting ",
        variant: 'destructive'
      });
  } finally {
    setIsLoading(false);
    setIsSwitchLoading(false);
  }
} , [setValue , setIsLoading , setMessages])

//
useEffect(() => {
  // check the session forst 
  if (!session || !session.user) {
    return 
    fetchMessage()
    fetchAcceptMessage()
    
  }

}, [session , setValue , fetchAcceptMessage , fetchMessage])











  return (
    <div>
      dashboard
    </div>
  )
}

export default dashboard
