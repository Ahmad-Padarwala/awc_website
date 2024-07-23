import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast, {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "@/layouts/toast/Toast";

const EditGallery = ({ editedItem, onClose, onEditComplete }) => {
  const [loading, setLoading] = useState("");

  const [formData, setFormData] = useState({
    gallery_title: "",
    gallery_category: "",
    gallery_image: null,
    gallery_sort: "",
  });

  useEffect(() => {
    // Populate the form data with the edited item's values when it changes
    if (editedItem) {
      setFormData({
        gallery_title: editedItem.gallery_title,
        gallery_category: editedItem.gallery_category_id,
        gallery_image: editedItem.gallery_image,
        gallery_sort: editedItem.gallery_sort,
      });
    }
  }, [editedItem]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    setFormData((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));

    setSelectedImage(file);
  };
  // file handle end

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    if (formData.gallery_title === "") {
      ErrorToast("Please enter the gallery title");
      return;
    }

    if (formData.gallery_category === "") {
      ErrorToast("Please select gallery category");
      return;
    }

    try {
      // Create form data to send with the PUT request
      const updatedFormData = new FormData();
      updatedFormData.append("gallery_title", formData.gallery_title);
      updatedFormData.append("gallery_category", formData.gallery_category);
      updatedFormData.append("gallery_sort", formData.gallery_sort);

      // Append the new image if it's selected
      if (formData.gallery_image) {
        updatedFormData.append("gallery_image", formData.gallery_image);
      }

      // Perform the PATCH request to update the item
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/${editedItem.id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful update
      setLoading(false);
      onEditComplete(res.data);
      SuccessToast("Gallery Image Updated Successfully..");
    } catch (error) {
      setLoading(false);
      console.error("Error updating item:", error);
    }
  };

  //get or fetch all gallery category data start
  const [getAllGalleryCategory, setGetAllGalleryCategory] = useState([]);

  const getAllGalleryCategoryData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/router`)
      .then((res) => {
        setGetAllGalleryCategory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all gallery category data
  useEffect(() => {
    getAllGalleryCategoryData();
  }, []);
  //get or fetch all gallery category data end

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Edit Item : {editedItem.id}</h2>
        <a
          style={{
            position: "absolute",
            top: "10px",
            right: "30px",
            transition: "all 200ms",
            fontSize: 30,
            fontWeight: "bold",
            textDecoration: "none",
            color: "#6255f0",
            cursor: "pointer",
          }}
          href="#"
          onClick={onClose}
        >
          &times;
        </a>

        <form onSubmit={handleFormSubmit}>
          <label htmlFor="gallery_title">Title:</label>
          <input
            type="text"
            id="gallery_title"
            name="gallery_title"
            value={formData.gallery_title}
            onChange={handleInputChange}
          />

          <label htmlFor="gallery_category">Category:</label>
          <select
            id="gallery_category"
            name="gallery_category"
            value={formData.gallery_category}
            onChange={handleInputChange}
          >
            {getAllGalleryCategory.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_title}
              </option>
            ))}
          </select>

          <label htmlFor="gallery_image">Image:</label>
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
              src={`/assets/upload/gallery/${formData?.gallery_image}`}
              width="100px"
              height="100px"
              alt="profile"
            />
          )}
          <input
            type="file"
            id="gallery_image"
            name="gallery_image"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />

          <label htmlFor="gallery_sort">Sort:</label>
          <input
            type="number"
            id="gallery_sort"
            name="gallery_sort"
            value={formData.gallery_sort}
            onChange={handleInputChange}
          />

          <div className="popup-buttons">
            {/* <button type="submit">Save</button> */}
            <input
              type="submit"
              style={loading ? { cursor: "not-allowed" } : {}}
              className="success_btn"
              value={loading ? "Editing..." : "SAVE"}
              disabled={loading}
            />
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default EditGallery;
