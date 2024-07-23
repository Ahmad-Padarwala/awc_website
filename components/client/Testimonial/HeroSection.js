import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <>
      <section className="testi_hero_main">
        <div className="containeres">
          <p className="test_hero_title">VOICES OF SATISFACTION</p>
          <p className="test_hero_big_title">
            AWC Waterproofing's Success Stories
          </p>
          <p className="test_hero_desc">
            Dive into satisfaction with AWC Waterproofing – where expertise
            meets excellence, keeping your spaces dry and customers smiling.
          </p>
          <div className="text-center m-5">
            <Link href="/contact">
              <button className="test_hero_btn">GET FREE QUOTE NOW</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
