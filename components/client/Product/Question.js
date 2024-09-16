import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";

const Question = () => {
  const faqData = [
    {
      question:
        "What types of surfaces can AWC waterproofing solutions be applied to?",
      answer:
        "AWC waterproofing solutions are versatile and can be applied to a wide range of surfaces, including concrete, roofs, terraces, walls, and more.",
    },
    {
      question: "Are Your Products Environmentally Friendly?",
      answer:
        "AWC India takes environmental impact seriously, And tries it's Best to deliver the best quality in the market while making it environment friendly.",
    },
    {
      question: "What Distinguishes AWC From Other Waterproofing Companies?",
      answer:
        "Patented Technology, Laser-Sharp focuses on Quality, Versatile Solutions, and Innovative Approaches.",
    },
    {
      question:
        "How long does the waterproofing solution last?",
      answer:
        "We offer three types of waterproofing solutions for the terrace & two External Wall Waterproofing solutions, addressing various needs. These options range from a Three to Five year solution to a more permanent, once-in-a-lifetime choice.",
    },
    {
      question: "How Do I Get A Quote Or Estimate For A Specific Project?",
      answer:
        "Through Contacting us By clicking on the Contact Us tab or Click on the Floating WhatsApp Icon.",
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
                  className={`accordion_body ${openIndex === index ? "show" : "hide"
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
