import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import axios from "axios";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import { useRouter } from "next/router";

const EditTestimonial = () => {
  // loading
  const [loading, setLoading] = useState(false);

  // set the edit testimonial data state
  const [editTestimonialData, setEditTestimonialData] = useState({
    testimonial_title: "",
    testimonial_desc: "",
    testimonial_image: null,
    testimonial_video: "",
    testimonial_rating: 1,
    product_id: "",
  });
  // get per testimonial data start
  const router = useRouter();

  let testimonialId = router.query.id;

  // fetch testimonial data into database
  useEffect(() => {
    const getPerTestimonialData = async (id) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/testimonial/${id}`;
        const response = await axios.get(url);
        const fetchedData = response.data[0];
        setEditTestimonialData({
          ...fetchedData,
          testimonial_rating: fetchedData.rating,
          product_id: parseInt(fetchedData.product_id), // it's a number
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

  // editor start
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setEditTestimonialData((prevData) => ({
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

    setEditTestimonialData((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));

    setSelectedImage(file);
  };
  // file handle end

  // rating code start
  const [ratingSlider, setRatingSlider] = useState(1); // Set a default value

  const handleStarClick = (selectedRating) => {
    const roundedRating = parseFloat(selectedRating.toFixed(1));
    setEditTestimonialData((prevData) => ({
      ...prevData,
      testimonial_rating: roundedRating,
    }));
    setRatingSlider(roundedRating);
  };

  const generateStars = (selectedRating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starStyle = {
        color: i <= Math.floor(selectedRating) ? "#f8d64e" : "#ddd",
        display: "inline-block",
        fontSize: "24px",
        cursor: "pointer",
        marginRight: "5px",
      };

      // If the decimal part is greater than 0.2 and less than 0.8, show a half star
      if (i === Math.floor(selectedRating) + 1 && selectedRating % 1 >= 0.5) {
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

  // rating code end

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
      const formData = new FormData();
      formData.append(
        "testimonial_title",
        editTestimonialData.testimonial_title
      );
      formData.append("testimonial_desc", editorRef.current.getContent());
      formData.append(
        "testimonial_image",
        editTestimonialData.testimonial_image
      );
      formData.append(
        "testimonial_video",
        editTestimonialData.testimonial_video
      );
      formData.append("testimonial_rating", ratingSlider);

      formData.append("product_id", editTestimonialData.product_id);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/testimonial/${testimonialId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      router.push("/admin/testimonial");
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
          <p className="admin_page_header">Edit Testimonial</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Testimonial</span>
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

              {/* Description */}
              <div className="mb-3">
                <p className="modal_label">Testimonial Description:-</p>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={editTestimonialData?.testimonial_desc}
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
                    ( *Only jpg, png, webp and jpeg file supported)
                  </span>
                </label>
                {/* Display the selected image immediately */}
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    width="100px"
                    height="100px"
                    alt="profile"
                  />
                ) : (
                  <img
                    src={`/assets/upload/testimonial/${editTestimonialData?.testimonial_image}`}
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
                  placeholder="Enter Testimonial Title"
                  value={editTestimonialData?.testimonial_video}
                  onChange={handleChangeTestimonial}
                />
              </div> */}

              {/* Rating Slider */}
              <div className="mb-3">
                <label htmlFor="testimonial_rating" className="modal_label">
                  Testimonial Rating:-
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{generateStars(ratingSlider)}</span>
                  <input
                    type="range"
                    id="testimonial_rating"
                    name="testimonial_rating"
                    min="1"
                    max="5"
                    step="0.5"
                    value={ratingSlider}
                    onChange={(e) =>
                      setRatingSlider(parseFloat(e.target.value))
                    }
                  />
                  <p>{ratingSlider} Rating</p>
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
                  value={loading ? "Editing..." : "SAVE"}
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

export default EditTestimonial;
