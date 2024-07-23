import DeleteModal from "@/layouts/DeleteModal";
import Header from "@/layouts/Header";
import Loading from "@/layouts/Loading";
import Toast, {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "@/layouts/toast/Toast";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const About = () => {
  const [activeTab, setActiveTab] = useState("application");
  const [activeSubTab, setActiveSubTab] = useState("contact");
  const [loading, setLoading] = useState(true);

  // Global Variable
  let certificateidCounterCareer = 1;
  let videoidCounterCareer = 1;

  // HANDLE TABS
  const showTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "career") {
      setActiveSubTab("careerdata");
    } else {
      setActiveSubTab("contact");
    }
  };

  // HANDLE SUB TABS
  const showSubTab = (tabId) => {
    setActiveSubTab(tabId);
  };

  const [filteredApplication, setFilteredApplication] = useState([]);
  const [getApplication, setGetApplication] = useState([]);

  // //get or fetch all data start
  // const getvideosData = async () => {
  //   await axios
  //     .get(`${process.env.NEXT_PUBLIC_API_URL}/about/videos/router`)
  //     .then((res) => {
  //       setGetApplication(res.data);
  //       setGetVideos(res.data)
  //       setFilteredApplication(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       ErrorToast(err?.response?.data?.message);
  //       setLoading(false);
  //     });
  // };

  // // fetch all application data
  // useEffect(() => {
  //   getvideosData();
  // }, []);
  //get or fetch all application data end

  //filter code Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value

  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilteredApplication(
      getApplication.filter((e) => {
        let data = e.name.toLowerCase(); // Convert to lowercase
        return data.includes(filterValue.toLowerCase()); // Case-insensitive search
      })
    );
  }, [filterValue]);
  // filter code End

  // Career Form Code Start

  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredCertificate, setFilteredCertificate] = useState([]);
  const [getCareer, setGetCareer] = useState([]);

  const [getCertificate, setGetCertificate] = useState([]);
  //get or fetch all data start
  const getCertificateData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/about/certificates/router`)
      .then((res) => {
        setGetCertificate(res.data);
        setFilteredCertificate(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all career data
  useEffect(() => {
    getCertificateData();
  }, []);

  // NEw Code

  const [CertificateData, setCertificateData] = useState({
    pdf: null,
    thumbnail: null,
    title: "",
  });
  const [editCerMode, setEditCerMode] = useState(false);
  const [editCerItemId, setEditCerItemId] = useState(null);

  // handle delete application start
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  // open the modal
  const openDeleteModal = (deleteDataType, deleteApplicationId) => {
    setDeleteId(deleteApplicationId);
    setDeleteType(deleteDataType);
    setIsDeleteModalOpen(true);
  };

  // close the modal
  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // delete the record
  const deleteApplication = () => {
    if (deleteId && deleteType) {
      deleteApplicationData(deleteId, deleteType);
      closeDeleteModal();
    }
  };

  // delete code generate
  const deleteApplicationData = async (deleteId, dataType) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/about/${dataType}/${deleteId}`
      );
      // Move closeDeleteModal and SuccessToast here to ensure they are called after the deletion is successful
      closeDeleteModal();
      SuccessToast(
        `${
          dataType.charAt(0).toUpperCase() + dataType.slice(1)
        } Deleted Successfully`
      );
      if (dataType === "videos") {
        getVideosData();
      } else if (dataType === "certificates") {
        getCertificateData();
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePDFFileChange = (e) => {
    const pdfFile = e.target.files[0];

    // Validate PDF file
    if (pdfFile && pdfFile.type === "application/pdf") {
      setCertificateData((prevData) => ({
        ...prevData,
        pdf: pdfFile,
      }));
    } else {
      WarningToast("Please select a valid PDF file.");
    }
  };

  const handleThumbnailFileChange = (e) => {
    const thumbnailFile = e.target.files[0];

    // Validate image file
    if (thumbnailFile && thumbnailFile.type.startsWith("image/")) {
      setCertificateData((prevData) => ({
        ...prevData,
        thumbnail: thumbnailFile,
      }));
    } else {
      WarningToast("Please select a valid image file.");
    }
  };

  const handleTitleChange = (e) => {
    const titleValue = e.target.value;
    setCertificateData((prevData) => ({
      ...prevData,
      title: titleValue,
    }));
  };

  // Function to add or edit product data
  const addCertificateData = async (e) => {
    e.preventDefault();

    // Validation
    const errors = [];

    // Validate title
    if (CertificateData.title.trim() === "") {
      errors.push("Please enter a title.");
    }
    // Validate Thumbnail file
    if (!CertificateData.thumbnail) {
      errors.push("Please select a Thumbnail image.");
    }

    // Validate PDF file
    if (!CertificateData.pdf) {
      errors.push("Please select a PDF file.");
    }

    // Check if there are any errors
    if (errors.length > 0) {
      // Display the first error and stop further execution
      WarningToast(errors[0]);
      return;
    }

    // Check if it's in edit mode
    if (editCerMode && editCerItemId) {
      try {
        setLoading(true);
        const formdata = new FormData();
        formdata.append("title", CertificateData.title);
        formdata.append("pdf", CertificateData.pdf);
        formdata.append("thumbnail", CertificateData.thumbnail);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/about/certificates/${editCerItemId}`,
          formdata
        );

        SuccessToast("Product Updated Successfully");
        setCertificateData({
          pdf: null,
          thumbnail: null,
          title: "",
        });
        setLoading(false);
        setActiveSubTab("careerdata");
        setEditCerMode(false);
        setEditCerItemId(null);

        getCertificateData();
        // Fetch updated product data if needed
        // getProductsData();
      } catch (error) {
        setLoading(false);
        WarningToast(error?.response?.data?.message);
      }
    } else {
      try {
        console.log(CertificateData);
        setLoading(true);
        const formdata = new FormData();
        formdata.append("title", CertificateData.title);
        formdata.append("pdf", CertificateData.pdf);
        formdata.append("thumbnail", CertificateData.thumbnail);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/about/certificates/router`,
          formdata
        );

        setCertificateData({
          pdf: null,
          thumbnail: null,
          title: "",
        });
        getCertificateData();
        SuccessToast("Certificate Added Successfully");
        setLoading(false);
      } catch (error) {
        console.log(error);
        WarningToast(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  // Edit button click handler
  const editItem = (id) => {
    console.log(id);
    const itemToEdit = getCertificate.find((item) => item.id == id);
    console.log(itemToEdit.pdf);
    if (itemToEdit) {
      setCertificateData({
        pdf: itemToEdit?.pdf,
        thumbnail: itemToEdit?.thumbnail,
        title: itemToEdit?.title,
      });

      setEditCerMode(true);
      setEditCerItemId(id);
      setActiveSubTab("job"); // Set activeSubTab to "job" when editing
    }
  };

  const StatusChange = async (cateId, no) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/about/certificates/statuschanges/${cateId}/${no}`
      );
      setLoading(false);
      getCertificateData();
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // Video Section
  const [getVideos, setGetVideos] = useState([]);
  const getVideosData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/about/videos/router`)
      .then((res) => {
        setFilteredVideos(res.data);
        setGetVideos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all video data
  useEffect(() => {
    getVideosData();
  }, []);

  const [editVideoMode, setEditVideoMode] = useState(false);
  const [editVideoItemId, setEditVideoItemId] = useState(null);

  const [addVideoData, setAddVideoData] = useState({
    title: "",
    short_desc: "",
    link: "",
    thumbnail: null,
  });

  // ADD VIDEO DATA HANDLER
  const handleChangeVideo = (event) => {
    const { name, value } = event.target;
    setAddVideoData((prevVideoData) => ({
      ...prevVideoData,
      [name]: value,
    }));
  };

  const handleThumbnailVideoChange = (e) => {
    const thumbnailFile = e.target.files[0];

    // Validate image file
    if (thumbnailFile && thumbnailFile.type.startsWith("image/")) {
      setAddVideoData((prevVideoData) => ({
        ...prevVideoData,
        thumbnail: thumbnailFile,
      }));
    } else {
      WarningToast("Please select a valid image file.");
    }
  };

  const SaveVideoData = async (e) => {
    e.preventDefault();
    // Validation
    const errors = [];

    // Validate title
    if (addVideoData.title.trim() === "") {
      errors.push("Please enter a title.");
    }
    // Validate short description
    if (addVideoData.short_desc.trim() === "") {
      errors.push("Please enter a short description.");
    }
    // Validate link
    if (addVideoData.link.trim() === "") {
      errors.push("Please enter a video link.");
    }

    // Validate Thumbnail file
    if (!addVideoData.thumbnail) {
      errors.push("Please select a Thumbnail image.");
    }

    // Check if there are any errors
    if (errors.length > 0) {
      // Display the first error and stop further execution
      WarningToast(errors[0]);
      return;
    }
    console.log(addVideoData);
    // Check if it's in edit mode
    if (editVideoMode && editVideoItemId) {
      try {
        setLoading(true);
        const formdata = new FormData();
        formdata.append("title", addVideoData.title);
        formdata.append("short_desc", addVideoData.short_desc);
        formdata.append("link", addVideoData.link);
        formdata.append("thumbnail", addVideoData.thumbnail);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/about/videos/${editVideoItemId}`,
          formdata
        );

        SuccessToast("Video Updated Successfully");
        setAddVideoData({
          title: "",
          short_desc: "",
          link: "",
          thumbnail: null,
        });
        setActiveSubTab("contact"); // assuming this is the default tab for videos
        setEditVideoMode(false);
        setEditVideoItemId(null);
        setLoading(false);
        getVideosData();
      } catch (error) {
        setLoading(false);
        WarningToast(error?.response?.data?.message);
      }
    } else {
      try {
        setLoading(true);
        const formdata = new FormData();
        formdata.append("title", addVideoData.title);
        formdata.append("short_desc", addVideoData.short_desc);
        formdata.append("link", addVideoData.link);
        formdata.append("thumbnail", addVideoData.thumbnail);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/about/videos/router`,
          formdata
        );

        setAddVideoData({
          title: "",
          short_desc: "",
          link: "",
          thumbnail: null,
        });
        getVideosData();
        setLoading(false);
        SuccessToast("Video Added Successfully");
      } catch (error) {
        setLoading(false);
        WarningToast(error?.response?.data?.message);
      }
    }
  };

  // Edit button click handler
  const editVideoItem = (id) => {
    const itemToEdit = getVideos.find((item) => item.id == id);
    if (itemToEdit) {
      setAddVideoData({
        title: itemToEdit?.title,
        short_desc: itemToEdit?.short_desc,
        link: itemToEdit?.link,
        thumbnail: itemToEdit?.thumbnail,
      });

      setEditVideoMode(true);
      setEditVideoItemId(id);
      setActiveSubTab("job-application"); // Set activeSubTab to "job-application" when editing
    }
  };

  const StatusVideoChange = async (cateId, no) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/about/videos/statuschanges/${cateId}/${no}`
      );
      setLoading(false);
      getVideosData();
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* LOADING SECTION */}
      {loading && <Loading />}

      {/* HOME SECTION */}
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <p className="admin_page_header">Videos And Certificates</p>
        </div>
        {/* TABS */}
        <div className="tabs-container">
          {/* Main Tabs */}
          <div className="tabs">
            <div style={{ display: "flex" }}>
              <div
                className={`tab ${activeTab === "application" ? "active" : ""}`}
                onClick={() => showTab("application")}
              >
                Videos
              </div>
              <div
                className={`tab ${activeTab === "career" ? "active" : ""}`}
                onClick={() => showTab("career")}
              >
                Certificates
              </div>
            </div>
          </div>

          {/* Application Tab */}
          <div
            id="application"
            className={`tab-content add_data_form ${
              activeTab === "application" ? "active" : ""
            }`}
          >
            <div className="sub-tabs-container">
              <div className="tabs">
                <div style={{ display: "flex" }}>
                  <div
                    className={`tab ${
                      activeSubTab === "contact" ? "active" : ""
                    }`}
                    onClick={() => {
                      showSubTab("contact");
                      setActiveSubTab("contact");
                      setEditVideoMode(false);
                      setEditVideoItemId(null);
                      setAddVideoData({
                        title: "",
                        short_desc: "",
                        link: "",
                        thumbnail: null,
                      });
                    }}
                  >
                    All Videos
                  </div>
                  <div
                    className={`tab ${
                      activeSubTab === "job-application" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("job-application")}
                  >
                    {editVideoMode ? "Edit Video" : "Add New"}
                  </div>
                </div>
              </div>

              {/* All Careers */}
              <div
                id="contact"
                className={`tab-content add_data_form ${
                  activeSubTab === "contact" ? "active" : ""
                }`}
              >
                <div className="admin_category_table">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "10%", textAlign: "center" }}>
                          ID
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          Title
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          Description
                        </th>
                        <th style={{ width: "15%", textAlign: "center" }}>
                          Link
                        </th>
                        <th style={{ width: "15%", textAlign: "center" }}>
                          Thumbnail
                        </th>
                        <th style={{ width: "15%", textAlign: "center" }}>
                          Status
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVideos.length > 0 ? (
                        filteredVideos.map((data, index) => (
                          <tr key={data.id} style={{ textAlign: "center" }}>
                            {/* ID */}
                            <td>{videoidCounterCareer++}</td>
                            <td>{data.title}</td>
                            <td>{data.short_desc}</td>
                            <td>{data.link}</td>
                            <td>
                              {" "}
                              <img
                                src={`/assets/upload/about/videos/${data.thumbnail}`}
                                width="100%"
                                className="tabel_data_image"
                                alt="category_image"
                              />
                            </td>
                            <td>
                              {" "}
                              {data.status === 1 ? (
                                <img
                                  src="/assets/images/activeStatus.png"
                                  alt="active"
                                  className="status_btn"
                                  onClick={() => {
                                    StatusVideoChange(data.id, 1);
                                  }}
                                />
                              ) : (
                                <img
                                  src="/assets/images/inActiveStatus.png"
                                  alt="inActive"
                                  className="status_btn"
                                  onClick={() => {
                                    StatusVideoChange(data.id, 0);
                                  }}
                                />
                              )}
                            </td>

                            {/* Handle Operation that you want to perform */}
                            <td>
                              <span>
                                <button
                                  className="data_delete_btn"
                                  onClick={() =>
                                    openDeleteModal("videos", data.id)
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </span>
                              <span className="ml-2">
                                <button
                                  className="success_btn"
                                  onClick={() => editVideoItem(data.id)}
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                              </span>
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
              </div>

              {/* Add Career */}
              <div
                id="job-application"
                className={`tab-content add_data_form ${
                  activeSubTab === "job-application" ? "active" : ""
                }`}
              >
                <form method="post" onSubmit={SaveVideoData}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h1>
                      {editVideoMode ? "Edit Video Data" : "Add Video Data"}
                    </h1>
                    <hr
                      style={{
                        border: "1px solid #000",
                        margin: "auto",
                        width: "10%",
                        marginTop: "5px",
                      }}
                    />
                  </div>

                  <div className="mb-3 mt-5">
                    <label htmlFor="title" className="modal_label">
                      Video Title:-
                      <small style={{ color: "red" }}> *</small>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="modal_input"
                      value={addVideoData.title}
                      onChange={handleChangeVideo}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="short_desc" className="modal_label">
                      Short Description:-
                      <small style={{ color: "red" }}> *</small>
                    </label>
                    <textarea
                      id="short_desc"
                      name="short_desc"
                      className="modal_input"
                      value={addVideoData.short_desc}
                      onChange={handleChangeVideo}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="link" className="modal_label">
                      Video Link:-
                      <small style={{ color: "red" }}> *</small>
                    </label>
                    <input
                      type="text"
                      id="link"
                      name="link"
                      className="modal_input"
                      value={addVideoData.link}
                      onChange={handleChangeVideo}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="thumbnail" className="modal_label">
                      Select Thumbnail:-
                      <small style={{ color: "red" }}> *</small>
                    </label>
                    <input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      className="modal_input"
                      accept="image/*"
                      onChange={handleThumbnailVideoChange}
                    />
                  </div>
                  {addVideoData.thumbnail && !editVideoMode && (
                    <div className="mb-3">
                      <img
                        src={URL.createObjectURL(addVideoData.thumbnail)}
                        alt="Selected Thumbnail"
                        className="table_data_image"
                      />
                    </div>
                  )}
                  {editVideoItemId && (
                    <div className="mb-3">
                      <img
                        src={`/assets/upload/about/videos/${addVideoData?.thumbnail}`}
                        alt="Thumbnail"
                        className="table_data_image"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    {/* <button className="success_btn">
                      {editVideoMode ? "UPDATE" : "SAVE"}
                    </button> */}
                    <input
                      type="submit"
                      style={loading ? { cursor: "not-allowed" } : {}}
                      className="success_btn"
                      value={
                        loading
                          ? "Adding..."
                          : editVideoMode
                          ? "UPDATE"
                          : "SAVE"
                      }
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="success_btn cancel_btn"
                      onClick={() => {
                        setActiveSubTab("contact");
                        setEditVideoMode(false);
                        setEditVideoItemId(null);
                        setAddVideoData({
                          title: "",
                          short_desc: "",
                          link: "",
                          thumbnail: null,
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Career Tab */}
          <div
            id="career"
            className={`tab-content add_data_form ${
              activeTab === "career" ? "active" : ""
            }`}
          >
            <div className="sub-tabs-container">
              <div className="tabs">
                <div style={{ display: "flex" }}>
                  <div
                    className={`tab ${
                      activeSubTab === "careerdata" ? "active" : ""
                    }`}
                    onClick={() => {
                      showSubTab("careerdata");
                      setActiveSubTab("careerdata");
                      setEditCerMode(false);
                      setEditCerItemId(null);
                      setCertificateData({
                        title: "",
                        pdf: null,
                        thumbnail: null,
                      });
                    }}
                  >
                    All Certificates
                  </div>
                  <div
                    className={`tab ${activeSubTab === "job" ? "active" : ""}`}
                    onClick={() => showSubTab("job")}
                  >
                    {editCerMode ? "Edit Certificate" : "Add New"}
                  </div>
                </div>
              </div>
            </div>

            {/* All Careers */}
            <div
              id="careerdata"
              className={`tab-content add_data_form ${
                activeSubTab === "careerdata" ? "active" : ""
              }`}
            >
              <div className="admin_category_table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "10%", textAlign: "center" }}>ID</th>
                      <th style={{ width: "20%", textAlign: "center" }}>
                        Certificate Title
                      </th>
                      <th style={{ width: "20%", textAlign: "center" }}>PDF</th>
                      <th style={{ width: "15%", textAlign: "center" }}>
                        Thumbnail
                      </th>
                      <th style={{ width: "15%", textAlign: "center" }}>
                        Status
                      </th>
                      <th style={{ width: "20%", textAlign: "center" }}>
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCertificate.length > 0 ? (
                      filteredCertificate.map((data, index) => (
                        <tr key={data.id} style={{ textAlign: "center" }}>
                          {/* ID */}
                          <td>{certificateidCounterCareer++}</td>
                          <td>{data.title}</td>
                          <td>
                            <Link
                              href={`/assets/upload/about/certificates/${data.pdf}`}
                              target="_blank"
                            >
                              <img
                                src={`/assets/images/pdf-icon.webp`}
                                width="100%"
                                className="tabel_data_image"
                                alt="category_image"
                              />
                            </Link>
                          </td>
                          <td>
                            {" "}
                            <img
                              src={`/assets/upload/about/certificates/${data.thumbnail}`}
                              width="100%"
                              className="tabel_data_image"
                              alt="category_image"
                            />
                          </td>
                          <td>
                            {" "}
                            {data.status === 1 ? (
                              <img
                                src="/assets/images/activeStatus.png"
                                alt="active"
                                className="status_btn"
                                onClick={() => {
                                  StatusChange(data.id, 1);
                                }}
                              />
                            ) : (
                              <img
                                src="/assets/images/inActiveStatus.png"
                                alt="inActive"
                                className="status_btn"
                                onClick={() => {
                                  StatusChange(data.id, 0);
                                }}
                              />
                            )}
                          </td>

                          {/* Handle Operation that you want to perform */}
                          <td>
                            <span>
                              <button
                                className="data_delete_btn"
                                onClick={() =>
                                  openDeleteModal("certificates", data.id)
                                }
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </span>
                            <span className="ml-2">
                              <button
                                className="success_btn"
                                onClick={() => editItem(data.id)}
                              >
                                <i className="fa-regular fa-pen-to-square"></i>
                              </button>
                            </span>
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
            </div>

            {/* Add Career */}
            <div
              id="job"
              className={`tab-content add_data_form ${
                activeSubTab === "job" ? "active" : ""
              }`}
            >
              <form method="post" onSubmit={addCertificateData}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  <h1>
                    {editCerMode
                      ? "Edit Certificate Data"
                      : "Add Certificate Data"}
                  </h1>
                  <hr
                    style={{
                      border: "1px solid #000",
                      margin: "auto",
                      width: "10%",
                      marginTop: "5px",
                    }}
                  />
                </div>

                <div className="mb-3 mt-5">
                  <label htmlFor="title" className="modal_label">
                    Certificate Title:-
                    <small style={{ color: "red" }}> *</small>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="modal_input"
                    value={CertificateData.title}
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="two_input_flex">
                  <div style={{ width: "48%" }}>
                    <div className="mb-3">
                      <label htmlFor="pdf" className="modal_label">
                        Select PDF:-
                        <small style={{ color: "red" }}> *</small>
                      </label>
                      <input
                        type="file"
                        id="pdf"
                        name="pdf"
                        className="modal_input"
                        accept="pdf/*"
                        onChange={handlePDFFileChange}
                      />
                    </div>
                    {CertificateData.pdf && !editCerMode && (
                      <div className="mb-3">
                        <img
                          src={URL.createObjectURL(CertificateData.pdf)}
                          alt="Selected Thumbnail"
                          className="table_data_image"
                        />
                      </div>
                    )}
                    {editCerItemId && (
                      <div className="mb-3">
                        <Link
                          href={`/assets/upload/about/certificates/${CertificateData?.pdf}`}
                          target="_blank"
                        >
                          <img
                            src={`/assets/images/pdf-icon.webp`}
                            alt="Thumbnail"
                            className="table_data_image"
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="mb-3" style={{ width: "48%" }}>
                    <div className="mb-3">
                      <label htmlFor="thumbnail" className="modal_label">
                        Select Thumbnail:-
                        <small style={{ color: "red" }}> *</small>
                      </label>
                      <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        className="modal_input"
                        accept="image/*"
                        onChange={handleThumbnailFileChange}
                      />
                    </div>
                    {CertificateData.thumbnail && !editCerMode && (
                      <div className="mb-3">
                        <img
                          src={URL.createObjectURL(CertificateData.thumbnail)}
                          alt="Selected Thumbnail"
                          className="table_data_image"
                        />
                      </div>
                    )}
                    {editCerItemId && (
                      <div className="mb-3">
                        <img
                          src={`/assets/upload/about/certificates/${CertificateData?.thumbnail}`}
                          alt="Thumbnail"
                          className="table_data_image"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  {/* <button className="success_btn">
                    {editCerMode ? "UPDATE" : "SAVE"}
                  </button> */}
                  <input
                    type="submit"
                    style={loading ? { cursor: "not-allowed" } : {}}
                    className="success_btn"
                    value={
                      loading ? "Adding..." : editCerMode ? "UPDATE" : "SAVE"
                    }
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="success_btn cancel_btn"
                    onClick={() => {
                      setActiveSubTab("careerdata");
                      setEditCerMode(false);
                      setEditCerItemId(null);
                      setCertificateData({
                        title: "",
                        pdf: null,
                        thumbnail: null,
                      });
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* delete modal component */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteApplication}
          itemType="Application"
          itemId={deleteId}
        />

        <Toast />
      </section>
    </>
  );
};

export default About;
