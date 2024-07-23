import { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Form = ({ jobId, setJobId, formref }) => {
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    number: "",
    salary: "",
    message: "",
    resume: null,
  });

  const e = addFormData.email;

  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    // Check if a file is selected
    if (file) {
      // Get the file extension
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // Check if the file extension is allowed (PDF or DOCX)
      if (fileExtension === "pdf" || fileExtension === "docx") {
        setAddFormData((prevData) => ({
          ...prevData,
          resume: file,
        }));
        setValidationError("");
        setSelectedFile(file);
      } else {
        // Show error for an invalid file type
        setValidationError(
          "Invalid file type. Please upload a PDF or DOCX file."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    if (addFormData.name.trim() == "") {
      setValidationError("Invalid Name");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addFormData.email)) {
      setValidationError("Invalid Email");
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (addFormData.number && !mobileRegex.test(addFormData.number)) {
      setValidationError("Invalid Mobile Number");
      return;
    }

    if (addFormData.message.trim() == "") {
      setValidationError("Please Write Message");
      return;
    }

    setValidationError("");

    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", addFormData.name);
    formdata.append("email", addFormData.email);
    formdata.append("number", addFormData.number);
    formdata.append("message", addFormData.message);
    formdata.append("salary", addFormData.salary);
    formdata.append("resume", addFormData.resume);
    formdata.append("app_id", jobId);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/career/router`,
        formdata
      );
      // Reset form fields
      setAddFormData({
        name: "",
        email: "",
        number: "",
        salary: "",
        message: "",
        resume: null,
      });
      setJobId(null);
      setSelectedFile(null);
      setSubmissionSuccess(true);
    } catch (error) {
      // Handle error
      ErrorToast("Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkEmail = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/client/contact/contactform/router`
        );

        if (res.data.some((entry) => entry.email == e)) {
          const emailCount = res.data.filter(
            (entry) => entry.email === e
          ).length;

          if (emailCount >= 1) {
            setShowRecaptcha(true);
          } else {
            setShowRecaptcha(false);
          }
        } else {
          setShowRecaptcha(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (e.trim() != "") {
      checkEmail();
    }
  }, [e]);

  // This useEffect will automatically hide the success message after 2 seconds
  useEffect(() => {
    let timeout;

    if (submissionSuccess) {
      timeout = setTimeout(() => {
        setSubmissionSuccess(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [submissionSuccess]);

  const RECAPTCHA_SITE_KEY =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_LOCALHOST_RECAPTCHA_SITE_KEY
      : process.env.NEXT_PUBLIC_PRODUCTION_RECAPTCHA_SITE_KEY;

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  return (
    <div className="blog-view-sec" ref={formref}>
      <div className="container mb-6">
        <div className="form_main lg:py-7 py-6">
          <p className="form_title text-center">Apply Now</p>
          <p className="text-center mb-6">Submit The Form Below To Apply</p>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2 justify-center">
              <div className="lg:w-1/3 md:w-2/5 w-5/6">
                <label
                  htmlFor="first_name"
                  className="block mb-1 text-sm font-semibold text-gray-900"
                >
                  Your Name:
                  <span className="text-red-600 font-black fs-2">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="bg-white border border-gray-300 text-sm rounded-lg focus:outline-none block w-full p-2.5"
                  placeholder="Enter Your Name"
                  onChange={handleChange}
                  value={addFormData.name}
                />
              </div>
              <div className="lg:w-1/3 md:w-2/5 w-5/6">
                <label
                  htmlFor="first_name"
                  className="block mb-1 text-sm font-semibold text-gray-900"
                >
                  Your Email:
                  <span className="text-red-600 font-black fs-2">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="bg-white border border-gray-300 text-sm rounded-lg focus:outline-none block w-full p-2.5"
                  placeholder="Enter Your Email"
                  onChange={handleChange}
                  value={addFormData.email}
                />
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2 justify-center">
              <div className="lg:w-1/3 md:w-2/5 w-5/6">
                <label
                  htmlFor="first_name"
                  className="block mb-1 text-sm font-semibold text-gray-900"
                >
                  Mobile No:
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  className="bg-white border border-gray-300 text-sm rounded-lg focus:outline-none block w-full p-2.5"
                  placeholder="Enter Your Mobile"
                  onChange={handleChange}
                  value={addFormData.number}
                />
              </div>
              <div className="lg:w-1/3 md:w-2/5 w-5/6">
                <label
                  htmlFor="first_name"
                  className="block mb-1 text-sm font-semibold text-gray-900"
                >
                  Expected Salary:
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  className="bg-white border border-gray-300 text-sm rounded-lg focus:outline-none block w-full p-2.5"
                  placeholder="Expected Salary"
                  onChange={handleChange}
                  value={addFormData.salary}
                />
              </div>
            </div>

            <div className="career_form_file_input">
              <label
                htmlFor="file"
                className="block mb-1 text-sm font-semibold text-gray-900"
              >
                Upload CV / Resume
              </label>
            </div>

            <div className="flex items-center justify-center career_form_file_input">
              <label
                htmlFor="file"
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center w-full cursor-pointer"
              >
                <div
                  className="flex flex-col items-center justify-center pt-5 pb-6 border border-gray-300 rounded-lg
"
                >
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 lg:text-sm md:text-sm text-xs text-gray-500">
                    Click Or Drag This Area To Upload
                  </p>
                </div>
                <input
                  id="file"
                  name="file"
                  type="file"
                  className="block w-full h-full opacity-0 "
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="career_form_file_input">
              {selectedFile && (
                <p className="mt-2 text-sm">{selectedFile.name}</p>
              )}
            </div>

            <div className="pt-2 career_form_file_input">
              <label
                htmlFor="message"
                className="block mb-1 text-sm font-semibold"
              >
                Message:
                <span className="text-red-600 font-black fs-2">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="block p-2.5 w-full text-sm rounded-lg border border-gray-300 focus:outline-none"
                placeholder="Type Your Message Here..."
                onChange={handleChange}
                value={addFormData.message}
              ></textarea>
            </div>
            <div className="carrer_submit_btn">
              <div>
                {validationError && validationError != "" ? (
                  <span style={{ color: "red" }}>* {validationError}</span>
                ) : (
                  ""
                )}
                {submissionSuccess && (
                  <p style={{ color: "green", marginTop: "10px" }}>
                    Career inquiry submitted successfully!
                  </p>
                )}
              </div>
              <div>
                {showRecaptcha && (
                  <div className="recaptcha">
                    <ReCAPTCHA
                      sitekey={RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                )}
                <button
                  className="mt-3 btn-primary learn-btn"
                  style={
                    loading || (!recaptchaValue && showRecaptcha)
                      ? { cursor: "not-allowed", padding: "0px 30px" }
                      : { padding: "0px 30px" }
                  }
                  value={"Submit Information"}
                  disabled={loading || (!recaptchaValue && showRecaptcha)}
                >
                  {loading ? "Sending..." : "Submit Information"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
