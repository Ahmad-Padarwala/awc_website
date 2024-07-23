import React from "react";
import Link from "next/link";

const Solution = () => {
  return (
    <>
      <section className="rt-solution-sec">
        <div className="container">
          <div className="rt-solution-inner">
            <h2>Roof and Terrace Waterproofing Solutions</h2>
            <p>
              AWC provides exceptional solutions for waterproofing roofs and
              terraces. We understand the importance of giving your roof and
              terrace the utmost care and protection they deserve.
            </p>
            <p>
              Our waterproofing solutions go beyond simply preventing water
              seepage and shielding them from weather-related deterioration. In
              addition to safeguarding against leaks and weather damage, our
              terrace waterproofing solutions also have the added benefit of
              helping to maintain cooler temperatures inside your home or
              building. By creating a barrier against external heat, our
              products contribute to energy conservation, leading to potential
              savings on your energy bills.
            </p>
            <p>
              Furthermore, when considering the long-term value, the price of
              AWC roof waterproofing is remarkably economical compared to the
              potential advantages that our high-quality products deliver. We
              prioritize providing cost-effective solutions that not only
              address immediate waterproofing needs but also offer lasting
              benefits, making them a worthwhile investment.
            </p>
          </div>
        </div>
      </section>

      <section className="terrace-img-sec">
        <div className="container">
          <div className="terrace-inner">
            <div className="grid">
              <div className="lg-6">
                <div className="t-box">
                  <Link href="/" className="t-link">
                    <img
                      src={"/assets/images/client/terrace-img-1.png"}
                      alt="Terrace Image"
                      width="950"
                      height="auto"
                    />
                  </Link>
                </div>
              </div>
              <div className="lg-3">
                <div className="t-box">
                  <Link href="/" className="t-link">
                    <img
                      src={"/assets/images/client/terrace-img-2.png"}
                      alt="Terrace Image"
                      width="470"
                      height="auto"
                    />
                    <div className="t-content">
                      <h4>Terrace Waterproofing</h4>
                      <p>
                        Have a look at some of our recent successful projects.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="lg-3">
                <div className="t-box">
                  <Link href="/" className="t-link">
                    <img
                      src={"/assets/images/client/terrace-img-3.png"}
                      alt="Terrace Image"
                      width="470"
                      height="auto"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid">
              <div className="lg-3">
                <div className="t-box">
                  <Link href="/" className="t-link">
                    <img
                      src={"/assets/images/client/terrace-img-4.png"}
                      alt="Terrace Image"
                      width="470"
                      height="auto"
                    />
                    <div className="t-content">
                      <h4>External wall waterproofing</h4>
                      <p>
                        Have a look at some of our recent successful projects.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="lg-3">
                <div className="t-box">
                  <Link href="/" className="t-link">
                    <img
                      src={"/assets/images/client/terrace-img-5.png"}
                      alt="Terrace Image"
                      width="470"
                      height="auto"
                    />
                  </Link>
                </div>
              </div>
              <div className="lg-6">
                <div className="t-box">
                  <Link href="/" className="t-link">
                    <img
                      src={"/assets/images/client/terrace-img-6.png"}
                      alt="Terrace Image"
                      width="950"
                      height="auto"
                    />
                    <div className="t-content">
                      <h4>External wall waterproofing</h4>
                      <p>
                        Have a look at some of our recent successful projects.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Solution;
