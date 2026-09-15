"use client";

import React from "react";
import { ChevronRight, Radio } from "lucide-react";

export default function BreakingNews() {

  const news = [
    "राजस्थान की बड़ी खबरें सबसे पहले पढ़ें",
    "राजस्थान में मौसम को लेकर नया अपडेट",
    "सरकार ने कई महत्वपूर्ण फैसलों की घोषणा की",
    "प्रदेश के कई जिलों में नई योजनाओं का ऐलान"
  ];

  return (
    <section className="bg-white dark:bg-[#0d1c31] border-b border-gray-200 dark:border-[#23344d]">

      <div className="flex items-center h-11 overflow-hidden">

        {/* LABEL */}

        <div className="relative z-10 shrink-0 flex items-center gap-1.5 bg-[#D71920] text-white px-3 h-full font-bold text-xs">

          <Radio size={14} />

          <span>ताज़ा खबर</span>

        </div>


        {/* NEWS */}

        <div className="flex-1 overflow-hidden">

          <div className="flex items-center whitespace-nowrap animate-[ticker_25s_linear_infinite]">

            {news.map((item, index) => (

              <React.Fragment key={index}>

                <span className="px-5 text-xs sm:text-sm">
                  {item}
                </span>

                <span className="text-[#D71920]">
                  •
                </span>

              </React.Fragment>

            ))}

          </div>

        </div>


        <div className="shrink-0 px-2 bg-white dark:bg-[#0d1c31]">

          <ChevronRight
            size={17}
            className="text-[#D71920]"
          />

        </div>

      </div>

    </section>
  );
}
