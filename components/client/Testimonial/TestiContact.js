import React, { useEffect, useState } from "react";
import axios from "axios";

const TestiContact = () => {
  const [loading, setLoading] = useState(true);
  const [testimonial, setTestimonial] = useState([]);
  const [Videotestimonial, setVideoTestimonial] = useState([]);

  const getTestimonial = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/testimonials/alltestimonials/router`
      );
      console.log(response.data);
      setTestimonial(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getVideoTestimonial = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/videotestimonials/alltestimonials/router`
      );
      console.log(response.data);
      setVideoTestimonial(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getTestimonial();
    await getVideoTestimonial();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <img
          key={`star-${i}`}
          src="/assets/images/client/rating-icon.png"
          alt="Rating Icon"
          width="12"
          height="auto"
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <img
          key="half-star"
          src="/assets/images/client/half-rating-icon.png" // Replace with your half-star image
          alt="Half Rating Icon"
          width="12"
          height="auto"
        />
      );
    }

    return stars;
  };
  const extractVideoId = (url) => {
    try {
      const urlObject = new URL(url);
      let videoId = "";

      if (
        urlObject.hostname === "www.youtube.com" ||
        urlObject.hostname === "youtube.com"
      ) {
        // Full YouTube URL with "v" parameter
        const urlParams = new URLSearchParams(urlObject.search);
        videoId = urlParams.get("v");
      } else if (urlObject.hostname === "youtu.be") {
        // Short YouTube URL
        videoId = urlObject.pathname.substring(1); // Exclude the leading slash
      }

      return videoId || "";
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return "";
    }
  };

  return (
    <>
      {loading ? (
        <div className="main_testi_contact">
          <div role="status" className="w-full animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
          </div>
          <div role="status" className="w-full animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      ) : (
        <div className="main_testi_contact">
          <div className="main_testi_contact_inner">
            <div className={testimonial.length ? "testimonials-contents" : ""}>
              {testimonial.map((item, idx) => {
                return (
                  <div className="testi_shadow" key={item.id}>
                    <img
                      className=""
                      src={"./assets/images/client/quotes-img.png"}
                      alt="Double Quotes Image"
                      width="22"
                      height="auto"
                    />
                    <p
                      className="contact_desc mt-4"
                      dangerouslySetInnerHTML={{
                        __html: item?.testimonial_desc,
                      }}
                    ></p>
                    <div className="testi_contact_review mt-4">
                      <div className="testi_contact_title">
                        <h4>{item?.testimonial_title}</h4>
                        <div className="testi_rating">
                          {renderStars(item?.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={testimonial.length ? "video_testimonial" : ""}>
              {Videotestimonial.map((item, idx) => {
                console.log(item);
                return (
                  <div>
                    <iframe
                      width="380px"
                      height="315"
                      src={item?.link}
                      allowFullScreen
                    ></iframe>
                    <p className="testi_video_title mb-3">{item?.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestiContact;
