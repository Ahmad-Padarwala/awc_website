import React from "react";
import Navbar from "@/layouts/Client/Navbar";
import Blog from "./Blog";
import Footer from "@/layouts/Client/Footer";
import Watshapp from "@/layouts/Client/Watshapp";

const index = ({ bid }) => {
  return (
    <>
      <Navbar />
      <Watshapp />
      <Blog bid={bid} />
      <Footer />
    </>
  );
};

export default index;
