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

// all the shadcn imports 
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const page = () => {
 // all the states 
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // for the debouncing 
  const debounced = useDebounceValue(username, 300);
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
      if (debounced) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          // http req sending 
          const response = await axios.get(`api/check-username-validation?username=${debounced}`)
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
    userNameUniqueness();
  },[debounced])

  // to submit the form 
  const onSubmit = async(data : z.infer<typeof userSignupSchema>) => {
    setIsSubmitting(true);
    // take the data send the api request and consol it
    try {
      const response = await axios.post<apiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      route.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);
// errro using the axios 
      const axiosError = error as AxiosError<apiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
