import React, { useEffect, useState, useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import Link from "next/link";

const About = () => {
  const splideRef = useRef(null);

  const handlePrevClick = () => {
    if (splideRef.current) {
      splideRef.current.go("-1");
    }
  };

  const handleNextClick = () => {
    if (splideRef.current) {
      splideRef.current.go("+1");
    }
  };

  return (
    <>
      <section className="about-sec">
        <div className="container-about">
          <div className="about-inner">
            <div className="grid">
              <div className="xl-6 lg-6 md-12 sm-12 relative">
                <Splide
                  ref={splideRef}
                  options={{ type: "fade", pagination: false, arrows: false, rewind: true }}
                >
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/DSC_6905 Clean-min.jpg"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider2.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider3.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider4.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider5.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider6.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider7.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider8.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider9.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider10.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider11.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                  <SplideSlide>
                    <div className="image-sec">
                      <img
                        src={"./assets/images/client/about_slider12.JPG"}
                        alt="Unit Image"
                        className="slider-image"
                      />
                    </div>
                  </SplideSlide>
                </Splide>
                <div className="flex flex-col sm:flex-row sm:justify-end mt-1">
                  <div className="arrow-group space-x-6">
                    <span
                      className="arrow"
                      onClick={handlePrevClick}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-solid fa-angle-left"></i>
                    </span>
                    <span
                      className="arrow"
                      onClick={handleNextClick}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-solid fa-angle-right"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="xl-6 lg-6 md-12 sm-12">
                <div className="about-desc">
                  <h3>About Us</h3>
                  <p>
                    At AWC, We're At The Forefront Of Innovation in
                    Waterproofing Solutions. Our Cutting- Edge Products Offer
                    Reliable Protection Against Leaks For A Wide Range Of
                    Surfaces. We Take Pride In Our Ability To Create And Adapt
                    Our Solutions To Meet Diverse Client Needs. Whether it's
                    Roof Waterproofing, Terrace Protection, Or External Wall
                    Sealing, We Lead The Way In Delivering Innovative,
                    Effective, And Long-Lasting Solutions. Our Foundation is
                    Built On Unwavering Values Of Quality, Reliability, And
                    Customer- Centricity. We Take Pride In Our Well-Established
                    Raw Material Policy And Superior Manufacturing Processes,
                    Ensuring That Every Product We Offer Stands As A Testament
                    To Excellence. Our Laser-Sharp Focus On Total Quality
                    Management System Sets Us Apart in The Industry,
                    Guaranteeing The Delivery Of Top-Tier Waterproofing
                    Solutions. With A Dedication To Continuous Improvement And A
                    Track Record Of Successful Projects, We Have Become
                    Synonymous With Trust And Quality In Waterproofing Services.
                  </p>
                  <div className="about-actions">
                    <Link href="/contact">
                      <input
                        className="btn-primary"
                        type="button"
                        value="Discover our Expertise"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="about-inner">
            <div className="about-desc mt-16" style={{ margin: "0px" }}>
              <p style={{ marginTop: "25px" }}>
                Architectural Waterproofing Corporation (AWC) has emerged as one
                of the fastest growing and one of the leading manufacturers of
                innovative chemical waterproofing solutions. AWC is committed to
                create products that can be applied on different varieties of
                concrete and other surfaces with an aim to protect the surface
                against leakages. We aim to become India’s leading waterproofing
                company by plugging the surface cracks and keeping them plugged
                for a sufficiently longer duration of time such that the surface
                requires minimum maintenance and enjoys extended life. Our
                world-class manufacturing capabilities help us meet any specific
                client demands with ease. Our team consists of qualified &
                expert personnel who are eager to find a long lasting solution
                to our client’s problems by using developing top-quality
                waterproofing products in India.
              </p>{" "}
              <p style={{ marginTop: "25px" }}>
                Our well-established raw material policy and superior
                manufacturing processes ensure that our product quality
                consistently remains the best among all chemical waterproofing
                manufacturers. We regularly benchmark our human resource,
                technologies and business practices with the best in the world
                so that our clients always experience the best roof leak repair
                products in India. AWC is known for its laser-sharp focus and
                belief in Total Quality Management System thus differentiating
                us from the rest of the waterproofing companies in Mumbai and
                India. Our commitment to continuous improvements helps us to
                create innovative products, improvise our business processes and
                make our manufacturing practices efficient. This has made us one
                of the leading roof waterproofing, terrace waterproofing and
                external wall waterproofing company in India. Our processes are
                highly flexible to accommodate your one-off or bulk requirements
                with ease. Do write to us or leave your coordinates so that our
                team can reach out to you and introduce you to our waterproofing
                solutions for roofs.
              </p>
              <p>
                AWC has earned the reputation of being the fastest-growing and
                one of the most reliable waterproofing companies in Mumbai in a
                very short span of time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
