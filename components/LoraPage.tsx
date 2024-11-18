'use client'

import { useRouter } from 'next/router'
import React from 'react'

const LoraPage = (lora) => {
    const router = useRouter();
    
    router.push(lora.requestId)
    return (
    <div>
      
    </div>
  )
}

export default LoraPage
