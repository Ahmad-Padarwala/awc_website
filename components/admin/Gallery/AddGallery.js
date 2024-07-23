import Header from "@/layouts/Header";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import axios from "axios";
import { useRouter } from "next/router";

const AddGallery = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Change to use addMultiImages for managing multiple images
  const [addMultiImages, setAddMultiImages] = useState({
    gallery_images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCategories, setImageCategories] = useState([]);

  // drag-drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // handled the gallery category values start
  const handleCategoryChange = (e, index) => {
    const selectedCategoryTitle = e.target.value;

    const isCategorySelected = imageCategories[index]?.some(
      (category) => category.category_title === selectedCategoryTitle
    );

    e.target.value = "";

    if (!isCategorySelected) {
      const selectedCategory = getAllGalleryCategory.find(
        (category) => category.category_title === selectedCategoryTitle
      );

      if (selectedCategory) {
        const updatedCategories = [...imageCategories];
        updatedCategories[index] = [
          ...(updatedCategories[index] || []),
          selectedCategory,
        ];

        setImageCategories(updatedCategories);
        e.target.value = "";
      }
    }
  };

  const handleRemoveCategory = (index, categoryId) => {
    const updatedCategories = [...imageCategories];
    updatedCategories[index] = updatedCategories[index].filter(
      (category) => category.id !== categoryId
    );
    setImageCategories(updatedCategories);
  };
  // handled the gallery category values end

  // Add multiple images and multiple categories handler
  const handleAddMultipleImagesChange = (event) => {
    const files = event.target.files;

    // Filter out non-image files
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    // Check if any non-image files were selected
    const nonImageFiles = Array.from(files).filter(
      (file) => !file.type.startsWith("image/")
    );

    if (nonImageFiles.length > 0) {
      ErrorToast("Only image files are taken from given files.");
    }

    const newImages = imageFiles.map((file) => ({
      file,
      category: "", // Initialize category as an empty string
      sort: "", // Initialize sort as an empty string
    }));

    // Change to use addMultiImages.gallery_images
    setAddMultiImages((prevImages) => ({
      ...prevImages,
      gallery_images: [...prevImages.gallery_images, ...newImages],
    }));

    const newPreviews = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === imageFiles.length) {
          setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(imageFiles[i]);
    }
  };

  // Function to handle the removal of an image
  const handleRemoveImage = (index) => {
    // Update addMultiImages state
    setAddMultiImages((prevImages) => {
      const updatedImages = [...prevImages.gallery_images];
      updatedImages.splice(index, 1); // Remove the image at the specified index
      return { gallery_images: updatedImages };
    });

    // Update imagePreviews state
    setImagePreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews];
      updatedPreviews.splice(index, 1); // Remove the preview at the specified index
      return updatedPreviews;
    });

    // Update imageCategories state
    setImageCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories.splice(index, 1); // Remove the categories at the specified index
      return updatedCategories;
    });
  };

  const handleChangeTitle = (e, index) => {
    const newGalleryData = [...addMultiImages.gallery_images];
    newGalleryData[index].category = e.target.value;

    // Change to use setAddMultiImages
    setAddMultiImages((prevImages) => ({
      ...prevImages,
      gallery_images: newGalleryData,
    }));
  };

  const handleChangeSorting = (e, index) => {
    const newGalleryData = [...addMultiImages.gallery_images];
    newGalleryData[index].sort = e.target.value;

    // Change to use setAddMultiImages
    setAddMultiImages((prevImages) => ({
      ...prevImages,
      gallery_images: newGalleryData,
    }));
  };

  // Save gallery data with multiple images and categories
  const addData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    // Check for validation errors and add messages to the array
    if (addMultiImages.gallery_images.length === 0) {
      ErrorToast("No files selected. Please select at least one image");
    }

    // Create an array to store error messages
    const errors = [];

    // Function to validate each image
    const validateImage = async (image, index) => {
      if (!image.category) {
        errors.push(`Please enter the gallery title for image ${index + 1}`);
      }

      if (!imageCategories[index] || imageCategories[index].length === 0) {
        errors.push(
          `Please select at least one category for image ${index + 1}`
        );
      }

      if (!image.file) {
        errors.push(`Please select an image for image ${index + 1}`);
      }

      // Display errors if any for the current image
      if (errors.length > 0) {
        ErrorToast(errors[0]); // Display the first error for the current image
        setLoading(false);
        return false;
      }

      return true;
    };

    // Iterate through each image and validate
    for (let index = 0; index < addMultiImages.gallery_images.length; index++) {
      const isValid = await validateImage(
        addMultiImages.gallery_images[index],
        index
      );

      if (!isValid) {
        return; // Stop processing further images if the current one has errors
      }

      // Continue processing for the current image...
    }

    try {
      const formData = new FormData();

      addMultiImages.gallery_images.forEach((image, index) => {
        formData.append(`gallery_images`, image.file);
        formData.append(`gallery_title_${index}`, image.category);
        formData.append(`gallery_sort_${index}`, image.sort);

        // Append all category IDs associated with the current image
        imageCategories[index].forEach((category, categoryIndex) => {
          formData.append(
            `gallery_categories_${index}_${categoryIndex}`,
            category.id
          );
        });
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/router`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      router.push("/admin/gallery");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
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

  // Function to handle the drag enter event
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  // Function to handle the drag leave event
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Function to handle the drop event
  const handleDrop = (e) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    // Add the dropped files to the state
    handleAddMultipleImagesChange({ target: { files } });

    setIsDragOver(false);
  };

  return (
    <>
      <section className="home-section">
        <Header onFilterChange={() => { }} />
        <div className="admin_page_top">
          <p className="admin_page_header">Add Images</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Images</span>
          </p>
        </div>

        <div className="tabs-container">
          <div
            className=".sub-tabs-container"
            style={{ backgroundColor: "white", padding: "20px" }}
          >
            <form method="post" onSubmit={addData}>
              <div
                className={`drag-drop-area ${isDragOver ? "drag-over" : ""}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
              >
                <p>Drag & Drop Images Here</p>
                <span>or</span>
                <input
                  type="file"
                  id="gallery_image"
                  name="gallery_image"
                  className="modal_input"
                  onChange={handleAddMultipleImagesChange}
                  multiple
                />
                <p>(Only jpg, png, webp, and jpeg files supported)</p>
              </div>

              {/* Display images in a table */}
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
                    <th style={{ width: "5%" }}>OPERATION</th>
                  </tr>
                </thead>
                <tbody>
                  {imagePreviews.map((preview, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          style={{ width: "100px", height: "75px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          id={`gallery_title_${index}`}
                          name={`gallery_title_${index}`}
                          className="modal_input"
                          placeholder={`Enter Gallery Title ${index + 1}`}
                          onChange={(e) => handleChangeTitle(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          list={`categories_${index}`}
                          name={`cate_id_${index}`}
                          id={`cate_id_${index}`}
                          className="modal_input"
                          placeholder="Choose Category"
                          onChange={(e) => handleCategoryChange(e, index)}
                        />
                        <datalist id={`categories_${index}`}>
                          {getAllGalleryCategory.map((category) => (
                            <option
                              key={category.id}
                              value={category.category_title}
                            />
                          ))}
                        </datalist>
                        <ul
                          className="selected-categories"
                          style={{
                            listStyleType: "none",
                            padding: "10px",
                          }}
                        >
                          {(imageCategories[index] || []).map((category) => (
                            <li key={category.id}>
                              {category.category_title}
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveCategory(index, category.id)
                                }
                              >
                                <i
                                  className="fa-solid fa-circle-minus"
                                  style={{
                                    color: "red",
                                    paddingLeft: "20px",
                                    fontSize: "20px",
                                  }}
                                ></i>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <input
                          type="number"
                          id={`gallery_sort_${index}`}
                          name={`gallery_sort_${index}`}
                          className="modal_input"
                          placeholder={`Gallery Sorting ${index + 1}`}
                          onChange={(e) => handleChangeSorting(e, index)}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="remove_multi_img_btn"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
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
                  value={loading ? "Adding..." : "SAVE"}
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
        </div>
        <Toast />
      </section>

      <style jsx global>{`
        .drag-drop-area {
          border: 2px dashed #ccc;
          border-radius: 5px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }

        .drag-drop-area.drag-over {
          border-color: #4caf50;
        }

        .selected-categories li {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }

        .selected-categories button {
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default AddGallery;
