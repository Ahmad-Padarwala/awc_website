import React, { useState } from "react";
import LogOut from "./LogOut";
import { useRouter } from "next/router";

const Header = ({ onFilterChange }) => {
  const router = useRouter();
  const currentURL = router.asPath;
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    onFilterChange(e.target.value);
  };

  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

  const openLogOutModal = () => {
    setIsLogOutModalOpen(true);
  };

  const closeLogOutModal = () => {
    setIsLogOutModalOpen(false);
  };

  const logOutAdmin = async () => {
    localStorage.removeItem("token");
    router.push("/admin");
  };
  const isSearchEnabled =
    currentURL === "/admin/product-category" ||
    currentURL === "/admin/products" ||
    currentURL === "/admin/blog-category" ||
    currentURL === "/admin/blog" ||
    currentURL === "/admin/testimonial";

  return (
    <>
      <header className="admin_header">
        <div>
          {isSearchEnabled ? (
            <form>
              <label htmlFor="search">Search for stuff</label>
              <input
                id="search"
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearchChange}
                required
              />
              <button type="button">Go</button>
            </form>
          ) : (
            <form>
              <label htmlFor="search">Search for stuff</label>
              <input id="search" type="text" placeholder="Search..." required />
              <button type="button">Go</button>
            </form>
          )}
          <button className="admin_logOut_btn" onClick={openLogOutModal}>
            <i className="fa-solid fa-right-from-bracket"></i> Log Out
          </button>
        </div>
      </header>
      {isLogOutModalOpen && (
        <LogOut onCancel={closeLogOutModal} onLogOut={logOutAdmin} />
      )}
    </>
  );
};

export default Header;
