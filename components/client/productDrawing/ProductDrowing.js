import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ProductDrowing = () => {
  const router = useRouter();
  console.log(router.query);
  const { productType, productId } = router.query;
  const [loading, setLoading] = useState(true);
  const [allDrawings, setAllDrawings] = useState([]);

  const getProductDrawing = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproductdrawing/${productId}`
      );
      console.log(response.data);
      setAllDrawings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getProductDrawing();
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  return (
    <>
      <section className="testi_hero_main">
        <div className="containeres" style={{ paddingTop: 200 }}>
          <p className="test_hero_big_title" style={{ fontWeight: "bold" }}>
            Detailed Drawing
          </p>
          <div
            className="flex flex-wrap p-0 justify-evenly mb-5"
            style={{ marginRight: 0 }}
          >
            {loading && allDrawings.length == 0 ? (
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
                      <span className="w-full">
                        <span className="h-4 bg-gray-200 rounded-full w-52 mb-0"></span>
                      </span>
                    </p>
                    <p className="blog_sec_desc_section">
                      <span className="w-full">
                        <span className="h-28 bg-gray-200 rounded w-52 mb-0"></span>
                      </span>
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
                      <span className="w-full">
                        <span className="h-4 bg-gray-200 rounded-full w-52 mb-0"></span>
                      </span>
                    </p>
                    <p className="blog_sec_desc_section">
                      <span className="w-full">
                        <span className="h-28 bg-gray-200 rounded w-52 mb-0"></span>
                      </span>
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
                      <span className="w-full">
                        <span className="h-4 bg-gray-200 rounded-full w-52 mb-0"></span>
                      </span>
                    </p>
                    <p className="blog_sec_desc_section">
                      <span className="w-full">
                        <span className="h-28 bg-gray-200 rounded w-52 mb-0"></span>
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              allDrawings.map((item, idx) => (
                <div key={idx} className="ff one-ifrme">
                  <iframe
                    title="pdf"
                    src={`/assets/upload/products/productDrawing/${item.pdf_link}`}
                    width="100%"
                    height="300px"
                  />
                  <p>{item.pdf_title}</p>
                  <Link
                    href={`/assets/upload/products/productDrawing/${item.pdf_link}`}
                    target="_blank"
                  >
                    <button>Download</button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDrowing;
