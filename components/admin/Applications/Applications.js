import DeleteModal from "@/layouts/DeleteModal";
import Header from "@/layouts/Header";
import Loading from "@/layouts/Loading";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Applications = () => {
  const [activeTab, setActiveTab] = useState("application");
  const [activeSubTab, setActiveSubTab] = useState("contact");
  const [loading, setLoading] = useState(true);

  // Global Variable
  let idCounterContact = 1;
  let idCounterJobApplication = 1;
  let idCounterCareer = 1;

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

  //get or fetch all data start
  const getApplicationData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/application/router`)
      .then((res) => {
        setGetApplication(res.data);
        setFilteredApplication(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all application data
  useEffect(() => {
    getApplicationData();
  }, []);
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
        `${process.env.NEXT_PUBLIC_API_URL}/${dataType}/${deleteId}`
      );
      // Move closeDeleteModal and SuccessToast here to ensure they are called after the deletion is successful
      closeDeleteModal();
      SuccessToast(
        `${
          dataType.charAt(0).toUpperCase() + dataType.slice(1)
        } Deleted Successfully`
      );
      if (dataType === "application") {
        getApplicationData();
      } else if (dataType === "career") {
        getCareerData();
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  // handle delete application end

  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackId, setFeedbackId] = useState("");

  // open the feedback modal
  const openFeedbackModal = (email, id) => {
    setFeedbackEmail(email);
    setFeedbackId(id);
    const modal = document.getElementById("feedback-modal");
    modal.classList.toggle("hidden");
  };

  // close the feedback modal
  const closeFeedbackModal = () => {
    const modal = document.getElementById("feedback-modal");
    modal.classList.toggle("hidden");
  };

  // feedback send code
  const feedbackApplicationData = async (feedbackId, email, comment) => {
    setLoading(true);
    const mailData = {
      email: email,
      comment: comment,
    };
    console.log(mailData);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/application/${feedbackId}`,
        mailData
      );
      SuccessToast("Feedback Sent Successfully");
      closeFeedbackModal();
      getApplicationData();
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Career Form Code Start

  const [filteredCareer, setFilteredCareer] = useState([]);
  const [getCareer, setGetCareer] = useState([]);

  //get or fetch all data start
  const getCareerData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/career/router`)
      .then((res) => {
        setGetCareer(res.data);
        setFilteredCareer(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  // fetch all career data
  useEffect(() => {
    getCareerData();
  }, []);
  //get or fetch all career data end

  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  // Edit button click handler
  const editItem = (id) => {
    const itemToEdit = getCareer.find((item) => item.id == id);
    if (itemToEdit) {
      setAddJobData({
        role_name: itemToEdit.role_name,
        job_desc: itemToEdit.job_desc,
        category: itemToEdit.category,
        nop: itemToEdit.nop,
        duration: itemToEdit.duration,
      });
      setEditMode(true);
      setEditItemId(id);
      setActiveSubTab("job"); // Set activeSubTab to "job" when editing
    }
  };

  const [addJobData, setAddJobData] = useState({
    role_name: "",
    job_desc: "",
    category: "",
    nop: "",
    duration: "",
  });

  //ADD CAREER DATA AND CAREER HANDLER
  const handleChangeJobCareer = (event) => {
    const { name, value } = event.target;
    setAddJobData((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };

  // Add or Edit Career Data
  const addCareerData = async (e) => {
    e.preventDefault();

    // Validation
    const errors = [];

    if (addJobData.role_name === "") {
      errors.push("Please Enter the Job Role");
    }

    if (addJobData.job_desc === "") {
      errors.push("Please Enter the Job Description");
    }

    if (addJobData.category === "") {
      errors.push("Please Enter the Job Category");
    }

    if (addJobData.nop === "") {
      errors.push("Please Enter the Number of Openings Job");
    }

    if (addJobData.duration === "") {
      errors.push("Please Select the Job Duration");
    }

    // Check if there are any errors
    if (errors.length > 0) {
      // Display the first error and stop further execution
      ErrorToast(errors[0]);
      setLoading(false);
      return;
    }

    window.scrollTo({ behavior: "smooth", top: 0 });

    if (editMode && editItemId) {
      // Handle edit logic
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/career/${editItemId}`,
          addJobData
        );

        // Reset the form fields and exit edit mode
        setAddJobData({
          role_name: "",
          job_desc: "",
          category: "",
          nop: "",
          duration: "",
        });
        setEditMode(false);
        setEditItemId(null);
        SuccessToast("Career Updated Successfully");
        setActiveSubTab("careerdata");
        // Fetch updated career data
        getCareerData();
      } catch (error) {
        ErrorToast(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle add logic
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/career/router`,
          addJobData
        );

        // Reset the form fields
        setAddJobData({
          role_name: "",
          job_desc: "",
          category: "",
          nop: "",
          duration: "",
        });

        SuccessToast("Career Added Successfully");
        // Update the active sub-tab to careerdata
        setActiveSubTab("careerdata");

        // Fetch updated career data
        getCareerData();
      } catch (error) {
        ErrorToast(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Career Form Code End

  return (
    <>
      {/* LOADING SECTION */}
      {loading && <Loading />}

      {/* HOME SECTION */}
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <p className="admin_page_header">Applications</p>
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
                Applications
              </div>
              <div
                className={`tab ${activeTab === "career" ? "active" : ""}`}
                onClick={() => showTab("career")}
              >
                Career
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
                    onClick={() => showSubTab("contact")}
                  >
                    Contact
                  </div>
                  <div
                    className={`tab ${
                      activeSubTab === "job-application" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("job-application")}
                  >
                    Job Application
                  </div>
                </div>
              </div>

              {/* Contact Table */}
              <div
                id="contact"
                className={`tab-content add_data_form ${
                  activeSubTab === "contact" ? "active" : ""
                }`}
              >
                {/* <div className="mb-3"> */}
                <div className="admin_category_table">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "5%", textAlign: "center" }}>ID</th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          NAME
                        </th>
                        <th style={{ width: "15%", textAlign: "center" }}>
                          CONTACT
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          EMAIL
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          MESSAGE
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplication.length > 0 ? (
                        filteredApplication.map((data, index) =>
                          data.identify_status === 0 ? (
                            <tr key={data.id} style={{ textAlign: "center" }}>
                              {/* ID */}
                              <td>{idCounterContact++}</td>
                              <td>{data.name}</td>
                              <td>{data.mobile}</td>
                              <td>{data.email}</td>
                              <td>{data.message}</td>

                              {/* Handle Operation that you want to perform */}
                              <td>
                                <span>
                                  <button
                                    className="data_delete_btn"
                                    onClick={() =>
                                      openDeleteModal("application", data.id)
                                    }
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </span>
                                {/* Add the feedback icon and handle its click event */}
                                <span className="ml-2">
                                  <button
                                    className="success_btn"
                                    onClick={() =>
                                      openFeedbackModal(data.email, data.id)
                                    }
                                  >
                                    <i className="fa-solid fa-comment"></i>
                                  </button>
                                </span>
                              </td>
                            </tr>
                          ) : (
                            ""
                          )
                        )
                      ) : (
                        // If data is not available in database so show this message
                        <tr>
                          <td colSpan="6" align="center">
                            data is not available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* </div> */}
              </div>

              {/* Inquiry Table */}
              <div
                id="job-application"
                className={`tab-content add_data_form ${
                  activeSubTab === "job-application" ? "active" : ""
                }`}
              >
                <div className="admin_category_table">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "5%", textAlign: "center" }}>ID</th>
                        <th style={{ width: "15%", textAlign: "center" }}>
                          NAME
                        </th>
                        <th style={{ width: "12%", textAlign: "center" }}>
                          CONTACT
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          EMAIL
                        </th>
                        <th style={{ width: "20%", textAlign: "center" }}>
                          MESSAGE
                        </th>
                        <th style={{ width: "16%", textAlign: "center" }}>
                          RESUME
                        </th>
                        <th style={{ width: "15%", textAlign: "center" }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplication.length > 0 ? (
                        filteredApplication.map((data, index) =>
                          data.identify_status === 1 ? (
                            <tr key={data.id} style={{ textAlign: "center" }}>
                              {/* ID */}
                              <td>{idCounterJobApplication++}</td>
                              <td>{data.name}</td>
                              <td>{data.mobile}</td>
                              <td>{data.email}</td>
                              <td>{data.message}</td>
                              <td>
                                <a
                                  href={`/assets/upload/career/${data.resume}`}
                                  download={data.resume}
                                >
                                  Download Resume
                                </a>
                                <br />
                                {/* {data.resume && (
                                  <div>
                                    {data.resume
                                      .toLowerCase()
                                      .endsWith(".pdf") && (
                                      // Show half of PDF content
                                      <iframe
                                        src={`/assets/upload/career/${data.resume}#view=FitH`}
                                        width="100"
                                        height="100"
                                      ></iframe>
                                    )}
                                    {data.resume
                                      .toLowerCase()
                                      .endsWith(".docx") && (
                                      // Show half of DOCX content
                                      <div>
                                        <p>Document Preview:</p>
                                        <iframe
                                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                            `/assets/upload/career/${data.resume}`
                                          )}`}
                                          width="100"
                                          height="100"
                                        ></iframe>
                                      </div>
                                    )}
                                  </div>
                                )} */}
                              </td>

                              {/* Handle Operation that you want to perform */}
                              <td>
                                <span>
                                  <button
                                    className="data_delete_btn"
                                    onClick={() =>
                                      openDeleteModal("application", data.id)
                                    }
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </span>
                                {/* Add the feedback icon and handle its click event */}
                                <span className="ml-2">
                                  <button
                                    className="success_btn"
                                    onClick={() =>
                                      openFeedbackModal(data.email, data.id)
                                    }
                                  >
                                    <i className="fa-solid fa-comment"></i>
                                  </button>
                                </span>
                              </td>
                            </tr>
                          ) : (
                            ""
                          )
                        )
                      ) : (
                        // If data is not available in database so show this message
                        <tr>
                          <td colSpan="6" align="center">
                            data is not available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                      setEditMode(false);
                      setEditItemId(null);
                      setAddJobData({
                        role_name: "",
                        job_desc: "",
                        category: "",
                        nop: "",
                        duration: "",
                      });
                    }}
                  >
                    All Jobs
                  </div>
                  <div
                    className={`tab ${activeSubTab === "job" ? "active" : ""}`}
                    onClick={() => showSubTab("job")}
                  >
                    {editMode ? "Edit Job" : "Add Job"}
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
                        JOB ROLE
                      </th>
                      <th style={{ width: "20%", textAlign: "center" }}>
                        CATEGORY
                      </th>
                      <th style={{ width: "15%", textAlign: "center" }}>
                        NO OF OPENING
                      </th>
                      <th style={{ width: "15%", textAlign: "center" }}>
                        DURATION
                      </th>
                      <th style={{ width: "20%", textAlign: "center" }}>
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCareer.length > 0 ? (
                      filteredCareer.map((data, index) => (
                        <tr key={data.id} style={{ textAlign: "center" }}>
                          {/* ID */}
                          <td>{idCounterCareer++}</td>
                          <td>{data.role_name}</td>
                          <td>{data.category}</td>
                          <td>{data.nop}</td>
                          <td>{data.duration}</td>

                          {/* Handle Operation that you want to perform */}
                          <td>
                            <span>
                              <button
                                className="data_delete_btn"
                                onClick={() =>
                                  openDeleteModal("career", data.id)
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
                        <td colSpan="6" align="center">
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
              <form method="post" onSubmit={addCareerData}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  <h1>{editMode ? "Edit Job Data" : "Add Job Data"}</h1>
                  <hr
                    style={{
                      border: "1px solid #000",
                      margin: "auto",
                      width: "10%",
                      marginTop: "5px",
                    }}
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="role_name" className="modal_label">
                    Job Role:-
                  </label>
                  <input
                    type="text"
                    id="role_name"
                    name="role_name"
                    className="modal_input"
                    placeholder="Enter Job Role"
                    onChange={handleChangeJobCareer}
                    value={addJobData.role_name}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="job_desc" className="modal_label">
                    Job Description:-
                  </label>
                  <textarea
                    type="text"
                    rows="5"
                    cols="70"
                    id="job_desc"
                    name="job_desc"
                    className="modal_input"
                    placeholder="Enter Job Description"
                    onChange={handleChangeJobCareer}
                    value={addJobData.job_desc}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="modal_label">
                    Category:-
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    className="modal_input"
                    placeholder="Enter Job Category"
                    onChange={handleChangeJobCareer}
                    value={addJobData.category}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="nop" className="modal_label">
                    No of Openings:-
                  </label>
                  <input
                    type="number"
                    id="nop"
                    name="nop"
                    className="modal_input"
                    placeholder="Enter Number of Opening Jobs"
                    onChange={handleChangeJobCareer}
                    value={addJobData.nop}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="duration" className="modal_label">
                    Duration:-
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    className="modal_input"
                    onChange={handleChangeJobCareer}
                    value={addJobData.duration}
                  >
                    <option value="">Select Duration</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                  </select>
                </div>

                <div className="mb-3">
                  {/* <button className="success_btn">
                    {editMode ? "UPDATE" : "SAVE"}
                  </button> */}
                  <input
                    type="submit"
                    style={loading ? { cursor: "not-allowed" } : {}}
                    className="success_btn"
                    value={
                      loading ? "Editing..." : editMode ? "UPDATE" : "SAVE"
                    }
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="success_btn cancel_btn"
                    onClick={() => {
                      setActiveSubTab("careerdata");
                      setEditMode(false);
                      setEditItemId(null);
                      setAddJobData({
                        role_name: "",
                        job_desc: "",
                        category: "",
                        nop: "",
                        duration: "",
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

        {/* Feedback modal */}
        <div
          id="feedback-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center "
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div
              className="relative rounded-lg shadow dark:bg-gray-700"
              style={{ backgroundColor: "#B5BBFE" }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Feedback
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    const modal = document.getElementById("feedback-modal");
                    modal.classList.toggle("hidden");
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <form>
                    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                        <label htmlFor="comment" className="sr-only">
                          Your comment
                        </label>
                        <textarea
                          id="comment"
                          name="comment"
                          rows="4"
                          className="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:border-transparent dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 outline-none"
                          placeholder="Write a comment..."
                          required
                        ></textarea>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const comment =
                              document.getElementById("comment").value;
                            feedbackApplicationData(
                              feedbackId,
                              feedbackEmail,
                              comment
                            );
                          }}
                          type="submit"
                          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                        >
                          Post comment
                        </button>
                      </div>
                    </div>
                  </form>
                  <p className="ms-auto text-xs text-gray-500 dark:text-gray-400">
                    Your feedback is valuable to us.
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      AWC India
                    </a>
                    .
                  </p>
                </p>
              </div>
            </div>
          </div>
        </div>

        <Toast />
      </section>
    </>
  );
};

export default Applications;
