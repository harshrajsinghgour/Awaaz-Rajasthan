"use client";

import React from "react";

import {
  Home,
  Newspaper,
  MapPin,
  Tv,
  Menu
} from "lucide-react";

import { useRouter } from "next/router";

const navigation = [
  {
    title: "होम",
    href: "/",
    icon: Home
  },
  {
    title: "खबरें",
    href: "/news",
    icon: Newspaper
  },
  {
    title: "जिले",
    href: "/districts",
    icon: MapPin
  },
  {
    title: "लाइव",
    href: "/live",
    icon: Tv
  },
  {
    title: "अधिक",
    href: "/more",
    icon: Menu
  }
];

export default function BottomNav() {

  const router = useRouter();

  return (

    <>

      {/* Spacer */}

      <div className="h-[78px] md:hidden" />


      {/* Navigation */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">

        <div className="mx-auto max-w-[768px]">

          <div className="bg-white/95 dark:bg-[#0d1c31]/95 backdrop-blur-xl border-t border-gray-200 dark:border-[#23344d] px-2 py-2">

            <div className="grid grid-cols-5 gap-1">

              {navigation.map((item) => {

                const Icon = item.icon;

                const active =
                  router.pathname === item.href;

                return (

                  <button
                    key={item.title}
                    type="button"
                    onClick={() =>
                      router.push(item.href)
                    }
                    className={`relative flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition ${
                      active
                        ? "text-[#D71920]"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >

                    {active && (

                      <span className="absolute -top-2 w-8 h-1 rounded-full bg-[#D71920]" />

                    )}


                    <Icon
                      size={21}
                      strokeWidth={active ? 2.8 : 2}
                    />


                    <span
                      className={`text-[10px] ${
                        active
                          ? "font-extrabold"
                          : "font-medium"
                      }`}
                    >
                      {item.title}
                    </span>

                  </button>

                );

              })}

            </div>

          </div>

        </div>

      </nav>

    </>

  );
}
