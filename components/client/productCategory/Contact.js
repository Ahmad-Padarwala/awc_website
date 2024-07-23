import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = ({ cid }) => {
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testimonial, setTestimonial] = useState([]);

  const getTestimonial = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/product-category/testimonials/router`
      );
      console.log(response.data);
      setTestimonial(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getTestimonial();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <img
          key={`star-${i}`}
          src="/assets/images/client/rating-icon.png"
          alt="Rating Icon"
          width="12"
          height="auto"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <img
          key="half-star"
          src="/assets/images/client/half-rating-icon.png"
          alt="Half Rating Icon"
          width="12"
          height="auto"
        />
      );
    }

    return stars;
  };

  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });
  const e = addFormData.email;

  const [validationError, setValidationError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // add blog data section start
  const handleChangeData = (event) => {
    const { name, value } = event.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveData = async (e) => {
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
    try {
      const formdata = new FormData();
      formdata.append("name", addFormData.name);
      formdata.append("email", addFormData.email);
      formdata.append("number", addFormData.number);
      formdata.append("message", addFormData.message);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/contact/contactform/router`,
        formdata
      );
      setAddFormData({
        name: "",
        email: "",
        number: "",
        message: "",
      });
      setSubmissionSuccess(true);
    } catch (error) {
      setValidationError(error?.response?.data?.message);
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
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <section className="client-sec">
          <div className="container">
            <div className="client-inner-sec">
              <div className="grid">
                <div className="lg-7 sm-12">
                  <div className="client-content">
                    <h2>What Client Says</h2>
                    <p>Our Ratings Define Our Quality Work</p>
                  </div>
                  <div className="testimonials-sec">
                    <div className="grid">
                      {testimonial.map((item, idx) => {
                        return (
                          <div key={item?.id} className="lg-6 sm-12">
                            <div className="testimonials-content">
                              <img
                                className="q-img"
                                src={"/assets/images/client/quotes-img.png"}
                                alt="Double Quotes Image"
                                width="22"
                                height="auto"
                              />
                              <p
                                className="desc"
                                dangerouslySetInnerHTML={{
                                  __html: item?.testimonial_desc,
                                }}
                              ></p>
                              <div className="c-img-sec">
                                <div className="c-title-sec">
                                  <h4>{item?.testimonial_title}</h4>
                                  <div className="rating-sec">
                                    {renderStars(item?.rating)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Link href="/testimonials" className="see-all-link">
                      See All Reviews
                      <span>
                        <svg
                          width="15"
                          height="12"
                          viewBox="0 0 15 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.66885 0.673812L8.2134 0.162406C8.44398 -0.0541354 8.81682 -0.0541354 9.04494 0.162406L14.8271 5.60838C15.0576 5.82492 15.0576 6.17507 14.8271 6.38931L9.04494 11.8376C8.81437 12.0541 8.44152 12.0541 8.2134 11.8376L7.66885 11.3262C7.43583 11.1073 7.44073 10.7503 7.67867 10.536L11.6481 6.92145L0.5887 6.92145C0.262462 6.92145 0 6.67496 0 6.36858L0 5.63142C0 5.32503 0.262462 5.07855 0.5887 5.07855L11.6481 5.07855L7.67867 1.46396C7.43828 1.24972 7.43337 0.892657 7.66885 0.673812Z"
                            fill="#1386D3"
                          />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="lg-5 sm-12">
                  <div className="form-sec">
                    <h4>Contact Us</h4>
                    <p>
                      If you require additional information, please complete the
                      form below and submit it. Our team will be in touch with
                      you promptly.
                    </p>
                    <form
                      className="contact-form"
                      method="post"
                      onSubmit={saveData}
                    >
                      <div className="form-field">
                        <label htmlFor="name" className="form-label">
                          Your Name: <small>*</small>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleChangeData}
                          value={addFormData.name}
                          placeholder="Enter Your Name"
                          className="form-input"
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="email" className="form-label">
                          Your Email: <small>*</small>
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          onChange={handleChangeData}
                          value={addFormData.email}
                          placeholder="Enter Your Email"
                          className="form-input"
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="mobile" className="form-label">
                          {" "}
                          Mobile No.:{" "}
                        </label>
                        <input
                          type="text"
                          name="number"
                          id="number"
                          onChange={handleChangeData}
                          value={addFormData.number}
                          placeholder="Enter Your Mobile"
                          className="form-input"
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="message" className="form-label">
                          Message <small>*</small>
                        </label>
                        <textarea
                          rows="3"
                          name="message"
                          id="message"
                          onChange={handleChangeData}
                          value={addFormData.message}
                          placeholder="Type Your Message Here..."
                          className="form-input"
                        ></textarea>
                      </div>
                      {validationError && validationError != "" ? (
                        <span style={{ color: "red" }}>
                          * {validationError}
                        </span>
                      ) : (
                        ""
                      )}
                      {submissionSuccess && (
                        <p style={{ color: "green", marginTop: "10px" }}>
                          Contact inquiry submitted successfully!
                        </p>
                      )}
                      <div className="form-actions">
                        {showRecaptcha && (
                          <div className="recaptcha">
                            <ReCAPTCHA
                              sitekey={RECAPTCHA_SITE_KEY}
                              onChange={handleRecaptchaChange}
                            />
                          </div>
                        )}

                        <input
                          style={
                            loading || (!recaptchaValue && showRecaptcha) // Disable if loading, recaptchaValue is false, and showRecaptcha is true
                              ? { cursor: "not-allowed" }
                              : {}
                          }
                          className="btn-primary mt-3"
                          type="submit"
                          value={loading ? "Sending..." : "Submit Information"}
                          disabled={
                            loading || (!recaptchaValue && showRecaptcha)
                          }
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Contact;
