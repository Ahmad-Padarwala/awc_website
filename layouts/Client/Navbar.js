import React, { useEffect, useState } from "react";
import $ from "jquery";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

const Navbar = () => {
  const [seoData, setSeoData] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getSEOData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/setting/router`
      );
      setLoading(false);
      setSeoData(response.data[0]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const getSocialLinksData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/social-links/router`
      );
      setLoading(false);
      setSocialLinks(response.data[0]);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getSEOData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    const navToggle = $("#navbar-toggle");
    const dropdown = $(".navbar-dropdown");

    setIsOpen(!isOpen);
    navToggle.toggleClass("active");

    // Toggle the navigation visibility
    const nav = $("nav ul");
    if (!isOpen) {
      nav.slideDown();
      dropdown.slideUp();
    } else {
      nav.slideUp();
      dropdown.slideDown();
    }

    e.stopPropagation();
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <section className="header-grid">
            <div className="grid">
              <div className="lg-3 sm-3 xs-12">
                <div className="header-logo-sec">
                  <Link href="/">
                    {loading ? (
                      <div
                        role="status"
                        className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                      >
                        <div
                          className="flex items-center justify-center bg-gray-300 rounded"
                          style={{ width: "180px", height: "97px" }}
                        >
                          <svg
                            className="w-10 h-10 text-gray-200"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                          </svg>
                        </div>
                      </div>
                    ) : seoData && seoData.logo ? (
                      <img
                        src={`/assets/upload/setting/${seoData.logo}`}
                        alt="AWC Header Logo"
                        width="100%"
                        height="auto"
                        className="header-logo"
                      />
                    ) : (
                      <img
                        src={"/assets/images/client/white-logo.png"}
                        alt="AWC Header Logo"
                        width="100%"
                        height="auto"
                        className="header-logo"
                      />
                    )}
                  </Link>
                </div>
              </div>
              <div className="lg-9 sm-9 xs-12">
                <div className="header-top-sec">
                  <div className="header-social-sec">
                    <ul>
                      <li>
                        {socialLinks && socialLinks.facebook_link ? (
                          <Link
                            href={socialLinks.facebook_link}
                            target="_blank"
                            aria-label="facebook"
                          >
                            <svg
                              width="10"
                              height="18"
                              viewBox="0 0 10 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.00879 10.125L9.50871 6.86742H6.38297V4.75348C6.38297 3.86227 6.81961 2.99355 8.21953 2.99355H9.64055V0.220078C9.64055 0.220078 8.35102 0 7.11809 0C4.54395 0 2.86137 1.56023 2.86137 4.38469V6.86742H0V10.125H2.86137V18H6.38297V10.125H9.00879Z"
                                fill="white"
                              />
                            </svg>
                          </Link>
                        ) : (
                          <Link
                            href="https://www.facebook.com/awcindia.in/"
                            target="_blank"
                            aria-label="facebook"
                          >
                            <svg
                              width="10"
                              height="18"
                              viewBox="0 0 10 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.00879 10.125L9.50871 6.86742H6.38297V4.75348C6.38297 3.86227 6.81961 2.99355 8.21953 2.99355H9.64055V0.220078C9.64055 0.220078 8.35102 0 7.11809 0C4.54395 0 2.86137 1.56023 2.86137 4.38469V6.86742H0V10.125H2.86137V18H6.38297V10.125H9.00879Z"
                                fill="white"
                              />
                            </svg>
                          </Link>
                        )}
                      </li>
                      <li>
                        {socialLinks && socialLinks.twiter_link ? (
                          <Link href={socialLinks.twiter_link} target="_blank" aria-label="twitter">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="18"
                              viewBox="0 0 512 512"
                              fill="none"
                            >
                              <g clip-path="url(#clip0_84_15698)">
                                <rect width="512" height="512" rx="60"></rect>
                                <path
                                  fill="#000"
                                  d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"
                                ></path>
                              </g>
                              <defs>
                                <clipPath id="clip0_84_15698">
                                  <rect
                                    width="512"
                                    height="512"
                                    fill="#fff"
                                  ></rect>
                                </clipPath>
                              </defs>
                            </svg>
                          </Link>
                        ) : (
                          <Link
                            href="https://twitter.com/awc_india"
                            target="_blank"
                            aria-label="twitter"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="18"
                              viewBox="0 0 512 512"
                              fill="none"
                            >
                              <g clip-path="url(#clip0_84_15698)">
                                <rect width="512" height="512" rx="60"></rect>
                                <path
                                  fill="#000"
                                  d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z"
                                ></path>
                              </g>
                              <defs>
                                <clipPath id="clip0_84_15698">
                                  <rect
                                    width="512"
                                    height="512"
                                    fill="#fff"
                                  ></rect>
                                </clipPath>
                              </defs>
                            </svg>
                          </Link>
                        )}
                      </li>
                      <li>
                        {socialLinks && socialLinks.youtube_link ? (
                          <Link href={socialLinks.youtube_link} target="_blank"
                          aria-label="youtube">
                            <svg
                              width="18"
                              height="13"
                              viewBox="0 0 18 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17.6239 1.98027C17.4169 1.20079 16.8069 0.5869 16.0325 0.378566C14.6288 0 9 0 9 0C9 0 3.37127 0 1.96752 0.378566C1.19308 0.586933 0.583143 1.20079 0.376127 1.98027C0 3.39312 0 6.3409 0 6.3409C0 6.3409 0 9.28868 0.376127 10.7015C0.583143 11.481 1.19308 12.0693 1.96752 12.2777C3.37127 12.6562 9 12.6562 9 12.6562C9 12.6562 14.6287 12.6562 16.0325 12.2777C16.8069 12.0693 17.4169 11.481 17.6239 10.7015C18 9.28868 18 6.3409 18 6.3409C18 6.3409 18 3.39312 17.6239 1.98027ZM7.15908 9.01727V3.66454L11.8636 6.34097L7.15908 9.01727Z"
                                fill="#07070A"
                              />
                            </svg>
                          </Link>
                        ) : (
                          <Link
                            href="https://www.youtube.com/channel/UCoNJRSh7tkbDHmF8GoOi4fw"
                            target="_blank"
                            aria-label="youtube"
                          >
                            <svg
                              width="18"
                              height="13"
                              viewBox="0 0 18 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17.6239 1.98027C17.4169 1.20079 16.8069 0.5869 16.0325 0.378566C14.6288 0 9 0 9 0C9 0 3.37127 0 1.96752 0.378566C1.19308 0.586933 0.583143 1.20079 0.376127 1.98027C0 3.39312 0 6.3409 0 6.3409C0 6.3409 0 9.28868 0.376127 10.7015C0.583143 11.481 1.19308 12.0693 1.96752 12.2777C3.37127 12.6562 9 12.6562 9 12.6562C9 12.6562 14.6287 12.6562 16.0325 12.2777C16.8069 12.0693 17.4169 11.481 17.6239 10.7015C18 9.28868 18 6.3409 18 6.3409C18 6.3409 18 3.39312 17.6239 1.98027ZM7.15908 9.01727V3.66454L11.8636 6.34097L7.15908 9.01727Z"
                                fill="#07070A"
                              />
                            </svg>
                          </Link>
                        )}
                      </li>
                      <li>
                        {socialLinks && socialLinks.linkedin_link ? (
                          <Link
                            href={socialLinks.linkedin_link}
                            target="_blank"
                            aria-label="linkedin"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="13"
                              viewBox="0 5 1036 990"
                            >
                              <path d="M0 120c0-33.334 11.667-60.834 35-82.5C58.333 15.833 88.667 5 126 5c36.667 0 66.333 10.666 89 32 23.333 22 35 50.666 35 86 0 32-11.333 58.666-34 80-23.333 22-54 33-92 33h-1c-36.667 0-66.333-11-89-33S0 153.333 0 120zm13 875V327h222v668H13zm345 0h222V622c0-23.334 2.667-41.334 8-54 9.333-22.667 23.5-41.834 42.5-57.5 19-15.667 42.833-23.5 71.5-23.5 74.667 0 112 50.333 112 151v357h222V612c0-98.667-23.333-173.5-70-224.5S857.667 311 781 311c-86 0-153 37-201 111v2h-1l1-2v-95H358c1.333 21.333 2 87.666 2 199 0 111.333-.667 267.666-2 469z"></path>
                            </svg>
                          </Link>
                        ) : (
                          <Link
                            href="https://www.linkedin.com/in/awc-india-36ab76a8/"
                            target="_blank"
                            aria-label="linkedin"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="13"
                              viewBox="0 5 1036 990"
                            >
                              <path d="M0 120c0-33.334 11.667-60.834 35-82.5C58.333 15.833 88.667 5 126 5c36.667 0 66.333 10.666 89 32 23.333 22 35 50.666 35 86 0 32-11.333 58.666-34 80-23.333 22-54 33-92 33h-1c-36.667 0-66.333-11-89-33S0 153.333 0 120zm13 875V327h222v668H13zm345 0h222V622c0-23.334 2.667-41.334 8-54 9.333-22.667 23.5-41.834 42.5-57.5 19-15.667 42.833-23.5 71.5-23.5 74.667 0 112 50.333 112 151v357h222V612c0-98.667-23.333-173.5-70-224.5S857.667 311 781 311c-86 0-153 37-201 111v2h-1l1-2v-95H358c1.333 21.333 2 87.666 2 199 0 111.333-.667 267.666-2 469z"></path>
                            </svg>
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>
                  <div className="header-contact-sec">
                    <ul>
                      <li>
                        <Link href={`tel:+91${seoData?.number}`}>
                          <img
                            src={"/assets/images/client/h_call_icon.webp"}
                            alt="Header Call Icon"
                            width="16"
                            height="16"
                          />
                          {loading ? (
                            <div
                              role="status"
                              className="space-y-2.5 animate-pulse inline-block"
                            >
                              <div className="flex items-center w-full">
                                <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                              </div>
                            </div>
                          ) : (
                            <>
                              {seoData?.number
                                ? `+91 ${seoData.number.slice(
                                    0,
                                    2
                                  )} ${seoData.number.slice(
                                    2,
                                    4
                                  )} ${seoData.number.slice(
                                    4,
                                    6
                                  )} ${seoData.number.slice(6)}`
                                : ""}
                            </>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link href={`mailto:${seoData && seoData?.email}`}>
                          <img
                            src={"/assets/images/client/h_mail_icon.webp"}
                            alt="Header E-mail Icon"
                            width="16"
                            height="12"
                          />

                          {loading ? (
                            <div
                              role="status"
                              className="space-y-2.5 animate-pulse inline-block"
                            >
                              <div className="flex items-center w-full">
                                <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                              </div>
                            </div>
                          ) : (
                            <>{seoData && seoData?.email}</>
                          )}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <section className="navigation">
                  <div className="nav-container">
                    <nav>
                      <div className="nav-mobile">
                        <span id="navbar-toggle" onClick={handleToggle}>
                          <span></span>
                        </span>
                      </div>
                      <ul className="nav-list">
                        <li>
                          <Link
                            className={router.pathname === "/" ? "active" : ""}
                            href="/"
                          >
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              router.pathname === "/about" ? "active" : ""
                            }
                            href="/about"
                          >
                            About Us
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              router.pathname === "/product" ? "active" : ""
                            }
                            href="/product"
                          >
                            Products
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              router.pathname === "/gallery" ? "active" : ""
                            }
                            href="/gallery"
                          >
                            Gallery
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              router.pathname === "/career" ? "active" : ""
                            }
                            href="/career"
                          >
                            Career
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              router.pathname === "/blogs" ? "active" : ""
                            }
                            href="/blogs"
                          >
                            Blog
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              router.pathname === "/testimonials"
                                ? "active"
                                : ""
                            }
                            href="/testimonials"
                          >
                            Testimonials
                          </Link>
                        </li>
                        <li className="contact-us-link">
                          <Link href="/contact">Contact</Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </header>
    </>
  );
};

export default Navbar;
