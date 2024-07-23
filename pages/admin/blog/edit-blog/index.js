import EditBlog from "@/components/admin/Blog/EditBlog";
 import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <EditBlog />
    </>
  );
};

export default index;
