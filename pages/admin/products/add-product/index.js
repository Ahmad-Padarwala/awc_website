import AddProduct from "@/components/admin/Products/AddProduct";
import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <AddProduct />
    </>
  );
};

export default index;
