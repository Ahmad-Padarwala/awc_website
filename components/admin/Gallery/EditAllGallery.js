import Header from "@/layouts/Header";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Toast, {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "@/layouts/toast/Toast";
import axios from "axios";
import { useRouter } from "next/router";

const EditAllGallery = () => {
  const router = useRouter();
  let id = router.query;
  const categoryId = id.id;
  const [loading, setLoading] = useState(false);

  const [formDataArray, setFormDataArray] = useState([]);

  // State to track selected images
  const [selectedImages, setSelectedImages] = useState(
    Array(formDataArray.length).fill(null)
  );

  useEffect(() => {
    // Fetch data for the given category and set it in formDataArray
    const fetchDataForCategory = async () => {
      try {
        // Fetch data for the category using id
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/gallery/${categoryId}`
        );
        // Assuming the response contains an array of items
        setFormDataArray(response.data);
        // Initialize selectedImages array with null for each item
        setSelectedImages(Array(response.data.length).fill(null));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataForCategory();
  }, [categoryId]);

  const handleInputChange = (index, key, value) => {
    // Check if the key is 'gallery_category' and update selectedImages accordingly
    if (key === "gallery_category") {
      // Reset the selected image when the category is changed
      setSelectedImages(selectedImages);
    }

    // Check if the key is 'gallery_image' and the value is not changed
    if (key === "gallery_image" && value === null) {
      // Set the existing image value for that index
      setFormDataArray((prevData) => {
        const newData = [...prevData];
        newData[index][key] = formDataArray[index][key];
        return newData;
      });
    } else {
      // Update the form data for the specified index
      setFormDataArray((prevData) => {
        const newData = [...prevData];
        newData[index][key] = value;
        return newData;
      });
    }
  };

  const handleFileChange = async (event, index) => {
    const file = event.target.files[0];
    setFormDataArray((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        gallery_image: file,
        gallery_category_id: newData[index].gallery_category, // Update category ID
      };
      return newData;
    });

    // Update selectedImages state with the selected image
    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = [...prevSelectedImages];
      newSelectedImages[index] = file;
      return newSelectedImages;
    });
  };

  const handleEditAllItems = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create an array to store error messages
    const errors = [];
    // Validate each item
    formDataArray.forEach((item, index) => {
      if (!item.gallery_title.trim()) {
        errors.push(`Please enter the gallery title for record ${index + 1}`);
      }
    });

    // Display errors if any
    if (errors.length > 0) {
      errors.forEach((error) => {
        ErrorToast(error);
      });
      return; // Stop further processing if there are errors
    }

    try {
      // Assuming `formDataArray` contains all the necessary data for each item
      const updateRequests = formDataArray.map(async (item, index) => {
        const updatedFormData = new FormData();
        updatedFormData.append("gallery_title", item.gallery_title);
        // Check if gallery_category is defined before appending it
        if (item.gallery_category !== undefined) {
          updatedFormData.append("gallery_category", item.gallery_category);
        } else {
          // If gallery_category is not selected, set it to a default category ID
          const defaultCategoryId = categoryId; // Change this to your default category ID
          updatedFormData.append("gallery_category", defaultCategoryId);
        }

        updatedFormData.append("gallery_sort", item.gallery_sort);
        // Append the existing image value if it's not changed
        if (!selectedImages[index]) {
          updatedFormData.append("gallery_image", item.gallery_image);
        } else {
          // Append the new image if it's selected
          const selectedImage = selectedImages[index];
          updatedFormData.append("gallery_image", selectedImage);
        }
        // Perform the PATCH request to update the item
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/gallery/${item.id}`,
          updatedFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return res.data;
      });

      // Wait for all update requests to complete
      await Promise.all(updateRequests);

      // Handle successful update
      SuccessToast("Gallery Items Updated Successfully.");
      router.push("/admin/gallery");
      setLoading(false); 
    } catch (error) {
      setLoading(false);
      console.error("Error updating items:", error);
    }
  };

  //get or fetch all gallery category data start
  const [getAllGalleryCategory, setGetAllGalleryCategory] = useState([]);

  const getAllGalleryCategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/router`
      );
      setGetAllGalleryCategory(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  // fetch all gallery category data
  useEffect(() => {
    getAllGalleryCategoryData();
  }, []);

  return (
    <>
      <section className="home-section">
        <Header onFilterChange={() => { }} />
        <div className="admin_page_top">
          <p className="admin_page_header">Edit Items</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Items</span>
          </p>
        </div>

        <div className="add_data_form">
          <form method="post" onSubmit={handleEditAllItems}>
            <table
              className="admin_category_table"
              style={{ marginTop: "1rem" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>IMAGE</th>
                  <th style={{ width: "25%" }}>TITLE</th>
                  <th style={{ width: "40%" }}>CATEGORY</th>
                  <th style={{ width: "25%" }}>SORTING</th>
                </tr>
              </thead>
              <tbody>
                {formDataArray.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {/* Display the selected image and file input */}
                      <div className="image-container">
                        <div
                          className="overlay"
                          onClick={() =>
                            document
                              .getElementById(`gallery_image_input_${index}`)
                              .click()
                          }
                        >
                          <i
                            className={`fa-solid fa-image ${selectedImages[index] ? "visible" : ""
                              }`}
                          ></i>
                        </div>
                        <img
                          src={
                            selectedImages[index]
                              ? URL.createObjectURL(selectedImages[index])
                              : item.gallery_image
                                ? `/assets/upload/gallery/${item.gallery_image}`
                                : URL.createObjectURL(selectedImages[index]) // Provide a placeholder image path if needed
                          }
                          width="100px"
                          height="100px"
                          alt="profile"
                        />

                        <input
                          type="file"
                          id={`gallery_image_input_${index}`}
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, index)}
                        />
                      </div>
                    </td>

                    <td>
                      <input
                        type="text"
                        id={`gallery_title_${index}`}
                        name={`gallery_title_${index}`}
                        className="modal_input"
                        placeholder={`Enter Gallery Title ${index + 1}`}
                        value={item.gallery_title}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "gallery_title",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <select
                        id={`gallery_category_${index}`}
                        name={`gallery_category_${index}`}
                        defaultValue={item.gallery_category_id}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "gallery_category",
                            e.target.value
                          )
                        }
                      >
                        {getAllGalleryCategory.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_title}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        id={`gallery_sort_${index}`}
                        name={`gallery_sort_${index}`}
                        className="modal_input"
                        placeholder={`Gallery Sorting ${index + 1}`}
                        value={item.gallery_sort}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "gallery_sort",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5">
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
              <Link href="/admin/gallery">
                <button type="button" className="success_btn cancel_btn">
                  CANCEL
                </button>
              </Link>
            </div>
          </form>
        </div>
        <Toast />
      </section>

      <style jsx global>{`
        .image-container {
          position: relative;
          cursor: pointer;
        }

        .image-container img {
          width: 100px;
          height: 100px;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .overlay:hover {
          opacity: 1;
        }

        .overlay i {
          font-size: 24px;
        }
      `}</style>
    </>
  );
};

export default EditAllGallery;
