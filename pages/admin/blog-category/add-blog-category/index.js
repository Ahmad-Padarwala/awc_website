import AddBlogCategory from "@/components/admin/Blog-Category/AddBlogCategory";
 import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <AddBlogCategory />
    </>
  );
};

export default index;
