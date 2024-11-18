"use server"

import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const getImagesByLoraId = async (id: number | null) => {
  headers();

  const session = await getServerSession(authConfig);

  if (!session?.user?.email) redirect("/");
  
  const images = await prisma.image.findMany({
    where: {
      lora_id: id||-1,
      user: {
        email: session.user?.email,
      },
    },
    take: 7,
    select: {
      url: true,
    },
  });

  return images;
};

export const getImagesByUserId = async(id: number) => {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) redirect("/");

  return await prisma.image.findMany({
    where: {
      user_id: id,
      user: {
        email: session.user.email
      }
    },
    orderBy: {
      created_at: "desc"
    },
    // take: 7,
    select: {
      url: true
    }
  });
}

export const generateImage = async  () => {
  try{
    const result = await fetch('/api/fal/generateImage',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          loraId: "https://storage.googleapis.com/fal-flux-lora/3722696153fa4f6fa9c82707d3dc7b66_lora.safetensors"
        }),
      }
    );

    return result;
  } catch (err){
    return new NextResponse(`Unexpected Error ${err}`, {status: 400})
  }


}