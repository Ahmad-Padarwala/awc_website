import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import Navbar from "@/layouts/Client/Navbar";
import Images from "./Images";
import Footer from "@/layouts/Client/Footer";
import axios from "axios";
import Head from "next/head";
import Watshapp from "@/layouts/Client/Watshapp";

const Index = () => {
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getSEOData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/gallery/router`
      );
      setLoading(false);
      setSeoData(response.data[0]);
      console.log(response.data[0]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    await getSEOData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="fixed top-12 right-0 h-screen w-screen z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <>
          <Head>
            <title>
              {seoData.gallery_title ||
                "AWC India - Roof Waterproofing Solutions"}
            </title>
            <meta
              name="keywords"
              content={
                seoData.gallery_keyword || "gallery, AWC gallery, AWC India"
              }
            />
            <meta
              name="description"
              content={
                seoData.gallery_desc ||
                "AWC is the best roof waterproofing, terrace waterproofing, and external wall waterproofing contractor in Mumbai"
              }
            />
            {seoData.gallery_canonical ? (
              <link rel="canonical" href={seoData.gallery_canonical} />
            ) : (
              <link rel="canonical" href="https://awcindia.in/" />
            )}
          </Head>
          <Navbar />
          <Watshapp />
          <HeroSection
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <Images selectedCategory={selectedCategory} />
          <Footer />
        </>
      )}
    </>
  );
};

export default Index;
