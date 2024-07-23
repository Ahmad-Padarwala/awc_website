import Blogs from "@/components/admin/Blog/Blogs";
 import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <Blogs />
    </>
  );
};

export default index;
