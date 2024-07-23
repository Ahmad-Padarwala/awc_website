import Products from "@/components/admin/Products/Products";
import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <Products />
    </>
  );
};

export default index;
