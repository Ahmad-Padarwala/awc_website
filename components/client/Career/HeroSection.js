import axios from "axios";
import React, { useEffect, useState } from "react";

const HeroSection = ({ setJobId, scrollToForm }) => {
  const [loading, setLoading] = useState(true);
  const [careerData, setCareerData] = useState([]);

  const getSEOData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/career/alljobs/router`
      );
      setLoading(false);
      setCareerData(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleApplyNow = (jobId) => {
    setJobId(jobId);
    scrollToForm(); // Scroll to the form when "apply now" is clicked
  };

  const fetchData = async () => {
    await getSEOData();
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <section className="testi_hero_main">
        <div className="containeres">
          <div className="blog-view-sec">
            <div className="container mb-8">
              <p className="career-title">Career Opportunities with AWC</p>
              <p className="career-desc">
                AWC is one of the fastest growing Waterproofing solutions
                companies in Mumbai and the country. For our rapidly expanding
                network and client list, we are always on a look out for smart
                working individuals. Besides offering an excellent work culture,
                AWC promises to build careers of our employees. Do email your
                latest resumes to career@awc.com or fill up the form below. If
                we find your resume and experience relevant, you will hear from
                us!
              </p>
              <div className="btn-sec mt-5">
                <button
                  className="btn-primary learn-btn"
                  style={{ padding: "0px 30px" }}
                  onClick={() => scrollToForm()}
                >
                  apply now
                </button>{" "}
                <button
                  className="btn-primary learn-btn lg:ms-4 md:ms-4 lg:mt-0 md:mt-0 mt-3"
                  style={{ padding: "0px 30px" }}
                  onClick={() => scrollToForm()}
                >
                  email your resume
                </button>
              </div>

              <div className="career_container">
                {loading ? (
                  <>
                    <div
                      role="status"
                      className="flex items-center justify-center h-56 bg-gray-300 rounded-lg animate-pulse"
                    >
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {careerData.map((item, idx) => {
                      return (
                        <div className="career_card mt-10" key={item.id}>
                          <div className="career_card_right_sec">
                            <p className="card_heading">{item.role_name}</p>
                            <p className="card_desc">{item.job_desc}</p>
                            <div className="md:flex sm:flex mt-3">
                              <p className="card_right_btn">{item.category}</p>
                              <p className="card_right_btn md:ms-10 sm:ms-10n ms-0">
                                {item.nop} Opening | {item.duration}
                              </p>
                            </div>
                          </div>
                          <div className="career_card_left_sec">
                            <button
                              className="btn-primary learn-btn "
                              style={{ padding: "0px 30px" }}
                              onClick={() => handleApplyNow(item.id)}
                            >
                              apply now
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
