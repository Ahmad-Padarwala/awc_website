import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  const getBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/blog/allblogs/router`
      );
      console.log(response.data);
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

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

  const fetchData = async () => {
    await getBlog();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const extractFirstBlogtitle = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  };

  return (
    <>
      <section>
        <div className="containers">
          <div className="main_blogs">
            <div className="flex flex-wrap lg:justify-start justify-center">
              {loading ? (
                <>
                  <div className="sm:w-1/2 md:w-1/3 lg:w-3/12 blog_image_section">
                    <div
                      role="status"
                      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                    >
                      <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96">
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
                    <div>
                      <p className="blog_desc_section mt-3">
                        <div className="w-full">
                          <div className="h-4 bg-gray-200 rounded-full w-52 mb-0"></div>
                        </div>
                      </p>
                      <p className="blog_sec_desc_section">
                        <div className="w-full">
                          <div className="h-28 bg-gray-200 rounded w-52 mb-0"></div>
                        </div>
                      </p>
                    </div>
                  </div>
                  <div className="sm:w-1/2 md:w-1/3 lg:w-3/12 blog_image_section">
                    <div
                      role="status"
                      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                    >
                      <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96">
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
                    <div>
                      <p className="blog_desc_section mt-3">
                        <div className="w-full">
                          <div className="h-4 bg-gray-200 rounded-full w-52 mb-0"></div>
                        </div>
                      </p>
                      <p className="blog_sec_desc_section">
                        <div className="w-full">
                          <div className="h-28 bg-gray-200 rounded w-52 mb-0"></div>
                        </div>
                      </p>
                    </div>
                  </div>
                  <div className="sm:w-1/2 md:w-1/3 lg:w-3/12 blog_image_section">
                    <div
                      role="status"
                      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                    >
                      <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96">
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
                    <div>
                      <p className="blog_desc_section mt-3">
                        <div className="w-full">
                          <div className="h-4 bg-gray-200 rounded-full w-52 mb-0"></div>
                        </div>
                      </p>
                      <p className="blog_sec_desc_section">
                        <div className="w-full">
                          <div className="h-28 bg-gray-200 rounded w-52 mb-0"></div>
                        </div>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                blogs.map((item, idx) => {
                  const slug = item?.blog_title.replace(/\s+/g, "-");
                  return (
                    <div
                      className="sm:w-1/2 md:w-1/3 lg:w-3/12 blog_image_section"
                      key={item?.blog_id}
                    >
                      <img
                        src={`./assets/upload/blogs/${item?.blog_thumbnail}`}
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
                        <p className="blog_desc_section">
                          {extractFirstBlogtitle(item?.blog_title, 70)}
                        </p>
                      </Link>
                      <p className="blog_sec_desc_section">
                        {extractFirstParagraph(item?.blog_description)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
