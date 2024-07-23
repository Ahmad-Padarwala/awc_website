import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/layouts/Header";
import axios from "axios";
import Toast, { ErrorToast } from "@/layouts/toast/Toast";

const Dashboard = () => {
  const [productCategory, setProductCategory] = useState(0);
  const [productData, setProductData] = useState([]);
  const [blogCategory, setBlogCategory] = useState([]);
  const [blogData, setBlogData] = useState([]);
  //getall catergory data
  const getAllCategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategory/router`
      );
      setProductCategory(response.data.length);
    } catch (err) {
      console.log(err);
    }
  };
  //all product data
  const getAllProductData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products/router`)
      .then((res) => {
        setProductData(res.data.length);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
      });
  };
  //get all blog category
  const getAllBlogCategoryData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/blogcategory/router`)
      .then((res) => {
        setBlogCategory(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // get all blog data
  const getAllBlogData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/blog/router`)
      .then((res) => {
        setBlogData(res.data.length);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
      });
  };
  useEffect(() => {
    getAllCategoryData();
    getAllProductData();
    getAllBlogCategoryData();
    getAllBlogData();
  }, []);
  return (
    <>
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Dashboard</p>
          <p>
            <Link href="/admin/dashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Dashboard</span>
          </p>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-header">
              <p>Product Category</p>
            </div>
            <div className="card-body">
              <i className="fa-brands fa-product-hunt"></i>
              <p>{productCategory}</p>
            </div>
            <div className="card-footer">
              <Link href="/admin/product-category">View Detail...</Link>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-header">
              <p>Total Products</p>
            </div>
            <div className="card-body">
              <i className="fa-brands fa-product-hunt"></i>
              <p>{productData}</p>
            </div>
            <div className="card-footer">
              <Link href="/admin/products">View Detail...</Link>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-header">
              <p>Blog Category</p>
            </div>
            <div className="card-body">
              <i className="fa-brands fa-product-hunt"></i>
              <p>{blogCategory}</p>
            </div>
            <div className="card-footer">
              <Link href="/admin/blog-category">View Detail...</Link>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-header">
              <p>Total Blogs</p>
            </div>
            <div className="card-body">
              <i className="fa-brands fa-product-hunt"></i>
              <p>{blogData}</p>
            </div>
            <div className="card-footer">
              <Link href="/admin/blog">View Detail...</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
