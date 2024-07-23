import "@/styles/globals.css";
import "@/styles/Dashboard.css";
import "@/styles/User.css";
import "@/styles/client/Home.css";
import "@/styles/client/Product.css";
import "@/styles/client/BlogView.css";
import "@/styles/client/About.css";
import "@/styles/client/Gallery.css";
import "@/styles/client/Blog.css";
import "@/styles/client/Testimonial.css";
import "@/styles/client/Contact.css";
import "@/styles/client/ProductView.css";
import "@/styles/client/career.css";
import "@/styles/client/ProductDrowing.css";

import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App({ Component, pageProps }) {
  const [GlobalSeo, setGlobalSeo] = useState({});
  const [data, setdata] = useState([]);
  // const getGlobalData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/client/global-seo/router`
  //     );
  //     setGlobalSeo(response.data[0]);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/setting/router`
      );
      setdata(response.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    await getData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: "AWC India Waterproofing Solutions",
    image: "https://awcindia.in/assets/images/client/unit_image_1.JPG",
    "@id": "",
    url: "https://awcindia.in/",
    telephone: "8686862475",
    address: {
      "@type": "PostalAddress",
      streetAddress: "A-11, 4th Floor, Malad Yojana CHSL, S.V.Road",
      addressLocality: "Malad, Mumbai",
      postalCode: "400064",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.18410479707908,
      longitude: 72.84700399743139,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Wednesday",
        "Tuesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: [
      "https://www.facebook.com/awcindia.in/",
      "https://twitter.com/awc_india",
      "https://www.youtube.com/channel/UCoNJRSh7tkbDHmF8GoOi4fw",
      "https://www.linkedin.com/in/awc-india-36ab76a8/",
    ],
  };
  return (
    <>
      <Head>
        <title>AWC Web</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
        <link rel="icon" href={`/assets/upload/setting/${data?.favicon}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RSEKWFPY1Z"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RSEKWFPY1Z');
          `,
          }}
        />
        {/* End Google Analytics */}

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PBDVWS3');`,
          }}
        />
        {/* End Google Tag Manager */}


        {/* Google Search Console */}
        <meta name="google-site-verification" content="_-W5-IOllqGtmNsJQGAmJ1Ej91tc6S2i8-OOdthiR7I" />
        {/* End Google Search Console */}


      </Head>
      <Component {...pageProps} />
    </>
  );
}
