import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import axios from "axios";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import { useRouter } from "next/router";

const AddTestimonial = () => {
  const starArray = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // handle state for add data
  const [addTestimonialData, setAddTestimonialData] = useState({
    testimonial_title: "",
    testimonial_desc: "",
    testimonial_image: null,
    testimonial_video: "",
    testimonial_rating: 1,
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

  // editor start
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setAddTestimonialData((prevData) => ({
      ...prevData,
      testimonial_desc: content,
    }));
  };
  // editor end

  // file handle start
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    // Check if the file has a valid extension
    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      // Reset the input value to clear the invalid file
      event.target.value = "";
      ErrorToast("Please add the JPG, JPEG, PNG & WEBP format file");
      return;
    }

    setAddTestimonialData((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));

    setSelectedImage(file);
  };
  // file handle end

  // rating start
  const handleStarClick = (selectedRating) => {
    setAddTestimonialData((prevData) => ({
      ...prevData,
      testimonial_rating: selectedRating,
    }));
  };

  const generateStars = () => {
    const rating = addTestimonialData.testimonial_rating;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starStyle = {
        color: i <= Math.floor(rating) ? "#f8d64e" : "#ddd",
        display: "inline-block",
        fontSize: "24px",
        cursor: "pointer",
        marginRight: "5px",
      };

      // If the decimal part is greater than 0.2 and less than 0.8, show a half star
      if (
        i === Math.floor(rating) + 1 &&
        rating % 1 > 0.2 &&
        rating % 1 < 0.8
      ) {
        starStyle.background =
          "linear-gradient(to right, yellow 50%, black 50%)";
        starStyle.WebkitBackgroundClip = "text";
        starStyle.color = "transparent";
      }

      stars.push(
        <span key={i} style={starStyle} onClick={() => handleStarClick(i)}>
          &#9733;
        </span>
      );
    }

    return stars;
  };
  // rating end

  // add data into testimonial database table
  const addData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    // Check for validation errors and add messages to the array
    if (addTestimonialData.product_id === "") {
      ErrorToast("Please Select the Product");
      setLoading(false);
      return;
    } else if (addTestimonialData.testimonial_title === "") {
      ErrorToast("Please Enter the Testimonial Title");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "testimonial_title",
        addTestimonialData.testimonial_title
      );
      formData.append("testimonial_desc", editorRef.current.getContent());
      formData.append(
        "testimonial_image",
        addTestimonialData.testimonial_image
      );
      formData.append(
        "testimonial_video",
        addTestimonialData.testimonial_video
      );
      formData.append(
        "testimonial_rating",
        addTestimonialData.testimonial_rating
      );
      formData.append("product_id", addTestimonialData.product_id);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonial/router`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      router.push("/admin/testimonial");
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
          <p className="admin_page_header">Add Testimonial</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Testimonial</span>
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

              {/* Description */}
              <div className="mb-3">
                <p className="modal_label">Testimonial Description:-</p>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                  }}
                  onChange={handleEditorChange}
                />
              </div>

              {/* Image */}
              <div className="mb-3">
                <label htmlFor="testimonial_image" className="modal_label">
                  Testimonial Image:-{" "}
                  <span style={{ color: "red" }}>
                    ( * Only jpg, png, jpeg & webp file supported)
                  </span>
                </label>
                {/* Display the selected image immediately */}
                {selectedImage && (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    width="100px"
                    height="100px"
                    alt="profile"
                  />
                )}
                <input
                  type="file"
                  id="testimonial_image"
                  name="testimonial_image"
                  className="modal_input"
                  onChange={handleFileChange}
                />
              </div>

              {/* Video */}
              {/* <div className="mb-3">
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
              </div> */}

              {/* Rating */}
              <div className="mb-3">
                <label htmlFor="testimonial_rating" className="modal_label">
                  Testimonial Rating:-
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* Range input */}
                  <input
                    type="range"
                    min={starArray[0]}
                    max={starArray[starArray.length - 1]}
                    step={0.5}
                    value={addTestimonialData.testimonial_rating}
                    onChange={(e) =>
                      handleStarClick(parseFloat(e.target.value))
                    }
                    onBlur={() =>
                      handleStarClick(addTestimonialData.testimonial_rating)
                    }
                  />
                  {/* Display selected rating */}
                  <p style={{ paddingLeft: "10px" }}>
                    {addTestimonialData.testimonial_rating}
                  </p>
                  {/* Display stars based on range input */}
                  <p style={{ paddingLeft: "10px" }}>{generateStars()}</p>
                </div>
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
                <Link href="/admin/testimonial">
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
