import React from "react";
import Link from "next/link";

const Products = ({ productCategories }) => {
  return (
    <>
      <section className="solution-sec">
        <div className="container">
          <div className="solution-inner">
            <h2>Waterproofing Solutions</h2>
            <div className="grid">
              {productCategories.map((category) => (
                <div key={category?.category_id} className="lg-4 md-6">
                  <div className="solution-box">
                    <h4>{category?.category_name}</h4>
                  </div>
                  <div className="solution-category">
                    <ul>
                      {category?.products.map((product) => {
                        const slug = product.product_title.replace(/\s+/g, "-");
                        return (
                          <li key={product.product_id}>
                            <Link
                              href={`/product/${slug}/${product.product_id}`}
                            >
                              {product.product_title}
                              <svg
                                width="22"
                                height="18"
                                viewBox="0 0 22 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.7364 1.01072L12.4988 0.243609C12.8216 -0.081203 13.3435 -0.081203 13.6629 0.243609L21.7579 8.41257C22.0807 8.73738 22.0807 9.26261 21.7579 9.58397L13.6629 17.7564C13.3401 18.0812 12.8181 18.0812 12.4988 17.7564L11.7364 16.9893C11.4102 16.661 11.417 16.1254 11.7501 15.8041L17.3073 10.3822L0.824181 10.3822C0.367447 10.3822 0 10.0124 0 9.55287L0 8.44713C0 7.98755 0.367447 7.61782 0.824181 7.61782L17.3073 7.61782L11.7501 2.19594C11.4136 1.87458 11.4067 1.33899 11.7364 1.01072Z"
                                  fill="white"
                                />
                              </svg>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
