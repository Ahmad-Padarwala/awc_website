import ProductCategory from "@/components/admin/Product-Category/ProductCategory";
 import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <ProductCategory />
    </>
  );
};

export default index;
