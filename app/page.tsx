import React from "react";
import LandingPage from "@/components/LandingPage";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerSession(authConfig);

  if(session){
    redirect('/generateImage')
  }

  return(
    <>
      <LandingPage />
    </>
  )
}

export default Home;
