"use client";

import React from "react";

import {
  Newspaper,
  Tv,
  Video,
  MapPin,
  Image as ImageIcon,
  Sun,
  Briefcase,
  Megaphone
} from "lucide-react";

const features = [
  {
    title: "ई-पेपर",
    icon: Newspaper,
    href: "/epaper"
  },
  {
    title: "लाइव टीवी",
    icon: Tv,
    href: "/live"
  },
  {
    title: "वीडियो",
    icon: Video,
    href: "/videos"
  },
  {
    title: "जिला समाचार",
    icon: MapPin,
    href: "/districts"
  },
  {
    title: "फोटो गैलरी",
    icon: ImageIcon,
    href: "/photos"
  },
  {
    title: "मौसम",
    icon: Sun,
    href: "/weather"
  },
  {
    title: "रोजगार",
    icon: Briefcase,
    href: "/jobs"
  },
  {
    title: "विज्ञापन दें",
    icon: Megaphone,
    href: "/advertise"
  }
];

export default function QuickFeatures() {

  return (

    <section className="px-3 sm:px-4 py-4">

      <div className="grid grid-cols-4 gap-2 sm:gap-3">

        {features.map((feature) => {

          const Icon = feature.icon;

          return (

            <a
              key={feature.title}
              href={feature.href}
              className="bg-white dark:bg-[#0d1c31] border border-gray-200 dark:border-[#23344d] rounded-xl py-3 px-1 flex flex-col items-center justify-center gap-2 min-h-[78px] shadow-sm active:scale-[0.97] transition"
            >

              <div className="w-9 h-9 rounded-full bg-[#fff1f1] dark:bg-[#35161a] flex items-center justify-center">

                <Icon
                  size={19}
                  strokeWidth={2}
                  className="text-[#D71920]"
                />

              </div>

              <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">
                {feature.title}
              </span>

            </a>

          );
        })}

      </div>

    </section>
  );
}
