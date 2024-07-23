import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const HeroSection = () => {
  
  const router = useRouter()
  const { productType, productId } = router.query;
  const [product, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProductData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-view/getproduct/${productId}`
      );
      console.log(response.data[0])
      setProducts(response.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getProductData();
  };

  useEffect(() => {
    fetchData();
  }, [productId]);
  return (
    <>
      <div className="product_view_main">
        <p className="view_product_back_arrow">
          <Link className="text-black" href={"/product"}>
            Products
          </Link>
          <i className="fa-solid fa-angles-right me-1"></i>
          <Link
            className="text-black"
            href={`/product-category/${product?.category_name}/${product?.cate_id}`}
          >
            {product?.category_name}
          </Link>
          <i className="fa-solid fa-angles-right"></i> {product?.product_title}
        </p>

        <div className="product_view_hero_section">
          <div className="product_view_image">
            <img
              src={`/assets/upload/products/${product?.product_image}`}
              alt="product-view-image"
            />
          </div>
          <div className="product_view_hero_section_right_conent">
            <p className="product_view_hero_section_title">
              {product?.product_title}
            </p>
            <p
              className="product_view_hero_section_second_title"
              dangerouslySetInnerHTML={{ __html: product?.product_short_desc }}
            ></p>
            {/* <p className='product_view_hero_section_desc'>Roof-540 is the newest development in water based chemical waterproofing and waterproofing treatment for roof.</p> */}
            <Link href="/contact">
              <button className="product_view_hero_section_btn">
                INQUIRY NOW
              </button>
            </Link>
            <Link href={`/assets/upload/products/${product?.product_brochure}`} target="_blank" className="ml-2">
              <button className="product_view_hero_section_btn_red">
                Download Brochure
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
