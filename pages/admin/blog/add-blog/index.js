import AddBlog from "@/components/admin/Blog/AddBlog";
import Sidebar from "@/layouts/Sidebar";
import React from "react";

const index = () => { 
  return (
    <>
      <Sidebar />
      <AddBlog />
    </>
  );
};

export default index;
