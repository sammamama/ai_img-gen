"use client";

import { getImagesByLoraId } from "@/actions/images";
import { getLoraByIdHandler } from "@/actions/models";
import { loraType } from "@/actions/models/type";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CustomModelId = () => {
  const [modelData, setModelData] = useState<loraType | null>();
  const [imageData, setImageData] = useState<{ url: string }[] | null>([]);
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : null;

  useEffect(() => {
    const fetchModelData = async () => {
      const model = await getLoraByIdHandler(id);
      setModelData(model);
    };

    const fetchImages = async () => {
      const images = await getImagesByLoraId(id);
      setImageData(images);
    };

    fetchModelData();
    fetchImages();
  }, [id]);

  return (
    <div className="flex justify-between h-screen items-center">
      <div className="w-[50%] flex flex-col items-center justify-center">
        <div className="text-5xl font-bold">{modelData?.lora_name}</div>
        <div className="text-lg pt-3 font-light">
          <div>
            Date: {modelData?.lora_creation_time.toISOString().slice(0, 10)}
          </div>
          <div>
            Time: {modelData?.lora_creation_time.toISOString().slice(11, 19)}
          </div>
          <div>Requset ID: {modelData?.request_id}</div>
        </div>
      </div>
      <div className="w-[50%] pb-3 h-[100%] flex flex-col justify-center">
        <div className="text-3xl font-bold pb-3">Images Generated:</div>
        <div className="w-[50%] bg-neutral-400 flex items-center justify-center h-[70%]">
          {imageData?.length ? (
            imageData.map((img) => (
              <Image
                key={img.url}
                src={img.url}
                alt="Image"
                width={300}
                height={300}
              />
            ))
          ) : (
            <div className="text-xl text-neutral-700 font-light">
              No images generated
            </div>
          )}
        </div>
        <div 
          className=" w-[50%] flex justify-center items-center text-neutral-300 p-3 hover:cursor-pointer bg-neutral-800"
          // onClick={}
        >
          Create Image with model
        </div>
      </div>
    </div>
  );
};

export default CustomModelId;
