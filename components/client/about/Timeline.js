import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import $ from "jquery";

const Timeline = () => {
  useEffect(() => {
    $(".step").click(function () {
      $(this).addClass("active").prevAll().addClass("active");
      $(this).nextAll().removeClass("active");
    });

    $(".step01").click(function () {
      $("#line-progress").css("width", "3%");
      $(".discovery").addClass("active").siblings().removeClass("active");
    });

    $(".step02").click(function () {
      $("#line-progress").css("width", "25%");
      $(".strategy").addClass("active").siblings().removeClass("active");
    });

    $(".step03").click(function () {
      $("#line-progress").css("width", "50%");
      $(".creative").addClass("active").siblings().removeClass("active");
    });

    $(".step04").click(function () {
      $("#line-progress").css("width", "75%");
      $(".production").addClass("active").siblings().removeClass("active");
    });

    $(".step05").click(function () {
      $("#line-progress").css("width", "100%");
      $(".analysis").addClass("active").siblings().removeClass("active");
    });
  }, []);

  return (
    <>
      <section className="timeline-sec">
        <div className="container-timeline">
          <div className="timeline-inner">
            <h5>Our Core Values</h5>
            <p>
              our Mission is to be Leading Proactive Company by servicing our
              customers with Quality Waterproofing Solutions through constant
              growth in
            </p>
            <div className="grid mt-14">
              <div className="xl-3 lg-3 md-6 sm-6">
                <div className="timeline-content">
                  <h6>KNOWLEDGE</h6>
                  <img src={"/assets/images/client/Line.svg"} />
                  <p>
                    we Started in 2008 with small application company now in
                    2015 we have 2 unit & have developed ourselves as an pure
                    manufacturing company in the field of specialized,
                    sustainable coating company Thats we call a constant
                    knowledge up gradation
                  </p>
                </div>
              </div>
              <div className="xl-3 lg-3 md-6 sm-6">
                <div className="timeline-content">
                  <h6>SKILL</h6>
                  <img src={"/assets/images/client/Line.svg"} />
                  <p>
                    We specialize in safeguarding your home with expert roofing
                    solutions. From installations to repairs, trust us for a
                    secure and enduring roof.
                  </p>
                </div>
              </div>
              <div className="xl-3 lg-3 md-6 sm-6">
                <div className="timeline-content">
                  <h6>TRAINING</h6>
                  <img src={"/assets/images/client/Line.svg"} />
                  <p>
                    Our expertise lies in safeguarding homes with top-tier
                    roofing solutions. From installations to repairs, entrust us
                    with ensuring the security and longevity of your roof.
                  </p>
                </div>
              </div>
              <div className="xl-3 lg-3 md-6 sm-6">
                <div className="timeline-content">
                  <h6>INNOVATIONS</h6>
                  <img src={"/assets/images/client/Line.svg"} />
                  <p>
                    We understand that Innovation is crucial when it comes to
                    staying ahead of the curve. Hence we attempt to continuously
                    innovate all our processes as this is what will make us
                    truly world-class.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="timeline-inner mt-8">
          <h5>Our Success Story</h5>
        </div>
        <div class="process-wrapper">
          <div id="progress-bar-container">
            <ul>
              <li class="step step01 active">
                <div class="step-inner">2008</div>
              </li>
              <li class="step step02">
                <div class="step-inner">2011</div>
              </li>
              <li class="step step03">
                <div class="step-inner">2014</div>
              </li>
              <li class="step step04">
                <div class="step-inner">2015</div>
              </li>
              <li class="step step05">
                <div class="step-inner">2023</div>
              </li>
            </ul>

            <div id="line">
              <div id="line-progress"></div>
            </div>
          </div>

          <div id="progress-content-section">
            <div class="section-content discovery active">
              <h3 className="mb-2">SEEDS OF INNOVATION</h3>
              <p>
                In 2008, We Embarked on Our Journey as a Small Manufacturing
                System Application Company
              </p>
            </div>

            <div class="section-content strategy">
              <h3 className="mb-2">FOUNDING UMARGAON FACILITY</h3>
              <p>
                2011, We Established Our Manufacturing Facility in Umargaon,
                Gujarat, Introducing Our First Product
              </p>
            </div>

            <div class="section-content creative">
              <h3 className="mb-2">AWC EMERGES</h3>
              <p>
                In 2014, We Rebranded Ourselves as AWC, Expanding Our Presence
                from Mumbai to a PAN India Level
              </p>
            </div>

            <div class="section-content production">
              <h3 className="mb-2">BECOMING WATERPROOFING EXPERTS</h3>
              <p>
                By 2015, We Transformed into a Full-Fledged Waterproofing
                Company with a Skilled Labor Applicator Team
              </p>
            </div>

            <div class="section-content analysis">
              <h3 className="mb-2">GRAND EXPANSION</h3>
              <p>
                In the Memorable Year of 2023, We Established a Grand Lean
                Manufacturing Setup Spanning 40,000 sqft with a Build-Up of
                90,000 sqft, Offering 9 Specialized Products to Cater to Niche
                Waterproofing Segments
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Timeline;
