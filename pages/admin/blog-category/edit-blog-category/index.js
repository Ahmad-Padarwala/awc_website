import EditBlogCategory from "@/components/admin/Blog-Category/EditBlogCategory";
 import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => {
  return (
    <>
      <Sidebar />
      <EditBlogCategory />
    </>
  );
};

export default index;
