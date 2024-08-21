"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
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

const doctorSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  education: z.string().min(2, {
    message: "education must be at least 2 characters.",
  }),

  specialization: z.string().min(2, {
    message: "specialization must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "description must be at least 2 characters.",
  }),
});

export default function DoctorsPage() {
  // TODO: request documents from supabase
  const doctors: any[] = [];

  const form = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      education: "",
      specialization: "",
      description: "",
    },
  });

  async function formSubmit(values: z.infer<typeof doctorSchema>) {
    // Log the form values to the console
    // Define the endpoint URL
    const endpoint = "/api/doctors";
    try {
      // Send a POST request to the endpoint with the form values
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      // Parse the response data
      const data = await response.json();
      console.log("Doctor profile created successfully:", data);

      // You can handle the successful response here (e.g., show a success message)
    } catch (error) {
      console.error("Error creating doctor profile:", error);
      // Handle any errors here (e.g., show an error message)
    }
  }

  return (
    <div className={"max-w-[500px] ml-8 mt-4 w-full"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
