import Header from "@/layouts/Header";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";
import axios from "axios";
import DeleteModal from "@/layouts/DeleteModal";

const GalleryCategory = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [galleryCategoryId, setGalleryCategoryId] = useState(null);

  const [addEditGalleryCategoryData, setAddEditGalleryCategoryData] = useState({
    category_title: "",
  }); // state for add and edit data

  // handled the gallery category values
  const handleChangeGalleryCategory = async (event) => {
    const { name, value } = event.target;
    setAddEditGalleryCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    if (addEditGalleryCategoryData.category_title === "") {
      ErrorToast("Please Enter the Gallery Category");
      return;
    }

    try {
      const data = {
        category_title: addEditGalleryCategoryData.category_title,
      };

      if (editMode) {
        // If in edit mode, send a PATCH request
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/${galleryCategoryId}`,
          data
        );
        setAddEditGalleryCategoryData((prevData) => ({
          ...prevData,
          category_title: "",
        }));
        setLoading(false);
        SuccessToast("Gallery Category Updated Successfully");
      } else {
        // If not in edit mode, send a POST request
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/router`,
          data
        );

        // Check if the response has a message property
        if (res.data.message) {
          // Update state to clear the input field
          setAddEditGalleryCategoryData((prevData) => ({
            ...prevData,
            category_title: "",
          }));
          SuccessToast(res.data.message);
        }
      }

      // fetch gallery category data
      setLoading(false);
      getAllGalleryCategoryData();
    } catch (error) {
      setLoading(false);
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
      // Reset edit mode
      setEditMode(false);
    }
  };

  //get or fetch all gallery category data start
  const [filterdGalleryCategory, setFilterdGalleryCategory] = useState([]);
  const [getAllGalleryCategory, setGetAllGalleryCategory] = useState([]);

  const getAllGalleryCategoryData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/router`)
      .then((res) => {
        setGetAllGalleryCategory(res.data);
        setFilterdGalleryCategory(res.data);
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

  //filter code Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value

  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilterdGalleryCategory(
      getAllGalleryCategory.filter((e) => {
        let data = e.category_title.toLowerCase(); // Convert to lowercase
        return data.includes(filterValue.toLowerCase()); // Case-insensitive search
      })
    );
  }, [filterValue]);

  // filter code End

  // Handle editing a gallery category start
  const handleEditGalleryCategory = async (galleryCategoryId) => {
    setLoading(true);

    try {
      // Fetch category details
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/${galleryCategoryId}`
      );

      // Set galleryCategoryId and edit mode to true
      setGalleryCategoryId(galleryCategoryId);
      setEditMode(true);
      setLoading(false);

      // Update state with the retrieved category details
      setAddEditGalleryCategoryData({
        category_title: response.data[0].category_title,
      });
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  // Handle editing a gallery category end

  // handle delete gallery category start
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // open the modal
  const openDeleteModal = (deleteGalleryCategoryId) => {
    setDeleteId(deleteGalleryCategoryId);
    setIsDeleteModalOpen(true);
  };

  // close the modal
  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // delete the record
  const deleteGalleryCategory = () => {
    if (deleteId) {
      deleteGalleryCategoryData(deleteId);
      closeDeleteModal();
    }
  };

  // delete code generate
  const deleteGalleryCategoryData = async (deleteGalleryCategoryId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/gallerycategory/${deleteGalleryCategoryId}`
      );
      // Move closeDeleteModal and SuccessToast here to ensure they are called after the deletion is successful
      closeDeleteModal();
      SuccessToast("Gallery Category Deleted Successfully");
      getAllGalleryCategoryData();
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  // handle delete gallery category end

  return (
    <>
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <p className="admin_page_header"> Gallery Category</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span> Gallery Category</span>
          </p>
        </div>

        <div style={{ display: "flex" }}>
          <div className="admin_category_table" style={{ width: "60%" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "15%", textAlign: "center" }}>ID</th>
                  <th style={{ width: "60%", textAlign: "center" }}>TITLE</th>
                  <th style={{ width: "25%", textAlign: "center" }}>ACTION</th>
                  {/* <th style={{ width: "10%", textAlign: "center" }}>STATUS</th> */}
                </tr>
              </thead>
              <tbody>
                {filterdGalleryCategory.length > 0 ? (
                  filterdGalleryCategory.map((category, index) => (
                    <tr key={category.id} style={{ textAlign: "center" }}>
                      {/* ID */}
                      <td>{index + 1}</td>

                      {/* Title */}
                      <td>{category.category_title}</td>

                      {/* Handle Operation that you want to perform */}
                      <td>
                        <span>
                          <button
                            className="editbutton"
                            onClick={() => {
                              handleEditGalleryCategory(category.id);
                            }}
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button
                            className="data_delete_btn"
                            onClick={() => openDeleteModal(category.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </span>
                      </td>

                      {/* Status  */}
                      {/* <td>
                        {testimonial.status === 1 ? (
                          <img
                            src={"/assets/images/activeStatus.png"}
                            className="opr_active_btn"
                            onClick={() => {
                              testimonialStatusChange(testimonial.id, 1);
                            }}
                            alt="active"
                          />
                        ) : (
                          <img
                            src={"/assets/images/inActiveStatus.png"}
                            className="opr_active_btn"
                            onClick={() => {
                              testimonialStatusChange(testimonial.id, 0);
                            }}
                            alt="inActive"
                          />
                        )}
                      </td> */}
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
          <div
            className="add_data_form"
            style={{ width: "40%", marginTop: "18px", marginRight: "10px" }}
          >
            <form method="post" onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="category_title" className="modal_label">
                  <span style={{ color: "red" }}>*</span> Category Title:-
                </label>
                <input
                  type="text"
                  id="category_title"
                  name="category_title"
                  className="modal_input"
                  placeholder="Enter Gallery Category Title"
                  onChange={handleChangeGalleryCategory}
                  value={addEditGalleryCategoryData.category_title}
                />
              </div>

              <div className="mb-3">
                {/* <button type="submit" className="success_btn">
                  {editMode ? "UPDATE" : "SAVE"}
                </button> */}
                <input
                  type="submit"
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Adding..." : (editMode ? "UPDATE" : "SAVE")}
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
        {/* delete modal component */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteGalleryCategory}
        />
        {/* Show the Toast notification */}
        <Toast />
      </section>
    </>
  );
};

export default GalleryCategory;
