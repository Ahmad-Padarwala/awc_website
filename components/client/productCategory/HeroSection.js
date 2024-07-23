import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const HeroSection = ({ cid, data }) => {
  const [Category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-category/${cid}`
      );
      setCategory(response.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    await getCategory();
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Head>
        <title>{Category.category_name || "Product Category"}</title>
        <meta
          name="keywords"
          content={
            Category.meta_keyword ||
            "Product Category, AWC Product Category, AWC India"
          }
        />
        <meta
          name="description"
          content={
            Category.meta_description ||
            "Product Category, AWC Product Category, AWC India"
          }
        />
        {Category.canonical_url && (
          <link rel="canonical" href={Category.canonical_url} />
        )}
      </Head>
      <section className="roof-banner-sec">
        <div className="container">
          <div className="roof-banner-inner">
            <p className="sub-title">Awc India</p>
            <h1 className="main-title">
              {loading ? (
                <div
                  role="status"
                  className="space-y-2.5 animate-pulse inline-block"
                >
                  <div className="flex items-center w-full">
                    <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
                  </div>
                </div>
              ) : (
                Category && Category.category_name
              )}
            </h1>

            {loading ? (
              <div
                role="status"
                className="space-y-2.5 animate-pulse inline-block"
              >
                <div className="flex items-center w-full">
                  <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
                </div>
              </div>
            ) : (
              <p
                className="dec"
                dangerouslySetInnerHTML={{
                  __html: Category && Category.category_description,
                }}
              ></p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
