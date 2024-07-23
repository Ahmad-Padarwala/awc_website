import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/layouts/Loading";
import Header from "@/layouts/Header";
import DeleteModal from "@/layouts/DeleteModal";
import { useRouter } from "next/router";
import Link from "next/link";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";

const Products = () => {
  //filter Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value
  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilterdProduct(
      getAllProduct.filter((e) => {
        let data = e.product_title.toLowerCase();
        return data.includes(filterValue.toLowerCase());
      })
    );
  }, [filterValue]);
  // filter End

  const router = useRouter();
  const [filterdProduct, setFilterdProduct] = useState([]);
  const [getAllProduct, setGetAllProduct] = useState([]);
  const [getCategoryData, setGetCategoryData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  //delete modal
  const openDeleteModal = (prodId) => {
    setSelectedCategoryId(prodId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedCategoryId(null);
    setIsDeleteModalOpen(false);
  };
  const deleteCategory = () => {
    if (selectedCategoryId) {
      deleteProductData(selectedCategoryId);
      closeDeleteModal();
    }
  };
  const deleteProductData = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${deleteId}`
      );
      getAllProductData();
      getProductategoryData();
      setLoading(false);
      SuccessToast("Product Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //get all prod category
  const getProductategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategorychanges/router`
      );
      setGetCategoryData(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //get all product data
  const getAllProductData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products/router`)
      .then((res) => {
        setGetAllProduct(res.data);
        setFilterdProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  //status edit
  const productStatusChange = async (prodId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/statuschanges/${prodId}/${no}`
      );
      getAllProductData();
      getProductategoryData();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //view product data
  const handleViewProduct = (id) => {
    setLoading(true);
    router.push(`/admin/products/view-product?id=${id}`);
  };

  //edit product data
  const handleEditProduct = (id) => {
    setLoading(true);
    router.push(`/admin/products/edit-product?id=${id}`);
  };

  useEffect(() => {
    getAllProductData();
    getProductategoryData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Products</p>
            <p>
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i className="fa-solid fa-angles-right"></i>
              <span>Products</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/products/add-product">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Product
              </button>
            </Link>
          </div>
        </div>

        <div className="admin_category_table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "15%" }}>ID</th>
                <th style={{ width: "17%" }}>IMAGE</th>
                <th style={{ width: "17%" }}>PDF</th>
                <th style={{ width: "20%" }}>TITLE</th>
                <th style={{ width: "20%" }}>CATEGORY</th>
                <th style={{ width: "15%" }}>ACTION</th>
                <th style={{ width: "10%" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filterdProduct.length > 0 ? (
                filterdProduct.map((product, index) => (
                  <tr key={product.product_id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`/assets/upload/products/${product.product_image}`}
                        width="100%"
                        alt="product"
                        className="table_data_image"
                      />
                    </td>
                    <td>
                      <Link
                        href={`/assets/upload/products/${product.product_brochure}`}
                        target="_blank"
                      >
                        <img
                          src={`/assets/images/pdf-icon.webp`}
                          width="100%"
                          alt="product"
                          className="table_data_image"
                        />
                      </Link>
                    </td>
                    <td>{product.product_title}</td>
                    <td>
                      {product.cate_id
                        ? getCategoryData.find(
                            (category) =>
                              category.category_id === product.cate_id
                          )?.category_name
                        : "null"}
                    </td>
                    <td>
                      <button
                        className="editbutton"
                        onClick={() => {
                          handleEditProduct(
                            product.product_id,
                            product.product_title
                          );
                        }}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        className="data_delete_btn"
                        onClick={() => openDeleteModal(product.product_id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                    <td>
                      {product.status === 1 ? (
                        <img
                          src="/assets/images/activeStatus.png"
                          alt="active"
                          className="status_btn"
                          onClick={() => {
                            productStatusChange(product.product_id, 1);
                          }}
                        />
                      ) : (
                        <img
                          src="/assets/images/inActiveStatus.png"
                          alt="inActive"
                          className="status_btn"
                          onClick={() => {
                            productStatusChange(product.product_id, 0);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" align="center">
                    data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* delete modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteCategory}
        />
        <Toast />
      </section>
    </>
  );
};

export default Products;
