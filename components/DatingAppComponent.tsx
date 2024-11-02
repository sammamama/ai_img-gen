"use client"

import { MenuSquareIcon, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import TinderCard from "./TinderCard";

const DatingAppComponent = () => {
  const [cards, setCards] = useState(cardData);
  return (
    <div className="flex flex-col  overflow-hidden p-6 bg-neutral-300 z-10 select-none">
      <div className="flex justify-between  py-3">
        <MenuSquareIcon strokeWidth={1} size={30} />
        <div className="text-lg">Dating app</div>
        <div className="relative">
          <MessageCircle strokeWidth={1} size={30} className="relative" />
          <div className="absolute w-6 h-6 rounded-full text-xs font-thin bottom-2 left-4 text-white bg-red-400 grid place-items-center">
            99+
          </div>
        </div>
      </div>
      <div className="grid">
        {
          cards.map((card) => (
            <TinderCard
              key={card.id}
              {...card}
              
              cards={cards}
              setCards={setCards}
            />
          ))
        }
      </div>
    </div>
  );
};

export default DatingAppComponent;

const cardData = [
  {
    id: 5,
    url: "/sunil2.jpg",
    name: "youngest",
    age: "18",
    location: "2 miles away"
  },
  {
    id: 2,
    url: "/sam2.jpg",
    name: "Mr. steal your girl",
    age: "21",
    location: "2 miles away"
  },
  {
    id: 3,
    url: "/srijan1.jpg",
    name: "Srijan",
    age: "25",
    location: "2 miles away"
  },
  {
    id: 1,
    url: '/sam1.jpg',
    name: "Samridh",
    age: "20",
    location: "2 miles away"
  },
]