import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import axios from "axios";
import { useRouter } from "next/router";

const AddTestimonial = () => {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // handle state for add data
  const [addTestimonialData, setAddTestimonialData] = useState({
    testimonial_title: "",
    testimonial_video: "",
    product_id: "",
  });
  // handled the testimonial input values
  const handleChangeTestimonial = async (event) => {
    const { name, value } = event.target;
    setAddTestimonialData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };




  // add data into testimonial database table
  const addData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    // Check for validation errors and add messages to the array
    if (addTestimonialData.product_id === "" || addTestimonialData.product_id === 0) {
      ErrorToast("Please Select the Product");
      setLoading(false);
      return;
    } else if (addTestimonialData.testimonial_title === "") {
      ErrorToast("Please Enter the Testimonial Title");
      setLoading(false);
      return;
    }

    console.log(addTestimonialData);
    try {

      const data =  {
        testimonial_title : addTestimonialData.testimonial_title,
        testimonial_video : addTestimonialData.testimonial_video,
        product_id : addTestimonialData.product_id,
      }
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/videotestimonial/router`,
        data
      );

      router.push("/admin/videotestimonial");
      setLoading(false);
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
          <p className="admin_page_header">Add Video Testimonial</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Video Testimonial</span>
          </p>
        </div>

        <div className="tabs-container">
          <div
            className=".sub-tabs-container"
            style={{ backgroundColor: "white", padding: "20px" }}
          >
            <form method="post" onSubmit={addData}>
              {/* Product Category */}
              <div className="mb-3">
                <label htmlFor="product_id" className="modal_label">
                  <span style={{ color: "red" }}>*</span> Select Product:-
                </label>
                <select
                  id="product_id"
                  name="product_id"
                  className="modal_input"
                  onChange={handleChangeTestimonial}
                >
                  <option value="0">-- Select Product --</option>
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
                  <span style={{ color: "red" }}>*</span> Testimonial Title:-
                </label>
                <input
                  type="text"
                  id="testimonial_title"
                  name="testimonial_title"
                  className="modal_input"
                  placeholder="Enter Testimonial Title"
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
                  placeholder="Enter Testimonial Video Link"
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
                  value={loading ? "Adding..." : "SAVE"}
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

export default AddTestimonial;
