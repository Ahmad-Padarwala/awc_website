import React, { useEffect, useState } from "react";
import Navbar from "@/layouts/Client/Navbar";
import HeroSection from "./HeroSection";
import Footer from "@/layouts/Client/Footer";
import Tabs from "./Tabs";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Watshapp from "@/layouts/Client/Watshapp";

const index = ({ pid }) => {
  const router = useRouter();
  const { productType, productId } = router.query;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const getProductData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproduct/${productId}`
      );
      console.log(response.data[0]);
      setProducts(response.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getProductData();
  };

  useEffect(() => {
    fetchData();
  }, [productId]);
  return (
    <>
      {loading && products == "" ? (
        <div className="fixed top-12 right-0 h-screen w-screen z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <>
          <Head>
            <title>
              {products?.product_title ||
                "AWC India - Roof Waterproofing Solutions"}
            </title>
            <meta
              name="keywords"
              content={
                products?.meta_keyword || "Products, AWC Products, AWC India"
              }
            />
            <meta
              name="description"
              content={
                products?.meta_desc ||
                "AWC is the best roof waterproofing, terrace waterproofing, and external wall waterproofing contractor in Mumbai"
              }
            />
            {products?.canonical_url ? (
              <link rel="canonical" href={products?.canonical_url} />
            ) : (
              <link rel="canonical" href="https://awcindia.in/" />
            )}
          </Head>
          <Navbar />
          <Watshapp />
          <HeroSection />
          <Tabs />
          <Footer />
        </>
      )}
    </>
  );
};

export default index;
