import React, { useState } from "react";
import "@fontsource/poppins";
import "@fontsource/montserrat";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Theme tokens — change everything here
  const theme = {
    bg: darkMode ? "bg-[#0f1a14]" : "bg-[#e8f3ec]",
    text: darkMode ? "text-[#e6f3ec]" : "text-[#1c2b22]",
    cardBg: darkMode ? "bg-[#16241d]" : "bg-white",
    cardText: darkMode ? "text-[#e6f3ec]" : "text-[#1c2b22]",
    cardBorder: darkMode ? "border border-[#2e7d3240]" : "border border-[#2e7d3220]",
    footerText: darkMode ? "text-[#a5c8ad]" : "text-[#4a6652]",
  };

  return (
    <div
      className={`${theme.bg} ${theme.text} min-h-screen transition-all duration-300 font-['Poppins'] overflow-x-hidden`}
    >
      {/* Scroll Indicator */}
      <div className="fixed top-0 left-0 h-[4px] bg-[#2e7d32] w-0 z-50"></div>

      {/* Hero Section */}
      <section
        className="relative text-white text-center py-[100px] px-[10px] rounded-[40px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('https://uploads.onecompiler.io/44duvvcub/44duvnmsb/neem.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="font-['Montserrat'] text-[56px] tracking-[3px]">
          NEEM TREE
        </h1>
        <p className="text-[20px] mt-[15px]">
          The Village Pharmacy Tree
        </p>
      </section>

      {/* Topbar */}
      <div className="flex justify-center items-center gap-[20px] py-[20px] px-[30px]">
        <button className="px-[18px] py-[10px] rounded-[30px] bg-[#2e7d32] text-white font-semibold shadow-md hover:-translate-y-1 transition">
          🔊 Listen Neem
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-[18px] py-[10px] rounded-[30px] bg-[#2e7d32] text-white font-semibold shadow-md transition"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Sections */}
      <div className="my-[60px] mx-[20px] space-y-[20px]">

        {[
          {
            title: "🌳 Core Identity",
            content: `Common Name: Neem
Scientific Name: Azadirachta indica
Family: Meliaceae
Order: Sapindales
Type: Evergreen medicinal tree
Origin: Indian subcontinent
Other Names: Nimba, Margosa, Indian Lilac`
          },
          {
            title: "🧬 Full Botanical Classification",
            content: `Kingdom — Plantae
Clade — Angiosperms
Clade — Eudicots
Order — Sapindales
Family — Meliaceae
Genus — Azadirachta
Species — indica`
          },
          {
            title: "🔍 Field Identification Guide",
            content: `Tall evergreen tree with wide crown
Serrated leaflets
White fragrant flowers
Green → yellow fruits
Dark cracked bark
Strong medicinal smell`
          },
          {
            title: "📏 Morphology",
            content: `Leaves: Compound pinnate (20–40 cm)
Flowers: White, fragrant
Fruits: Oval drupe
Bark: Rough and bitter`
          },
          {
            title: "🌍 Habitat & Growth",
            content: `Tropical climate
High heat tolerance
Drought resistant
Long lifespan`
          },
          {
            title: "🧪 Chemical Compounds",
            content: `Azadirachtin, Nimbin, Nimbidin, Nimbolide, Gedunin, Salannin`
          },
          {
            title: "💊 Medicinal Applications",
            content: `Skin infections, acne, wound healing, gum care, antimicrobial extracts`
          },
          {
            title: "🦷 Dental Importance",
            content: `Natural toothbrush (datun), antibacterial effect, plaque reduction`
          },
          {
            title: "🐛 Agricultural Importance",
            content: `Natural pesticide, neem oil spray, soil amendment`
          },
          {
            title: "🧴 Commercial Products",
            content: `Soaps, shampoos, mosquito repellents, toothpaste, herbal medicines`
          },
          {
            title: "🌱 Ecological Benefits",
            content: `Dense shade, biodiversity support, pollution tolerant`
          },
          {
            title: "⚠ Safety Notes",
            content: `Avoid excess use. Pregnancy caution. Use under guidance.`
          },
          {
            title: "🛕 Cultural Importance",
            content: `Sacred in India, used in festivals, Ayurvedic texts mention neem.`
          },
          {
            title: "📚 Neem in Ayurveda",
            content: `Bitter (Tikta rasa), cooling effect, blood purifier.`
          },
          {
            title: "🧠 Student Quick Facts",
            content: `1. Village Pharmacy Tree
2. Every part medicinal
3. Natural pesticide source
4. Highly drought resistant`
          }
        ].map((section, index) => (
          <div key={index}>
            {/* Accordion Header */}
            <div
              onClick={() => toggleAccordion(index)}
              className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] rounded-[16px] font-semibold cursor-pointer flex justify-between items-center shadow-md transition`}
            >
              {section.title}
              <span
                className={`transition-transform duration-300 ${openAccordion === index ? "rotate-90" : ""}`}
              >
                ▶
              </span>
            </div>

            {/* Panel */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: openAccordion === index ? "500px" : "0px",
              }}
            >
              <div className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] mt-[12px] rounded-[14px] leading-[1.7] shadow-md whitespace-pre-line`}>
                {section.content}
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Quiz Section */}
      <div className="my-[60px] mx-[20px]">
        <div className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white p-[20px] rounded-[18px]">
          <b>Quick Quiz</b>
          <br />
          <br />
          Which compound gives neem insecticidal property?
          <br />
          <button className="mt-[10px] mr-[10px] px-[16px] py-[8px] rounded-[12px] bg-white text-black">
            Azadirachtin
          </button>
          <button className="mt-[10px] px-[16px] py-[8px] rounded-[12px] bg-white text-black">
            Chlorophyll
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className={`text-center py-[40px] ${theme.footerText}`}>
        Designed & Developed by{" "}
        <span className="text-[#2e7d32] font-semibold">
          Jay Shinde
        </span>
      </footer>
    </div>
  );
};

export default Navbar;