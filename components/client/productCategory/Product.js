import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Product = ({ cid }) => {
  const [loading, setLoading] = useState(true);
  const [CategoryProduct, setCategoryProduct] = useState([]);

  const getCategoryProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-category/category-products/${cid}`
      );
      setCategoryProduct(response.data);
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

  const extractFirstBlog = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  };

  return (
    <>
      <section className="roof-category-sec">
        <div className="container">
          <div className="roof-category-inner">
            <div className="grid">
              {loading ? (
                <div className="roof-category-inner">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
                    <div
                      role="status"
                      className="animate-pulse lg-4 md-6 sm-12 md:items-center"
                    >
                      <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96 mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded sm:w-48 mb-4"></div>
                      <div className="h-28 bg-gray-300 rounded sm:w-80"></div>
                    </div>
                    <div
                      role="status"
                      className="animate-pulse lg-4 md-6 sm-12 md:items-center"
                    >
                      <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96 mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded sm:w-48 mb-4"></div>
                      <div className="h-28 bg-gray-300 rounded sm:w-80"></div>
                    </div>
                    <div
                      role="status"
                      className="animate-pulse lg-4 md-6 sm-12 md:items-center"
                    >
                      <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96 mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded sm:w-48 mb-4"></div>
                      <div className="h-28 bg-gray-300 rounded sm:w-80"></div>
                    </div>
                  </div>
                </div>
              ) : (
                CategoryProduct.map((item, key) => {
                  const slug = item?.product_title.replace(/\s+/g, "-");
                  return (
                    <div
                      key={item?.product_id}
                      className="lg-4 md-6 sm-12 mb-5"
                    >
                      <div className="roof-box">
                        <div className="roof-image">
                          <img
                            src={`/assets/upload/products/${item?.product_image}`}
                            alt="Roof 540 Category Image"
                            width="406"
                          />
                        </div>
                        <div className="roof-content">
                          <h4>{extractFirstBlog(item?.product_title, 18)}</h4>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: item?.product_short_desc,
                            }}
                          ></p>
                          <Link
                            href={`/product/${slug}/${item?.product_id}`}
                            className="view-detail-Link"
                          >
                            View Detail
                            <span>
                              <svg
                                width="15"
                                height="12"
                                viewBox="0 0 15 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.66885 0.673812L8.2134 0.162406C8.44398 -0.0541354 8.81682 -0.0541354 9.04494 0.162406L14.8271 5.60838C15.0576 5.82492 15.0576 6.17507 14.8271 6.38931L9.04494 11.8376C8.81437 12.0541 8.44152 12.0541 8.2134 11.8376L7.66885 11.3262C7.43583 11.1073 7.44073 10.7503 7.67867 10.536L11.6481 6.92145L0.5887 6.92145C0.262462 6.92145 0 6.67496 0 6.36858L0 5.63142C0 5.32503 0.262462 5.07855 0.5887 5.07855L11.6481 5.07855L7.67867 1.46396C7.43828 1.24972 7.43337 0.892657 7.66885 0.673812Z"
                                  fill="#1386D3"
                                />
                              </svg>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="leading-sec">
        <div className="container">
          <div className="leading-inner-sec">
            <div className="grid">
              <div className="lg-4 md-6 sm-12">
                <div className="leading-box">
                  <img
                    src={"/assets/images/client/leading-img-1.png"}
                    alt="Industry-Leading Expertise Image"
                    width="60"
                    height="auto"
                  />
                  <div className="leading-content">
                    <h4>Industry-Leading Expertise</h4>
                    <p>
                      Our team's unparalleled expertise and innovative solutions
                      make us the go-to choice for effective and long-lasting
                      waterproofing.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg-4 md-6 sm-12">
                <div className="leading-box">
                  <img
                    src={"/assets/images/client/leading-img-2.png"}
                    alt="Uncompromising Quality Image"
                    width="60"
                    height="auto"
                  />
                  <div className="leading-content">
                    <h4>Uncompromising Quality</h4>
                    <p>
                      We set the standard for quality in waterproofing, ensuring
                      your project benefits from top-tier materials and
                      craftsmanship.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg-4 md-6 sm-12">
                <div className="leading-box">
                  <img
                    src={"/assets/images/client/leading-img-3.png"}
                    alt="Your Satisfaction, Our Priority Image"
                    width="60"
                    height="auto"
                  />
                  <div className="leading-content">
                    <h4>Your Satisfaction, Our Priority</h4>
                    <p>
                      Our unwavering commitment to your satisfaction ensures a
                      seamless experience, with your needs at the forefront of
                      every solution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
