import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Product = () => {
  const [loading, setLoading] = useState(true);
  const [ProductCategory, setProductCategory] = useState([]);

  const getCategoryProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product/productcategories/router`
      );
      setProductCategory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getCategoryProducts();
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const extractFirstCatetitle = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  };

  return (
    <>
      <section className="product-sec">
        <div className="product-container">
          <div className="product-inner">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div
                  role="status"
                  className="animate-pulse md:space-y-0 md:flex md:items-center"
                  style={{ width: "353px", margin: "0px auto" }}
                >
                  <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96"></div>
                </div>
                <div
                  role="status"
                  className="animate-pulse md:space-y-0 md:flex md:items-center"
                  style={{ width: "353px", margin: "0px auto" }}
                >
                  <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96"></div>
                </div>
                <div
                  role="status"
                  className="animate-pulse md:space-y-0 md:flex md:items-center"
                  style={{ width: "353px", margin: "0px auto" }}
                >
                  <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {ProductCategory.map((item, idx) => {
                    const slug = item?.category_name.replace(/\s+/g, "-");
                    return (
                      <div key={item?.category_id} className="product-card">
                        <div className="product-content">
                          <h4>AWC INDIA</h4>
                          <h2>
                            {extractFirstCatetitle(item?.category_name, 15)}
                          </h2>
                          <p>
                            {extractFirstParagraph(item?.category_description)}
                            ...
                          </p>
                          <Link
                            href={`/product-category/${slug}/${item?.category_id}`}
                          >
                            {item?.category_title} Products{" "}
                            <span>
                              <svg
                                style={{ verticalAlign: "middle" }}
                                width="15"
                                height="12"
                                viewBox="0 0 15 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.66885 0.673812L8.2134 0.162406C8.44398 -0.0541354 8.81682 -0.0541354 9.04494 0.162406L14.8271 5.60838C15.0576 5.82492 15.0576 6.17507 14.8271 6.38931L9.04494 11.8376C8.81437 12.0541 8.44152 12.0541 8.2134 11.8376L7.66885 11.3262C7.43583 11.1073 7.44073 10.7503 7.67867 10.536L11.6481 6.92145L0.5887 6.92145C0.262462 6.92145 0 6.67496 0 6.36858L0 5.63142C0 5.32503 0.262462 5.07855 0.5887 5.07855L11.6481 5.07855L7.67867 1.46396C7.43828 1.24972 7.43337 0.892657 7.66885 0.673812Z"
                                  fill="#1386D3"
                                ></path>
                              </svg>
                            </span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
