"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().min(2, {}),
  password: z.string().min(2, {}),
});

export default function Login() {
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function formSubmit(values: z.infer<typeof loginSchema>) {
    // Log the form values to the console
    console.log(values);
    
    // Define the endpoint URL
    const endpoint = "/auth/sign-in";
    try {
      // Send a POST request to the endpoint with the form values
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      debugger;
      // Check if the response is successful
      if (!response.ok) {

        return toast({
          variant: 'destructive',
          description: "Could not login",
        });
      }

      window.location.href = "/doctors"
      // You can handle the successful response here (e.g., show a success message)
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error',
      });

      // Handle any errors here (e.g., show an error message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-8">
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@email.com" {...field} />
                        </FormControl>
                        <FormDescription>Email</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="password" {...field} />
                        </FormControl>
                        <FormDescription>Password</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
           
          </div>
        </div>
      </form>
    </Form>
  );
}
