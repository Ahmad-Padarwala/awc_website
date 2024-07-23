import BlogCategory from "@/components/admin/Blog-Category/BlogCategory";
 import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <BlogCategory />
    </>
  );
};

export default index;
