"use client";

import React from "react";

import {
  Clock,
  MapPin
} from "lucide-react";

export default function NewsCard({
  title,
  image,
  district = "राजस्थान",
  time = "कुछ देर पहले",
  category = "राजस्थान",
  featured = false
}) {

  if (featured) {

    return (

      <article className="mx-3 sm:mx-4 rounded-2xl overflow-hidden bg-black relative min-h-[285px] shadow-lg">

        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />


        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />


        <div className="absolute top-3 left-3">

          <span className="inline-flex bg-[#D71920] text-white px-3 py-1 rounded-md text-xs font-bold">
            मुख्य खबर
          </span>

        </div>


        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">

          <div className="flex items-center gap-2 mb-2 text-[11px] text-white/80">

            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {district}
            </span>

            <span>•</span>

            <span>{time}</span>

          </div>


          <h3 className="text-xl sm:text-2xl font-extrabold leading-snug line-clamp-3">

            {title}

          </h3>

        </div>

      </article>

    );
  }


  return (

    <article className="news-card flex gap-3 p-3">

      <div className="w-[112px] h-[82px] shrink-0 rounded-xl overflow-hidden">

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

      </div>


      <div className="min-w-0 flex-1">

        <span className="inline-block text-[10px] font-bold text-[#D71920] mb-1">
          {category}
        </span>


        <h3 className="font-bold text-sm leading-5 line-clamp-3">

          {title}

        </h3>


        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 dark:text-gray-400">

          <span className="flex items-center gap-1">

            <MapPin size={11} />

            {district}

          </span>


          <span className="flex items-center gap-1">

            <Clock size={11} />

            {time}

          </span>

        </div>

      </div>

    </article>

  );
            }
