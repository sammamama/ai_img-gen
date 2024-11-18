"use server"

import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getLoraHandler =async () => {
    const session = await getServerSession(authConfig);

    if(!session?.user?.email) redirect('/');

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email 
        }
    });

    const loras = await prisma.lora.findMany({
        where: {
            user_id: user?.id
        }
    })

    return loras;
}

export const getLoraByIdHandler =async (id: string | null) => {
    const session = await getServerSession(authConfig);

    if(!session?.user?.email) redirect('/');

    if(id){
        const lora = await prisma.lora.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        
        return lora;
    }

}