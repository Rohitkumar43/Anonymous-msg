'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { userSignupSchema } from "@/Schemas/signupSchema"
import axios , {AxiosError} from "axios";
import { apiResponse } from "@/types/apiresponses"



const page = () => {
 // all the states 
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // for the debouncing 
  const debouncedUsername = useDebounceValue(username, 300);
  const {toast} = useToast();
  const route = useRouter();
  // zod impelmtation
  const form = useForm({
    resolver: zodResolver(userSignupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  // check for the DOM and api call for that use useeffect
  useEffect(() => {
    const userNameUniqueness = async() => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          // http req sending 
          const response = await axios.get(`api/check-username-validation?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message);

        } catch (error) {
          const AxiosError = error  as AxiosError<apiResponse>;
          setUsernameMessage(
            AxiosError.response?.data.message ?? 'Error checking in username'
          )
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }


  },[debouncedUsername])

  return (
    <div>
      
    </div>
  )
}

export default page
