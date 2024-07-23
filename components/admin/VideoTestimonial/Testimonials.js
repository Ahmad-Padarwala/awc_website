import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/layouts/Header";
import { useRouter } from "next/router";
import axios from "axios";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";
import Loading from "@/layouts/Loading";
import DeleteModal from "@/layouts/DeleteModal";
import ViewModal from "../ViewModal";

const Testimonials = () => {
  //filter code Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value

  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilterdTestimonial(
      getAllTestimonial.filter((e) => {
        let data = e.title.toLowerCase(); // Convert to lowercase
        return data.includes(filterValue.toLowerCase()); // Case-insensitive search
      })
    );
  }, [filterValue]);
  // filter code End

  // set states start
  const router = useRouter();
  const [filterdTestimonial, setFilterdTestimonial] = useState([]);
  const [getAllTestimonial, setGetAllTestimonial] = useState([]);
  const [loading, setLoading] = useState(true);
  // set states end

  //get or fetch all testimonial data start
  const getAllTestimonialData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/videotestimonial/router`)
      .then((res) => {
        setGetAllTestimonial(res.data);
        setFilterdTestimonial(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all testimonial data
  useEffect(() => {
    getAllTestimonialData();
  }, []);
  //get or fetch all testimonial data end


  // status code start
  const testimonialStatusChange = async (testimonialId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/videotestimonial/statuschanges/${testimonialId}/${no}`
      );
      getAllTestimonialData();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  // status code end

  // move edit testimonial page code start
  const handleEditTestimonial = (testimonialId) => {
    setLoading(true);
    router.push(`/admin/videotestimonial/edit-testimonial?id=${testimonialId}`);
  };
  // move edit testimonial page code end

  // handle delete testimonial start
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // open the modal
  const openDeleteModal = (deleteTestimonialId) => {
    setDeleteId(deleteTestimonialId);
    setIsDeleteModalOpen(true);
  };

  // close the modal
  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // delete the record
  const deleteTestimonial = () => {
    if (deleteId) {
      deleteTestimonialData(deleteId);
      closeDeleteModal();
    }
  };

  // delete code generate
  const deleteTestimonialData = async (deleteTestimonialId) => {
    setLoading(true);
    console.log(deleteTestimonialId);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/videotestimonial/${deleteTestimonialId}`
      );
      // Move closeDeleteModal and SuccessToast here to ensure they are called after the deletion is successful
      closeDeleteModal();
      SuccessToast("Testimonial Deleted Successfully");
      getAllTestimonialData();
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  // handle delete testimonial end

  //get or fetch all product data start
  const [getProductData, setGetProductData] = useState([]);

  const getAllProductData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products/router`)
      .then((res) => {
        setGetProductData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all product data
  useEffect(() => {
    getAllProductData();
  }, []);
  //get or fetch all product data end


  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Video Testimonial</p>
            <p style={{ paddingBottom: "10px" }} className="sitemap">
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i
                className="fa-solid fa-angles-right angles"
                style={{ paddingBottom: "3px" }}
              ></i>
              <span>Video Testimonial</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/videotestimonial/add-testimonial">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Testimonial
              </button>
            </Link>
          </div>
        </div>
        <div className="admin_category_table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "10%", textAlign: "center" }}>ID</th>
                <th style={{ width: "20%", textAlign: "center" }}>TITLE</th>
                <th style={{ width: "20%", textAlign: "center" }}>PRODUCT</th>
                <th style={{ width: "20%", textAlign: "center" }}>Link</th>
                <th style={{ width: "15%", textAlign: "center" }}>ACTION</th>
                <th style={{ width: "7%", textAlign: "center" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filterdTestimonial.length > 0 ? (
                filterdTestimonial.map((testimonial, index) => (
                  <tr key={testimonial.id} style={{ textAlign: "center" }}>
                    {/* ID */}
                    <td>{index + 1}</td>

                    {/* Image */}
                    <td>
                     
                    {testimonial.title}
                    </td>
                    {/* Product Title */}
                    <td>
                      {getProductData.map(
                        (product) =>
                          product.product_id === testimonial.product_id && (
                            <span key={product.product_id}>
                              {product.product_title}
                            </span>
                          )
                      )}
                    </td>

                    {/* Title */}
                    <td>{testimonial.link}</td>

                    {/* Handle Operation that you want to perform */}
                    <td>
                      <span>
                        <button
                          className="editbutton"
                          onClick={() => {
                            handleEditTestimonial(testimonial.id);
                          }}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button
                          className="data_delete_btn"
                          onClick={() => openDeleteModal(testimonial.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </span>
                    </td>

                    {/* Status  */}
                    <td>
                      {testimonial.status === 1 ? (
                        <img
                          src={"/assets/images/activeStatus.png"}
                          className="status_btn"
                          onClick={() => {
                            testimonialStatusChange(testimonial.id, 1);
                          }}
                          alt="active"
                        />
                      ) : (
                        <img
                          src={"/assets/images/inActiveStatus.png"}
                          className="status_btn"
                          onClick={() => {
                            testimonialStatusChange(testimonial.id, 0);
                          }}
                          alt="inActive"
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                // If data is not available in database so show this message
                <tr>
                  <td colSpan="5" align="center">
                    data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* delete modal component */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteTestimonial}
          itemType="Testimonial"
          itemId={deleteId}
        />

        {/* Show the Toast notification */}
        <Toast />

        
      </section>
    </>
  );
};

export default Testimonials;
