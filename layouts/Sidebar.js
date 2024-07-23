import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuBtnChange = () => {
    if (isSidebarOpen) {
      return "fa-solid fa-xmark";
    } else {
      return "fa-solid fa-bars";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin");
    }
  }, []);

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-details">
          <i className="fa-solid fa-water icon"></i>
          <div className="logo_name">AWC</div>
          <i
            className={`bx ${menuBtnChange()}`}
            id="btn"
            onClick={toggleSidebar}
          ></i>
        </div>
        <ul className="nav-list">
          <li
            className={
              router.pathname === "/admin/admindashboard"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-grip-vertical"></i>
              <span className="links_name">Dashboard</span>
            </Link>
          </li>
          <li
            className={
              router.pathname === "/admin/product-category"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/product-category">
              <i className="fa-brands fa-blogger"></i>
              <span className="links_name">Products Category</span>
            </Link>
          </li>
          <li
            className={
              router.pathname === "/admin/products"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/products">
              <i className="fa-brands fa-product-hunt"></i>
              <span className="links_name">Products</span>
            </Link>
          </li>
          <li
            className={
              router.pathname === "/admin/blog-category"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/blog-category">
              <i className="fa-brands fa-blogger"></i>
              <span className="links_name">Blog Category</span>
            </Link>
          </li>
          <li
            className={
              router.pathname === "/admin/blog" ? "admin_sidebar_active_li" : ""
            }
          >
            <Link href="/admin/blog">
              <i className="fa-brands fa-blogger"></i>
              <span className="links_name">Blogs</span>
            </Link>
          </li>
          <li
            className={
              router.pathname === "/admin/testimonial"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/testimonial">
              <i className="fa fa-quote-left"></i>
              <span className="links_name">Testimonial</span>
            </Link>
          </li>

          <li
            className={
              router.pathname === "/admin/videotestimonial"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/videotestimonial">
              <i className="fa fa-quote-left"></i>
              <span className="links_name">Video Testimonial</span>
            </Link>
          </li>


          <li
            className={
              router.pathname === "/admin/gallery"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/gallery">
              <i className="fa-regular fa-image"></i>
              <span className="links_name">Gallery</span>
            </Link>
          </li>
          <li
            className={
              router.pathname === "/admin/applications"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/applications">
              <i className="fa-solid fa-address-card"></i>{" "}
              <span className="links_name">Applicatons</span>
            </Link>
          </li>

          <li
            className={
              router.pathname === "/admin/about"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/about">
              <i className="fa-solid fa-grip-horizontal"></i>{" "}
              <span className="links_name">About</span>
            </Link>
          </li>

          <li
            className={
              router.pathname === "/admin/settings"
                ? "admin_sidebar_active_li"
                : ""
            }
          >
            <Link href="/admin/settings">
              <i className="fa-solid fa-gear"></i>
              <span className="links_name">Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
