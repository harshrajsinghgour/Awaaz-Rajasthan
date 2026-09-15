"use client";

import React from "react";

import Header from "../components/Header";
import BreakingNews from "../components/BreakingNews";
import QuickFeatures from "../components/QuickFeatures";
import SectionTitle from "../components/SectionTitle";
import NewsCard from "../components/NewsCard";
import BottomNav from "../components/BottomNav";

const featuredNews = {
  title:
    "राजस्थान में पर्यटन को मिलेगा नया आयाम, सरकार ने बड़ी योजना की घोषणा की",
  image:
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  district: "जयपुर",
  time: "2 घंटे पहले"
};


const latestNews = [
  {
    title:
      "राजस्थान के 10 जिलों में मानसून की एंट्री, मौसम विभाग का अलर्ट",
    image:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
    district: "राजस्थान",
    time: "3 घंटे पहले",
    category: "मौसम"
  },

  {
    title:
      "जयपुर में नई विकास परियोजनाओं को मिली मंजूरी, शहरवासियों को बड़ी राहत",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c5b9d6?auto=format&fit=crop&w=800&q=80",
    district: "जयपुर",
    time: "4 घंटे पहले",
    category: "विकास"
  },

  {
    title:
      "राज्य सरकार ने युवाओं के लिए रोजगार से जुड़ी नई घोषणा की",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    district: "राजस्थान",
    time: "5 घंटे पहले",
    category: "रोजगार"
  },

  {
    title:
      "राजस्थान के कई शहरों में यातायात व्यवस्था को बेहतर बनाने की तैयारी",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=800&q=80",
    district: "जोधपुर",
    time: "6 घंटे पहले",
    category: "शहर"
  }
];


const popularDistricts = [
  {
    name: "जयपुर",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=500&q=80"
  },

  {
    name: "जोधपुर",
    image:
      "https://images.unsplash.com/photo-1598434192043-71111c1b3c9b?auto=format&fit=crop&w=500&q=80"
  },

  {
    name: "उदयपुर",
    image:
      "https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=500&q=80"
  },

  {
    name: "कोटा",
    image:
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=500&q=80"
  },

  {
    name: "अजमेर",
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=500&q=80"
  },

  {
    name: "बीकानेर",
    image:
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=500&q=80"
  }
];


export default function HomePage() {

  return (

    <div className="app-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header />


      {/* =================================================
          BREAKING NEWS
      ================================================= */}

      <BreakingNews />


      <main className="pb-2">


        {/* =================================================
            MAIN NEWS
        ================================================= */}

        <section className="pt-4">

          <NewsCard
            featured
            title={featuredNews.title}
            image={featuredNews.image}
            district={featuredNews.district}
            time={featuredNews.time}
          />

        </section>


        {/* =================================================
            QUICK FEATURES
        ================================================= */}

        <QuickFeatures />


        {/* =================================================
            RAJASTHAN BIG NEWS
        ================================================= */}

        <section className="mt-2">

          <SectionTitle
            title="राजस्थान की बड़ी खबरें"
            href="/news"
          />


          <div className="px-3 sm:px-4 space-y-2.5">

            {latestNews.slice(0, 3).map((news) => (

              <NewsCard
                key={news.title}
                title={news.title}
                image={news.image}
                district={news.district}
                time={news.time}
                category={news.category}
              />

            ))}

          </div>

        </section>


        {/* =================================================
            POPULAR DISTRICTS
        ================================================= */}

        <section className="mt-7">

          <SectionTitle
            title="लोकप्रिय जिले"
            href="/districts"
          />


          <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">

            {popularDistricts.map((district) => (

              <a
                key={district.name}
                href={`/districts/${encodeURIComponent(
                  district.name
                )}`}
                className="shrink-0 w-[112px]"
              >

                <div className="w-[112px] h-[76px] rounded-xl overflow-hidden">

                  <img
                    src={district.image}
                    alt={district.name}
                    className="w-full h-full object-cover"
                  />

                </div>


                <p className="text-center font-bold text-xs mt-2">
                  {district.name}
                </p>

              </a>

            ))}

          </div>

        </section>


        {/* =================================================
            MORE NEWS
        ================================================= */}

        <section className="mt-7">

          <SectionTitle
            title="और बड़ी खबरें"
            href="/news"
          />


          <div className="px-3 sm:px-4 space-y-2.5">

            {latestNews.slice(3).map((news) => (

              <NewsCard
                key={news.title}
                title={news.title}
                image={news.image}
                district={news.district}
                time={news.time}
                category={news.category}
              />

            ))}

          </div>

        </section>


        {/* =================================================
            BRAND FOOTER
        ================================================= */}

        <footer className="mt-10 bg-[#071A36] text-white px-5 py-8">

          <div className="flex items-center gap-3">

            <img
              src="/logo.png"
              alt="आवाज राजस्थान"
              className="w-14 h-14 rounded-full"
            />

            <div>

              <h3 className="font-extrabold text-lg">
                आवाज राजस्थान
              </h3>

              <p className="text-xs text-white/60">
                आपकी आवाज, आपका राजस्थान
              </p>

            </div>

          </div>


          <p className="text-xs text-white/60 leading-5 mt-5">
            राजस्थान के हर जिले की खबर, आपके मोबाइल पर।
            निष्पक्ष, तेज और भरोसेमंद समाचार के लिए
            आवाज राजस्थान से जुड़े रहें।
          </p>


          <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-white/50 text-center">

            © {new Date().getFullYear()} आवाज राजस्थान
            • सर्वाधिकार सुरक्षित

          </div>

        </footer>

      </main>


      {/* =================================================
          MOBILE BOTTOM NAV
      ================================================= */}

      <BottomNav />

    </div>

  );
}
