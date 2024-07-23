import Header from "@/layouts/Header";
import Loading from "@/layouts/Loading";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import EditGallery from "./EditGallery";
import Toast, {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "@/layouts/toast/Toast";
import DeleteModal from "@/layouts/DeleteModal";
import { useRouter } from "next/router";

const Gallery = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to store selected category
  const [hoveredImage, setHoveredImage] = useState(null);
  const [filterdGallery, setFilterdGallery] = useState([]);

  //filter code Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value

  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilterdGallery(
      galleryData.filter((e) => {
        let data = e.gallery_title.toLowerCase(); // Convert to lowercase
        return data.includes(filterValue.toLowerCase()); // Case-insensitive search
      })
    );
  }, [filterValue]);
  // filter code End

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

  // get gallery data start
  const [galleryData, setGalleryData] = useState([]);

  const getGalleryData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/gallery/router`)
      .then((res) => {
        setGalleryData(res.data);
        setFilterdGallery(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };
  // get gallery data end

  // fetch all gallery category data
  useEffect(() => {
    getAllGalleryCategoryData();
    getGalleryData();
  }, []);
  //get or fetch all gallery category data end

  // Display only images based on the selected category and search text
  const filteredGalleryData = filterdGallery.filter(
    (image) =>
      (selectedCategory
        ? image.gallery_category_id == selectedCategory
        : true) &&
      (filterValue
        ? image.gallery_title.toLowerCase().includes(filterValue.toLowerCase())
        : true)
  );
  // Handle edit operation start
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  const handleEdit = (itemId) => {
    // Find the item to edit
    const itemToEdit = galleryData.find((item) => item.id === itemId);
    setEditedItem(itemToEdit);
    setShowEditPopup(true);
  };

  // Close the edit popup
  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditedItem(null);
  };

  // Logic to update the data after editing
  const handleEditComplete = (updatedItem) => {
    closeEditPopup();
    getGalleryData();
  };
  // Handle edit operation end

  // handle delete gallery image start
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // open the modal
  const openDeleteModal = (deleteGalleryImageId) => {
    setDeleteId(deleteGalleryImageId);
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
      handleDelete(deleteId);
      closeDeleteModal();
    }
  };

  // Handle delete operation start
  const handleDelete = async (deleteGalleryImageId) => {
    try {
      // Perform the DELETE request to update the item
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/${deleteGalleryImageId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check the status code of the response
      if (res.status === 200) {
        const updatedGalleryData = galleryData.filter(
          (item) => item.id !== deleteGalleryImageId
        );
        setGalleryData(updatedGalleryData);
        setFilterdGallery(updatedGalleryData);

        (async () => {
          await SuccessToast("Gallery Image Deleted Successfully");
        })();
      } else {
        (async () => {
          await ErrorToast("Gallery Image could not be deleted");
        })();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle edit operation end

  // handle delete all data category wise start
  const handleDeleteAllInCategory = async () => {
    // Check if a category is selected
    if (!selectedCategory) {
      ErrorToast("Please select a category");
      return;
    }

    try {
      // Make a DELETE request to the new API route
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/gallery/${selectedCategory}`
      );

      console.log(res);

      if (res.status === 200) {
        SuccessToast("All Items in Category Deleted Successfully");
        getGalleryData();
      } else {
        ErrorToast("Error deleting items in the category");
      }
    } catch (error) {
      console.error("Error deleting items in the category:", error);
    }
  };
  // move edit all gallery page code start
  const handleEditAllInCategory = (categoryId) => {
    // Check if a category is selected
    if (!selectedCategory) {
      ErrorToast("Please select a category");
      return;
    }

    setLoading(true);
    router.push(`/admin/gallery/edit-gallery?id=${categoryId}`);
  };
  // move edit all gallery page code end

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Gallery</p>
            <p style={{ paddingBottom: "10px" }} className="sitemap">
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i
                className="fa-solid fa-angles-right angles"
                style={{ paddingBottom: "3px" }}
              ></i>
              <span>Gallery</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/gallery/gallery-category">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Category
              </button>
            </Link>

            <Link href="/admin/gallery/add-gallery">
              <button type="button" style={{ marginLeft: "20px" }}>
                <i className="fa-solid fa-plus"></i>Add Images
              </button>
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px 20px 0 20px",
          }}
        >
          <div className="dropdown-container">
            <label htmlFor="categoryDropdown">Gallery Categories : </label>
            <select
              id="categoryDropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- All Category --</option>
              {getAllGalleryCategory.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_title}
                </option>
              ))}
            </select>
          </div>
          <div className="button-container">
            <div>
              <button
                onClick={handleDeleteAllInCategory}
                className="delete-button"
                disabled={filteredGalleryData.length === 0} // Disable if no records found
              >
                <span style={{ marginRight: "5px", fontSize: "12px" }}>
                  <i className="fa-solid fa-trash-can"></i>
                </span>
                Delete All Records
              </button>
            </div>
            <button
              onClick={() => handleEditAllInCategory(selectedCategory)}
              className="edit-button"
              disabled={filteredGalleryData.length === 0} // Disable if no records found
            >
              <span style={{ marginRight: "5px", fontSize: "12px" }}>
                <i className="fa-solid fa-pencil"></i>
              </span>
              Edit All Records
            </button>
          </div>
        </div>

        <div className="gallery-container">
          {filteredGalleryData.length > 0 ? (
            filteredGalleryData.map((data) => (
              <div
                key={data.id}
                className="gallery-card"
                onMouseEnter={() => setHoveredImage(data.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <img
                  src={`/assets/upload/gallery/${data.gallery_image}`}
                  alt={data.gallery_title}
                  style={{ width: "200px", height: "220px" }}
                />
                {hoveredImage === data.id && (
                  <div className="image-title-overlay">
                    <p>{data.gallery_title}</p>
                  </div>
                )}
                <div className="card-buttons">
                  <button
                    onClick={() => handleEdit(data.id)}
                    className="edit-button"
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    onClick={() => openDeleteModal(data.id)}
                    className="delete-button"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                margin: "auto",
                height: "20vh",
              }}
            >
              <img src="/assets/images/no-data.png" alt="No Data Found" />
            </div>
          )}
        </div>
        {/* delete modal component */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteTestimonial}
          itemType="Gallery"
          itemId={deleteId}
        />

        {/* Render the EditPopup component conditionally */}
        {showEditPopup && (
          <EditGallery
            editedItem={editedItem}
            onClose={closeEditPopup}
            onEditComplete={handleEditComplete}
          />
        )}
      </section>
      <Toast />
    </>
  );
};

export default Gallery;
