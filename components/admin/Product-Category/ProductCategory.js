import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Header from "@/layouts/Header";
import DeleteModal from "@/layouts/DeleteModal";
import { useRouter } from "next/router";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";
import Loading from "@/layouts/Loading";

const ProductCategory = () => {
  //filter Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value
  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilterdCategory(
      getCategoryData.filter((e) => {
        let data = e.category_title.toLowerCase();
        return data.includes(filterValue.toLowerCase());
      })
    );
  }, [filterValue]);
  // filter End

  const [filterdCategory, setFilterdCategory] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [getCategoryData, setGetCategoryData] = useState([]);
  const [getActiveCateData, setGetActiveCateData] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  //delete modal
  const openDeleteModal = (cateId) => {
    setSelectedCategoryId(cateId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedCategoryId(null);
    setIsDeleteModalOpen(false);
  };
  const deleteCategory = () => {
    if (selectedCategoryId) {
      deleteProductCategoryData(selectedCategoryId);
      closeDeleteModal();
    }
  };

  //getall catergory data
  const getAllCategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategory/router`
      );
      setGetCategoryData(response.data);
      setFilterdCategory(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  //get active category
  const getActiveCategoryData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategorychanges/router`
      );
      setGetActiveCateData(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  //edit product category data section start
  const handleEditProdCate = (cateId) => {
    setLoading(true);
    router.push(`/admin/product-category/edit-product-category?id=${cateId}`);
  };

  //status edit
  const catgoryStatusChange = async (cateId, no) => {
    setLoading(true);
    const category = getActiveCateData.find(
      (category) => category.sub_category == cateId
    );
    if (category) {
      ErrorToast("Cannot Deactive this data because it connect each other");
      getAllCategoryData();
      getActiveCategoryData();
    } else {
      try {
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/productcategorychanges/${cateId}/${no}`
        );
        getAllCategoryData();
        getActiveCategoryData();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        ErrorToast(error?.response?.data?.message);
      }
    }
  };

  //delete product category data section start
  const deleteProductCategoryData = async (deleteId) => {
    setLoading(true);
    const category = getCategoryData.find(
      (category) => category.sub_category === deleteId
    );
    if (category) {
      getAllCategoryData();
      getActiveCategoryData();
      ErrorToast("Cannot delete this data because it connect each other");
    } else {
      try {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/productcategory/${deleteId}`
        );
        setIsDeleteModalOpen(false);
        getAllCategoryData();
        getActiveCategoryData();
        SuccessToast("Category Deleted Successfully");
        setLoading(false);
      } catch (err) {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getAllCategoryData();
    getActiveCategoryData();
  }, []);

  //for truncate text code
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  };

  return (
    <>
      {loading && <Loading />}

      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Product Category</p>
            <p>
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i className="fa-solid fa-angles-right"></i>
              <span>Product Category</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/product-category/add-product-category">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Category
              </button>
            </Link>
          </div>
        </div>
        <div className="admin_category_table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "7%", textAlign: "center" }}>ID</th>
                <th style={{ width: "20%", textAlign: "center" }}>IMAGE</th>
                <th style={{ width: "25%", textAlign: "center" }}>NAME</th>
                <th style={{ width: "25%", textAlign: "center" }}>TITLE</th>
                <th style={{ width: "17%", textAlign: "center" }}>
                  SUB CATEGORY
                </th>
                <th style={{ width: "15%", textAlign: "center" }}>
                  ACTION
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filterdCategory.length > 0 ? (
                filterdCategory.map((category, index) => (
                  <tr
                    key={category.category_id}
                    style={{ textAlign: "center" }}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`/assets/upload/product-category/${category.category_image}`}
                        alt="Category"
                        className="table_data_image"
                      />
                    </td>
                    <td>{truncateString(category.category_name, 40)}</td>
                    <td>{truncateString(category.category_title, 40)}</td>
                    <td>
                      {category.sub_category
                        ? (
                          getCategoryData.find(
                            (subCategory) =>
                              subCategory.category_id ===
                              category.sub_category
                          )?.category_name || ""
                        ).substring(0, 40)
                        : "null"}
                    </td>
                    <td>
                      <button
                        className="editbutton"
                        onClick={() => {
                          handleEditProdCate(category.category_id);
                        }}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        className="data_delete_btn"
                        onClick={() => openDeleteModal(category.category_id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                    <td>
                      {category.status === 1 ? (
                        <img
                          src="/assets/images/activeStatus.png"
                          alt="active"
                          className="status_btn"
                          onClick={() => {
                            catgoryStatusChange(category.category_id, 1);
                          }}
                        />
                      ) : (
                        <img
                          src="/assets/images/inActiveStatus.png"
                          alt="inActive"
                          className="status_btn"
                          onClick={() => {
                            catgoryStatusChange(category.category_id, 0);
                          }}
                        />
                      )}
                    </td>

                    {/* <td
                      style={{
                        paddingTop: "0px",
                        paddingBottom: "10px",
                        textAlign: "end",
                      }}
                    >
                      <span>
                        <button
                          className="editbutton"
                          // onClick={() => openEditModal(category.category_id)}
                          onClick={() => {
                            handleEditProdCate(category.category_id);
                          }}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      </span>
                      <label className="dropdown">
                        <div className="dd-button"></div>
                        <input
                          type="checkbox"
                          className="dd-input"
                          id={`test-${index}`}
                        />
                        <ul className="dd-menu">
                          <li
                            onClick={() =>
                              openDeleteModal(category.category_id)
                            }
                          >
                            Delete
                          </li>
                          <li
                            onClick={() => {
                              handleViewProdCate(category.category_id);
                            }}
                          >
                            View
                          </li>
                          <li>
                            {" "}
                            {category.status === 1 ? (
                              <button
                                onClick={() => {
                                  catgoryStatusChange(category.category_id, 1);
                                }}
                              >
                                Active
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  catgoryStatusChange(category.category_id, 0);
                                }}
                              >
                                Inactive
                              </button>
                            )}
                          </li>
                        </ul>
                      </label>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" align="center">
                    data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default ProductCategory;
