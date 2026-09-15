"use client";

import React from "react";
import {
  Search,
  Menu,
  MapPin,
  Bell,
  X
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Header() {
  const {
    searchOpen,
    setSearchOpen
  } = useApp();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0d1c31] border-b border-gray-200 dark:border-[#23344d]">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <div className="px-4 py-3">

          <div className="flex items-center justify-between gap-3">

            {/* LOGO */}

            <a
              href="/"
              className="flex items-center min-w-0"
            >

              <img
                src="/logo.png"
                alt="आवाज राजस्थान"
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />

              <div className="ml-2 min-w-0">

                <h1 className="text-[20px] leading-6 font-extrabold tracking-tight">

                  <span className="text-[#071A36] dark:text-white">
                    आवाज
                  </span>

                  <span className="text-[#D71920] ml-1">
                    राजस्थान
                  </span>

                </h1>

                <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  आपकी आवाज, आपका राजस्थान
                </p>

              </div>

            </a>


            {/* RIGHT ACTIONS */}

            <div className="flex items-center gap-2 shrink-0">

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="खोजें"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#172943] flex items-center justify-center active:scale-95"
              >

                <Search
                  size={21}
                  strokeWidth={2.3}
                />

              </button>


              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="मेनू"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#172943] flex items-center justify-center active:scale-95"
              >

                <Menu
                  size={22}
                  strokeWidth={2.3}
                />

              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            LOCATION / NEWS STRIP
        ================================================= */}

        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">

          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#fff1f1] dark:bg-[#35161a] text-[#D71920] px-3 py-1.5 text-xs font-semibold">

            <MapPin size={14} />

            <span>राजस्थान</span>

          </div>


          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f4f6f8] dark:bg-[#172943] px-3 py-1.5 text-xs font-medium">

            <Bell size={14} />

            <span>ताज़ा खबरें</span>

          </div>

        </div>

      </header>


      {/* ===================================================
          SEARCH OVERLAY
      =================================================== */}

      {searchOpen && (

        <div className="fixed inset-0 z-[100] bg-black/50">

          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-[#0d1c31] rounded-b-3xl p-4 shadow-xl">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#172943] flex items-center justify-center"
              >

                <X size={20} />

              </button>


              <div className="flex-1 relative">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  autoFocus
                  type="search"
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(event.target.value)
                  }
                  placeholder="खबर, जिला या विषय खोजें..."
                  className="w-full h-11 rounded-full border border-gray-200 dark:border-[#30435d] bg-gray-50 dark:bg-[#172943] pl-10 pr-4 outline-none text-sm"
                />

              </div>

            </div>


            <div className="mt-5">

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                लोकप्रिय खोज
              </p>

              <div className="flex flex-wrap gap-2">

                {[
                  "जयपुर",
                  "राजस्थान",
                  "सरकार",
                  "अपराध",
                  "मौसम",
                  "नौकरी"
                ].map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setSearchValue(item)
                    }
                    className="px-3 py-2 rounded-full bg-gray-100 dark:bg-[#172943] text-sm"
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          SIDE MENU
      =================================================== */}

      {menuOpen && (

        <div className="fixed inset-0 z-[110]">

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />


          <aside className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-white dark:bg-[#0d1c31] shadow-2xl overflow-y-auto">

            <div className="p-4 border-b border-gray-200 dark:border-[#23344d]">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <img
                    src="/logo.png"
                    alt="आवाज राजस्थान"
                    className="w-12 h-12 rounded-full"
                  />

                  <div>

                    <h2 className="font-extrabold text-lg">
                      आवाज राजस्थान
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      आपकी आवाज, आपका राजस्थान
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#172943] flex items-center justify-center"
                >
                  <X size={19} />
                </button>

              </div>

            </div>


            <nav className="p-3">

              {[
                ["⌂", "होम", "/"],
                ["▤", "ताज़ा खबरें", "/news"],
                ["⌖", "सभी जिले", "/districts"],
                ["◉", "राजनीति", "/category/politics"],
                ["⚖", "अपराध", "/category/crime"],
                ["⚙", "सरकार", "/category/government"],
                ["▣", "व्यापार", "/category/business"],
                ["▶", "लाइव टीवी", "/live"],
                ["▤", "ई-पेपर", "/epaper"],
                ["▣", "वीडियो", "/videos"],
                ["☀", "मौसम", "/weather"],
                ["💼", "रोजगार", "/jobs"],
                ["⚽", "खेल", "/sports"],
                ["❤", "स्वास्थ्य", "/health"],
                ["🎓", "शिक्षा", "/education"]
              ].map(([icon, title, href]) => (

                <a
                  key={title}
                  href={href}
                  className="flex items-center justify-between px-3 py-3.5 border-b border-gray-100 dark:border-[#1d3049] active:bg-gray-100 dark:active:bg-[#172943]"
                >

                  <div className="flex items-center gap-3">

                    <span className="w-8 text-center text-lg">
                      {icon}
                    </span>

                    <span className="font-medium text-sm">
                      {title}
                    </span>

                  </div>

                  <span className="text-gray-400">
                    ›
                  </span>

                </a>

              ))}

            </nav>

          </aside>

        </div>

      )}

    </>
  );
    }
