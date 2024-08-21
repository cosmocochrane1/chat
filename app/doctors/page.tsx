"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Trash } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast, useToast } from "@/components/ui/use-toast";

export default function DoctorsPage() {
  const { toast } = useToast()

  // TODO: request documents from supabase
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    const endpoint = "/api/doctors";
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      const { data } = await response.json();
      setDoctors(data as []);
    } catch (error) {
      console.error("Error creating doctor profile:", error);
    }
  }

  const deleteDoctor = async (doctorId: string) => {
    const endpoint = "/api/doctors";
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorId }),
      });
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      toast({
        variant: "default",
        description: "Successfully deleted doctor",
      });
      const { data } = await response.json();
      setDoctors(data as []);
    } catch (error) {
      console.error("Error creating doctor profile:", error);
    }
  };

  return (
    <div className={" ml-8 mt-4 w-[50%]"}>
      <Table >
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map(
            ({ name, description, education, specialization, id }) => {
              return (
                <>
                  <TableRow>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>{description}</TableCell>
                    <TableCell>{education}</TableCell>
                    <TableCell
                      className="text-right cursor-pointer"
                      onClick={() => deleteDoctor(id)}
                    >
                      <Trash className="pointer-cursor w-[15px]" />
                    </TableCell>
                  </TableRow>
                </>
              );
            }
          )}
        </TableBody>
      </Table>
    </div>
  );
}
