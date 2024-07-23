import EditProduct from "@/components/admin/Products/EditProduct";
import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <EditProduct />
    </>
  );
};

export default index;
