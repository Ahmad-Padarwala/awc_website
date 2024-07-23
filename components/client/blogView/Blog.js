import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Blog = ({ bid }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState("");
  const [reletedblog, setReletedblog] = useState([]);
  const [currentURL, setCurrentURL] = useState("");

  const getBlogData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/blogview/${bid}`
      );
      setBlog(response.data[0]);
      releatedBlogs(response.data[0].blog_cate_id);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const releatedBlogs = async (blogId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/blogview/reletedblog/${blogId}`
      );
      setReletedblog(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getBlogData();
  };

  useEffect(() => {
    fetchData();
    setCurrentURL(getCurrentURL());
  }, [bid]);

  function extractFirstParagraph(content) {
    const parser = new DOMParser();

    const doc = parser.parseFromString(content, "text/html");

    const firstParagraphTag = doc.querySelector("p");

    if (firstParagraphTag) {
      const words = firstParagraphTag.textContent.split(/\s+/);
      const limitedText = words.slice(0, 20).join(" ");
      return limitedText;
    }

    return "";
  }

  // Function to get the current URL
  const getCurrentURL = () => window.location.href;

  // const url = "https://sunasarahusen.netlify.app/";

  return (
    <>
      <Head>
        <title>
          {blog?.blog_title || "AWC India - Roof Waterproofing Solutions"}
        </title>
        <meta
          name="keywords"
          content={blog?.meta_keyword || "Blogs, AWC Blogs, AWC India"}
        />
        <meta
          name="description"
          content={
            blog?.meta_desc ||
            "AWC is the best roof waterproofing, terrace waterproofing, and external wall waterproofing contractor in Mumbai"
          }
        />
        {blog?.canonical_url ? (
          <link rel="canonical" href={blog?.canonical_url} />
        ) : (
          <link rel="canonical" href="https://awcindia.in/" />
        )}
      </Head>
      <section className="testi_hero_main">
        <div
          className="containeres"
          style={{
            padding: "170px 0px 50px 0px",
          }}
        >
          <div className="blog-view-sec">
            <p className="blog-view-main-title">
              <Link href={"/blogs"}>blogs</Link>{" "}
              <i className="fa-solid fa-angles-right"></i>
              <i className="fa-solid fa-angles-right"></i>{" "}
              {loading ? (
                <div
                  role="status"
                  className="space-y-2.5 animate-pulse max-w-lg inline-block"
                >
                  <div className="flex items-center w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                  </div>
                </div>
              ) : (
                blog?.category_title
              )}{" "}
              <i className="fa-solid fa-angles-right"></i>
              <i className="fa-solid fa-angles-right"></i>{" "}
              {loading ? (
                <div
                  role="status"
                  className="space-y-2.5 animate-pulse max-w-lg inline-block"
                >
                  <div className="flex items-center w-full">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                  </div>
                </div>
              ) : (
                blog?.blog_title
              )}{" "}
            </p>

            <div className="blog_view_image">
              {loading ? (
                <div
                  role="status"
                  className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                >
                  <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <img
                  src={`/assets/upload/blogs/${blog?.blog_thumbnail}`}
                  alt="blog_view_image"
                />
              )}
            </div>
            <div className="blog_view_content_sec">
              <div className="blog_content">
                <div className="blog_date_section">
                  <p>
                    <i className="fa-solid fa-calendar-days"></i>{" "}
                    {blog?.published_date?.substring(0, 10)}
                  </p>
                </div>
                <div className="blog_title">
                  <p className="heading">{blog?.blog_title}</p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: blog?.blog_description,
                    }}
                  ></p>
                </div>
              </div>
              <div className="side_section">
                <div className="side_sec_card">
                  <p className="card_heading mb-4">Related Articles</p>
                  <hr
                    style={{
                      marginBottom: "20px",
                      height: "1.6px",
                      backgroundColor: "gray",
                    }}
                  />
                  {reletedblog.map((item, idx) => {
                    const slug = item?.blog_title.replace(/\s+/g, "-");
                    return (
                      <>
                        <div className="article" key={item?.blog_id}>
                          <div className="article_icon">
                            <img
                              src={"/assets/images/client/client-img-1.png"}
                              alt=""
                            />
                          </div>
                          <div className="article_data">
                            {/* <p className="heading mb-1">{item?.blog_title}</p> */}
                            <Link href={`/blogs/${slug}/${item?.blog_id}`}>
                              <p
                                className="blog_desc_section p-0"
                                style={{ padding: "0px" }}
                              >
                                {item?.blog_title}
                              </p>
                            </Link>
                            <p className="desc">
                              {extractFirstParagraph(item?.blog_description)}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  <hr
                    style={{
                      marginBottom: "20px",
                      height: "1.6px",
                      backgroundColor: "gray",
                    }}
                  />
                </div>
                <div className="side_sec_card">
                  <p className="card_heading mb-3">Share With Your Friend</p>
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      currentURL
                    )}`}
                    target="_blank"
                    style={{ color: "black" }}
                    rel="noopener noreferrer"
                  >
                    <div className="share_main_section">
                      <div className="icon_title">
                        <i className="fa-brands fa-facebook-f"></i>
                        <p>Share On Facebook</p>
                      </div>
                      <div className="arrow">
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      currentURL
                    )}`}
                    target="_blank"
                    style={{ color: "black" }}
                    rel="noopener noreferrer"
                  >
                    <div className="share_main_section">
                      <div className="icon_title">
                        <i className="fa-brands fa-x-twitter"></i>
                        <p>Share On Twitter</p>
                      </div>
                      <div className="arrow">
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={`whatsapp://send?text=${encodeURIComponent(
                      currentURL
                    )}`}
                    target="_blank"
                    style={{ color: "black" }}
                    rel="noopener noreferrer"
                  >
                    <div className="share_main_section">
                      <div className="icon_title">
                        <i className="fa-brands fa-whatsapp"></i>
                        <p>Share On Whatsapp</p>
                      </div>
                      <div className="arrow">
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      currentURL
                    )}`}
                    target="_blank"
                    style={{ color: "black" }}
                    rel="noopener noreferrer"
                  >
                    <div className="share_main_section">
                      <div className="icon_title">
                        <i className="fa-brands fa-linkedin-in"></i>
                        <p>Share On Linkedin</p>
                      </div>
                      <div className="arrow">
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="container mt-5">
              <p className="related_heading">
                <span>Re</span>lated Articles
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="containers">
          <div className="main_blogs">
            <div className="flex flex-wrap lg:justify-start justify-center">
              {reletedblog.map((item, idx) => {
                const slug = item?.blog_title.replace(/\s+/g, "-");
                return (
                  <div
                    className="sm:w-1/2 md:w-1/3 lg:w-3/12 blog_image_section"
                    key={item?.blog_id}
                  >
                    <img
                      src={`/assets/upload/blogs/${item?.blog_thumbnail}`}
                      alt="blog_image"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                      }}
                    />
                    <div className="blog_name_main_section">
                      <div className="blog_name_section">AWC India</div>
                      <div className="blog_rectangle"></div>
                      <div className="blog_name_section">
                        {item?.published_date.substring(0, 10)}
                      </div>
                    </div>
                    <Link href={`/blogs/${slug}/${item?.blog_id}`}>
                      <p className="blog_desc_section">{item?.blog_title}</p>
                    </Link>
                    <p className="blog_sec_desc_section">
                      {extractFirstParagraph(item?.blog_description)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
