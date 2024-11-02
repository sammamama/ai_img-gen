"use client";

import Image from "next/image";
import React from "react";
import { Heart, MapPin, Plus } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { toast, Toaster } from "sonner";

type TinderCardType = {
  id: number;
  url: string;
  name: string;
  age: string;
  location: string;
  cards: Array<{
    id: number;
    url: string;
    name: string;
    age: string;
    location: string;
  }>;
  setCards: React.Dispatch<React.SetStateAction<TinderCardType["cards"]>>;
};

const TinderCard = ({
  id,
  url,
  name,
  age,
  location,
  cards,
  setCards,
}: TinderCardType) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 100], [0.8, 1, 0]);
  const rotate = useTransform(x, [0, 150], [0, 20]);
  const translateX = useTransform(x, [0, 150], [0, 200]);

  const handleRightSwipe = () => {
    if (x.get() > 70 && cards.length > 1) {
      setCards((pv) => pv.filter((v) => v.id !== id));
    }
    if (x.get() < -70) {
      toast.error("No more left swipes");
    }
  };

  return (
    <div style={{ gridRow: 1, gridColumn: 1 }}>
      <motion.div
        className="rounded-xl bg-neutral-400 pb-5 z-10 hover:cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleRightSwipe}
        style={{ x, opacity, rotate, translateX }}
      >
        {cards.length > 1 ? (
          <Image
            src={url}
            width={300}
            height={300}
            alt="Image"
            className="w-[22rem] h-96 object-cover"
            draggable={"false"}
          />
        ) : (
          <motion.div className="w-[22rem] h-96 bg-neutral-200 flex items-center justify-center">
            <span className="text-gray-500">Refresh to swipe again</span>
          </motion.div>
        )}
        <div className="py-1 pt-2 p-3">
          <div className="font-medium text-xl">
            {name}, {age}
          </div>
          <div className="font-light text-sm flex items-center">
            <MapPin className="mr-1" size={20} strokeWidth={1} />
            {location}
          </div>
          <div className=" mt-3 w-full flex justify-around">
            <Plus
              size={50}
              style={{ rotate: "45deg" }}
              className=" text-red-600 rounded-full p-1 bg-neutral-200 shadow-md"
            />
            <div className="font-light w-full grid place-items-center bg-pink-500 mx-3 text-neutral-200 rounded-full mt-2 text-lg">
              share profile
            </div>
            <Heart
              size={50}
              className="text-green-700 rounded-full p-2 bg-neutral-200 shadow-md"
            />
          </div>
        </div>
      </motion.div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default TinderCard;
