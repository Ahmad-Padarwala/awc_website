import AddProdCategory from "@/components/admin/Product-Category/AddProdCategory";
 import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <AddProdCategory />
    </>
  );
};

export default index;
