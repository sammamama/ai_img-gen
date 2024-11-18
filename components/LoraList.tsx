"use client";

import React, { useEffect, useState } from "react";
import { getLoraHandler } from "@/actions/models";
import { loraType } from "@/actions/models/type";
import { useRouter } from "next/navigation";

const LoraList = () => {
  const [loras, setLoras] = useState<loraType[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  
  useEffect(() => {
    const fetchLora = async () => {
      try {
        const fetchedLora = await getLoraHandler();

        setLoras(fetchedLora);

        setLoading(false);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(`Failed to fetch lora: ${e.message}`);
        } else {
          console.log(`Failed to fetch lora: An unknown error occurred`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLora();
  }, []);

  if (loading) return <div className="">Loading...</div>;

  const handleClick = async (lora: loraType) => {
    router.push(`customModels/${lora.id}`)
  };

  return (
    <div>
      <div className="font-bold py-4 text-4xl">Custom Models</div>
      <div className="flex flex-wrap">
        {loras.map((lora, i: number) => (
          <div
            key={i}
            className="w-[300px] h-[300px] rounded-xl bg-neutral-500 cursor-pointer"
            onClick={() => handleClick(lora)}
          >
            <div className="h-[70%] flex justify-center items-center font-extrabold text-neutral-600 bg-neutral-300 rounded-t-xl">
              {lora.lora_name.toUpperCase()}
            </div>
            <div className="p-3 text-neutral-800">
              <div className="font-bold">{lora.lora_name}</div>
              <div className="">
                {lora.lora_creation_time.toISOString().slice(0, 10)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoraList;
