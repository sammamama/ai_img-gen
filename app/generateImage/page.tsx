import GenerationInterface from '@/components/GenerationInterface'
import { authConfig } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
// import { getSession } from 'next-auth/react'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await getServerSession(authConfig);

  if(!session?.user?.email) redirect('/');

  const models = await prisma.user.findUnique({
    where: {
      email: session.user?.email
    },
    include: {
      lora: true
    }
  })
  if((models?.lora.length ?? 0) <= 0 || (models === null)) return <div className="">Create a model first</div>


  return (
    <div>
      <GenerationInterface 
        models={models}
      />
    </div>
  )
}

export default page
