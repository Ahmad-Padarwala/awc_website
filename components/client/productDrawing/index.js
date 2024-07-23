import React, { useEffect, useState } from "react";
import Navbar from "@/layouts/Client/Navbar";
import Footer from "@/layouts/Client/Footer";
import Head from "next/head";
import { useRouter } from "next/router";
import Watshapp from "@/layouts/Client/Watshapp";
import ProductDrowing from "./ProductDrowing";

const index = ({ pid }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  console.log(pid);
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
                AWC India - Roof Waterproofing Solutions
            </title>
            <meta
              name="keywords"
              content={"product, AWC product, AWC India"}
            />
            <meta
              name="description"
              content={"AWC is the best roof waterproofing, terrace waterproofing, and external wall waterproofing contractor in Mumbai"}
            />
              <link rel="canonical" href="https://awcindia.in/" />
          </Head>
          <Navbar />
          <Watshapp />
          <ProductDrowing />
          <Footer />
        </>
      )}
    </>
  );
};

export default index;
