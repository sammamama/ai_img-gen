import Image from "next/image";
import React from "react";

const Examples = () => {

    return (
      <div>
        <div className="text-6xl">Examples</div>
        <div className="relative">
          <div
            className={`flex overflow-x-scroll no-scrollbar  max-w-full group`}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div className="  " key={i}>
                <div className="animate-carousel flex">
                  <ExampleCard url={`/carousel/photo (${++i}).jpg`} />
                  <ExampleCard url={`/carousel/photo (${12-i}).jpg`} />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/90 from-0% to-transparent to-10% h-full w-full" />
        </div>
      </div>
    );
  }

export const ExampleCard = ({ url }: {url: string}) => {
  return (
    <div className="mt-3 p-3">
      <Image
        src={url}
        width={400}
        height={300}
        alt="asdasd"
        className="rounded-xl min-w-80"
      />
    </div>
  );
};

export default Examples;
