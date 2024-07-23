import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [productImage, setProductImage] = useState([]);
  const [productVideo, setProductVideo] = useState([]);
  const [productDocs, setProductDocs] = useState([]);
  const [productDrowing, setProductDrowing] = useState([]);
  const [productCertificate, setProductCertificate] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { productType, productId } = router.query;

  const [lognDesc, setProducts] = useState([]);
  const [cid, setcid] = useState(0);

  const getProductData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproduct/${productId}`
      );
      setProducts(response.data[0].product_long_desc);
      setcid(response.data[0].cate_id);
      getCategoryProducts(response.data[0].cate_id);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  };

  const getProductImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproductimage/${productId}`
      );
      setProductImage(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getProductVideo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproductvideo/${productId}`
      );
      setProductVideo(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getProductCertificate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproductcertificate/${productId}`
      );
      setProductCertificate(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getProductDocs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproductdocs/${productId}`
      );
      setProductDocs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const getProductDrowing = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproductdrawing/${productId}`
      );
      setProductDrowing(response.data);
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
  // related products
  const [CategoryProduct, setCategoryProduct] = useState([]);

  const getCategoryProducts = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-category/category-products/${data}`
      );
      setCategoryProduct(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const extractFirstBlog = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  };

  const fetchData = async () => {
    await getProductData();
    await getProductImages();
    await getProductVideo();
    await getProductDocs();
    await getProductDrowing();
    await getProductCertificate();
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  return (
    <>
      {loading ? (
        <div className="main_tab_section">
          <div
            role="status"
            class="flex items-center justify-center h-56 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="main_tab_section">
          <div>
            <button
              className={`tab-btn ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => handleTabClick("description")}
            >
              DESCRIPTION
            </button>
            <button
              className={`tab-btn ${activeTab === "docs" ? "active" : ""}`}
              onClick={() => handleTabClick("docs")}
            >
              DOCS
            </button>
            <button
              className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
              onClick={() => handleTabClick("photos")}
            >
              PHOTOS
            </button>
            <button
              className={`tab-btn ${
                activeTab === "testing-videos" ? "active" : ""
              }`}
              onClick={() => handleTabClick("testing-videos")}
            >
              TESTING VIDEOS
            </button>
            <button
              className={`tab-btn ${
                activeTab === "certificate" ? "active" : ""
              }`}
              onClick={() => handleTabClick("certificate")}
            >
              CERTIFICATES
            </button>
          </div>

          {activeTab === "description" && (
            <div>
              <p className="product_view_desc_title">Product Information</p>
              <div
                className="ckeditor-output"
                dangerouslySetInnerHTML={{ __html: lognDesc }}
              ></div>
            </div>
          )}
          {activeTab === "docs" && (
            <div>
              <p className="product_view_doc_title">Product Documents</p>
              {productDocs.map((item, idx) => {
                return (
                  <div className="product_view_docs_main">
                    <div className="product_view_doc_thumbnail">
                      <img src={"/assets/images/client/pdf 2.png"} alt="" />
                    </div>
                    <div className="product_view_doc_thumbnail_title">
                      {item?.pdf_title}{" "}
                    </div>
                    <Link
                      href={`/assets/upload/products/productDocs/${item?.pdf_link}`}
                      target="_blank"
                      className="product_view_doc_dowonload"
                    >
                      <i className="fa-solid fa-download text-white"></i>
                    </Link>
                    {/* <iframe
                      title="PDF Viewer"
                      src={/assets/upload/products/productDocs/${item?.pdf_link}}
                      width="35%"
                      height="300px"
                    /> */}
                  </div>
                );
              })}
              {/* <div className="product_view_docs_main">
                <div className="product_view_doc_thumbnail">
                  <img src={"/assets/images/client/pdf 2.png"} alt="" />
                </div>
                <div className="product_view_doc_thumbnail_title">
                  Roof 540 Detailed Drowing{" "}
                </div>
                <Link href={/product/${productType}/drawing/${productId}} className="product_view_doc_dowonload" target="blank">
                  <i className="fa-solid fa-download text-white"></i>
                </Link>
              </div> */}
              {productDrowing.length > 0 ? (
                <>
                  <div className="product_view_docs_main">
                    <div className="product_view_doc_thumbnail">
                      <img src={"/assets/images/client/pdf 2.png"} alt="" />
                    </div>
                    <div className="product_view_doc_thumbnail_title">
                      Roof 540 Detailed Drowing{" "}
                    </div>
                    <Link
                      href={`/product/${productType}/drawing/${productId}`}
                      className="product_view_doc_dowonload"
                      target="blank"
                    >
                      <i className="fa-solid fa-download text-white"></i>
                    </Link>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          )}
          {activeTab === "photos" && (
            <div>
              <p className="product_view_photo_title">Photos</p>
              <div className="grid">
                {productImage.map((item, idx) => {
                  return (
                    <div className="lg-4 md-6 sm-12 product_view_images_gallary">
                      <img
                        src={`/assets/upload/products/productImages/${item?.product_image}`}
                        alt={item?.alternative}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === "testing-videos" && (
            <div>
              <p className="product_view_photo_title">Videos</p>
              <div className="grid">
                {productVideo.map((item, idx) => {
                  return (
                    <div className="lg-4 md-6 sm-12 product_view_images_gallary">
                      <Link href={item?.product_video} target="_blank">
                        <div className="product_view_youtube_icon">
                          <img
                            src={`/assets/upload/products/productVedios/${item?.video_thumbnail}`}
                            alt={extractFirstParagraph(item?.video_description)}
                          />
                          <i className="fa-brands fa-youtube"></i>
                        </div>
                        <p className="product-view-title">
                          {truncateString(item?.video_title, 40)}
                        </p>
                        <p>@Awc India</p>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {activeTab === "certificate" && (
            <div>
              <p className="product_view_doc_title">
                Technical Details and Brouchers
              </p>
              {productCertificate.map((item, idx) => {
                return (
                  <div className="product_view_docs_main">
                    <div className="product_view_doc_thumbnail">
                      <img src={"/assets/images/client/pdf 2.png"} alt="" />
                    </div>
                    <div className="product_view_doc_thumbnail_title">
                      {item?.certificate_title}{" "}
                    </div>
                    <Link
                      href={`/assets/upload/products/productCertificate/${item?.certificate_link}`}
                      target="_blank"
                    >
                      <div className="product_view_certificate_dowonload">
                        <i className="fa-solid fa-download text-white"></i>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* related products */}

      <section className="roof-category-sec">
        <div className="container">
          <div className="roof-category-inner">
            <div className="container mt-3 mb-10">
              <p className="related_heading">
                <span>Re</span>lated Products
              </p>
            </div>
            <div className="grid">
              {CategoryProduct.map((item, key) => {
                const slug = item?.product_title.replace(/\s+/g, "-");
                if (item.product_id != productId) {
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
                }
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tabs;
