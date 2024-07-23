import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import axios from "axios";
import { useRouter } from "next/router";

const EditTestimonial = () => {
  // loading
  const [loading, setLoading] = useState(false);

  // set the edit testimonial data state
  const [editTestimonialData, setEditTestimonialData] = useState({
    testimonial_title: "",
    testimonial_video: "",
    product_id: "",
  });
  // get per testimonial data start
  const router = useRouter();

  let testimonialId = router.query.id;

  // fetch testimonial data into database
  useEffect(() => {
    const getPerTestimonialData = async (id) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/videotestimonial/${id}`;
        const response = await axios.get(url);
        const fetchedData = response.data[0];
        console.log(response.data[0])
        setEditTestimonialData({
          testimonial_title: response.data[0].title,
          testimonial_video: response.data[0].link,
          product_id:parseInt(fetchedData.product_id),
        });
        setRatingSlider(parseFloat(fetchedData.rating.toFixed(1))); // Set the initial ratingSlider state
        setLoading(false);
      } catch (err) {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      }
    };

    getPerTestimonialData(testimonialId);
  }, [testimonialId]);
  // get per testimonial data end

  // handled the testimonial input values start
  const handleChangeTestimonial = async (event) => {
    const { name, value } = event.target;
    setEditTestimonialData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // handled the testimonial input values end






  // edit data into testimonial database table
  const editData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    // Create an array to store error messages
    const errors = [];

    // Check for validation errors and add messages to the array
    if (editTestimonialData.testimonial_title === "") {
      errors.push("Please Enter the Testimonial Title");
    }
    if (editTestimonialData.product_id === "") {
      errors.push("Please Select the Product");
    }

    // Display errors if any and prevent form submission
    if (errors.length > 0) {
      errors.forEach((errorMsg) => {
        ErrorToast(errorMsg);
      });
      setLoading(false);
      return;
    }

    try {
      const data =  {
        testimonial_title : editTestimonialData.testimonial_title,
        testimonial_video : editTestimonialData.testimonial_video,
        product_id : editTestimonialData.product_id,
      }
      
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/videotestimonial/${testimonialId}`,
        data
      );
      setLoading(false);
      router.push("/admin/videotestimonial");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

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
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Edit Video Testimonial</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Video Testimonial</span>
          </p>
        </div>

        <div className="tabs-container">
          <div
            className=".sub-tabs-container"
            style={{ backgroundColor: "white", padding: "20px" }}
          >
            <form method="post" onSubmit={editData}>
              {/* Product Category */}
              <div className="mb-3">
                <label htmlFor="product_id" className="modal_label">
                  <span style={{ color: "red" }}>*</span> Select Product:-
                </label>
                <select
                  id="product_id"
                  name="product_id"
                  className="modal_input"
                  value={editTestimonialData?.product_id}
                  onChange={handleChangeTestimonial}
                >
                  <option value="">-- Select Product --</option>
                  {getProductData.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.product_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="mb-3">
                <label htmlFor="product_title" className="modal_label">
                  Testimonial Title:-
                </label>
                <input
                  type="text"
                  id="testimonial_title"
                  name="testimonial_title"
                  className="modal_input"
                  placeholder="Enter Testimonial Title"
                  value={editTestimonialData?.testimonial_title}
                  onChange={handleChangeTestimonial}
                />
              </div>


              {/* Video */}
              <div className="mb-3">
                <label htmlFor="testimonial_video" className="modal_label">
                  Testimonial Video:-
                </label>
                <input
                  type="text"
                  id="testimonial_video"
                  name="testimonial_video"
                  className="modal_input"
                  placeholder="Enter Testimonial Title"
                  value={editTestimonialData?.testimonial_video}
                  onChange={handleChangeTestimonial}
                />
              </div>

              {/* Handle Button Save and Cancle */}
              <div className="mb-3">
                {/* <button type="submit" className="success_btn">
                  SAVE
                </button> */}
                <input
                  type="submit"
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Editing..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/videotestimonial">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
        <Toast />
      </section>
    </>
  );
};

export default EditTestimonial;
