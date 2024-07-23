import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";

const Question = () => {
  const faqData = [
    {
      question:
        "What types of surfaces can AWC waterproofing solutions be applied to?",
      answer:
        "AWC waterproofing solutions are versatile and can be applied to a wide range of surfaces, including concrete, roofs, terraces, walls, and more.",
    },
    {
      question: "How long does the waterproofing solution last?",
      answer:
        "AWC waterproofing solutions are versatile and can be applied to a wide range of surfaces, including concrete, roofs, terraces, walls, and more.",
    },
    {
      question: "Are Your Products Environmentally Friendly?",
      answer:
        "AWC waterproofing solutions are versatile and can be applied to a wide range of surfaces, including concrete, roofs, terraces, walls, and more.",
    },
    {
      question:
        "Can Your Waterproofing Solutions Be Applied In Extreme Weather Conditions?",
      answer:
        "AWC waterproofing solutions are versatile and can be applied to a wide range of surfaces, including concrete, roofs, terraces, walls, and more.",
    },
    {
      question: "What Distinguishes AWC From Other Waterproofing Companies?",
      answer:
        "AWC waterproofing solutions are versatile and can be applied to a wide range of surfaces, including concrete, roofs, terraces, walls, and more.",
    },
    {
      question: "How Do I Get A Quote Or Estimate For A Specific Project?",
      answer:
        "AWC waterproofing solutions are versatile and can be applied to a wide range of surfaces, including concrete, roofs, terraces, walls, and more.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const handleQuestionClick = (index) => {
    setOpenIndex((prevOpenIndex) => (prevOpenIndex === index ? null : index));
  };

  useEffect(() => {
    const questions = $(".accordion_body");

    questions.each(function (index) {
      if (index === openIndex) {
        $(this).slideDown();
      } else {
        $(this).slideUp();
      }
    });
  }, [openIndex]);

  return (
    <>
      <section className="faqs-sec">
        <div className="container">
          <div className="faqs-inner">
            <h2>Commonly Asked Questions</h2>
            {faqData.map((faq, index) => (
              <div key={index} className="accordion_content">
                <h3
                  className="accordion_head"
                  onClick={() => handleQuestionClick(index)}
                >
                  {faq.question}
                  <img
                    className="plusminus"
                    src={
                      openIndex === index
                        ? "/assets/images/client/minus-arrow.png"
                        : "/assets/images/client/plus-arrow.png"
                    }
                    alt={openIndex === index ? "Minus Icon" : "Plus Icon"}
                  />
                </h3>
                <div
                  className={`accordion_body ${
                    openIndex === index ? "show" : "hide"
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Question;
