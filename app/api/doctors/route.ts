import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });
  // Get the session data, which includes the user and the access token
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  const authorizationHeader = `Bearer ${accessToken}`;

  try {
    // Parse form data
    const { name, education, background, specialization, description } =
      await request.json();
      const content = `name: ${name} \n education: ${education} \n background: ${background} \n specialization: ${specialization} \n description:${description}`;

    const { data, error, status, statusText } = await supabase
      .from("doctors")
      .insert([{ name, education, background, specialization, description, content }])
      .select()
      .single();

    if (data) {
      // Call the GET endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/embed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationHeader, // Add the token to the Authorization header
          },
          body: JSON.stringify({
            id: data.id,
            combinedString: data.content,
          }),
        }
      );
      if (!response.ok) {
        return NextResponse.json({}, { status: 500 });
      }
    }

    // Check if the request was successful

    // // Insert data into the doctor_profiles table
    // const { data, error } = await supabase
    //   .from("doctors")
    //   .insert([{ name, education, background, specialization, description }]);

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  // Get the session data, which includes the user and the access token

  try {
    const { data, error } = await supabase.from("doctors").select("*");

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  // Get the session data, which includes the user and the access token
  const { doctorId } = await request.json();
  try {
    // Delete the doctor by ID
    const { error: deleteError } = await supabase
      .from("doctors")
      .delete()
      .eq("id", doctorId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    const { data: updatedDoctors, error: fetchError } = await supabase
      .from("doctors")
      .select("*");

    return NextResponse.json({ data: updatedDoctors }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
