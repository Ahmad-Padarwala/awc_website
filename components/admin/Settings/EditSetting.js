import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/router";
import Header from "@/layouts/Header";
import Loading from "@/layouts/Loading";
import Link from "next/link";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import { toast } from "react-toastify";

const EditSetting = () => {
  // USESTATE VARIABLE
  // Genral Tab
  const [generalData, setGeneralData] = useState({
    email: "",
    number: "",
    username: "",
    password: "",
    favicon: null,
    logo: null,
  });
  const [settingImg, setSettingImg] = useState({
    favicon: null,
    logo: null,
  });

  //SOCIAL TAB VARIABLES
  const [socialData, setSocialData] = useState({
    whatsapp: "",
    facebook: "",
    instagram: "",
    twiter: "",
    youtube: "",
    linkedin: "",
  });

  //SEO TAB VAR
  const [seoData, setSeoData] = useState({
    home_title: "",
    home_keyword: "",
    home_desc: "",
    home_canonical: "",
    about_title: "",
    about_keyword: "",
    about_desc: "",
    about_canonical: "",
    product_title: "",
    product_keyword: "",
    product_desc: "",
    product_canonical: "",
    gallery_title: "",
    gallery_keyword: "",
    gallery_desc: "",
    gallery_canonical: "",
    carrer_title: "",
    carrer_keyword: "",
    carrer_desc: "",
    carrer_canonical: "",
    blog_title: "",
    blog_keyword: "",
    blog_desc: "",
    blog_canonical: "",
    testimonial_title: "",
    testimonial_keyword: "",
    testimonial_desc: "",
    testimonial_canonical: "",
    privacy_title: "",
    privacy_keyword: "",
    privacy_desc: "",
    privacy_canonical: "",
  });

  //GLOBAL TAB VARIABLES
  const [globalData, setGlobalData] = useState({
    header: "",
    footer: "",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [activeSubTab, setActiveSubTab] = useState("home");
  //Soceal Media Tab

  const [loading, setLoading] = useState(false);

  //ROUTER
  const router = useRouter();

  // HANDLE TABS
  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  // HANDLE SUB TABS
  const showSubTab = (tabId) => {
    setActiveSubTab(tabId);
  };

  //ADD PRODUCT DATA AND PRODUCT HANDLER
  const handleChangeProduct = (event) => {
    const { name, value } = event.target;
    setGeneralData((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };
  const handleAddFileChange = (event) => {
    const file = event.target.files[0];
    setGeneralData((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
    setSettingImg((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };

  // ADD GENERAL DATA
  const AddGeneralData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);
    // mobile number validation
    if (isNaN(generalData.number)) {
      ErrorToast("must write digits only");
      setLoading(false);
      return false;
    }
    if (generalData.number.length != 10) {
      ErrorToast("must write 10 digits only");
      setLoading(false);
      return false;
    }
    //emqail validation
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
    if (!regEmail.test(generalData.email)) {
      ErrorToast("Please enter a valid e-mail address");
      setLoading(false);
      return false;
    }
    try {
      const formdata = new FormData();
      formdata.append("email", generalData.email);
      formdata.append("number", generalData.number);
      formdata.append("username", generalData.username);
      formdata.append("password", generalData.password);
      formdata.append("favicon", generalData.favicon);
      formdata.append("logo", generalData.logo);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/${1}`,
        formdata
      );
      setLoading(false);
      toast.success("Data updated successfully!");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //get Genral data
  const getGeneralData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/${1}`
      );
      console.log(response.data);
      setGeneralData({
        email: response.data[0].email,
        number: response.data[0].number,
        username: response.data[0].username,
        password: response.data[0].password,
        favicon: response.data[0].favicon,
        logo: response.data[0].logo,
      });
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //SOCIAL HANDLE
  const handleChangeSocial = (event) => {
    const { name, value } = event.target;
    setSocialData((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };

  // ADD SOCIAL DATA
  const addSocialData = async (e) => {
    e.preventDefault();
    console.log(socialData);
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("whatsapp", socialData.whatsapp);
      formdata.append("facebook", socialData.facebook);
      formdata.append("twiter", socialData.twiter);
      formdata.append("instagram", socialData.instagram);
      formdata.append("youtube", socialData.youtube);
      formdata.append("linkedin", socialData.linkedin);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/social/${1}`,
        formdata
      );
      setLoading(false);
      toast.success("Data updated successfully!");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //get social data
  const getSocialData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/social/${1}`
      );
      console.log(response.data);
      setSocialData({
        whatsapp: response.data[0].whatsapp_link,
        facebook: response.data[0].facebook_link,
        instagram: response.data[0].instagram_link,
        twiter: response.data[0].twiter_link,
        youtube: response.data[0].youtube_link,
        linkedin: response.data[0].linkedin_link,
      });
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //SEO
  //SEO HANDLE
  const handleChangeSEO = (event) => {
    const { name, value } = event.target;
    setSeoData((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };

  // Keyword Handle for Multiple Fields
  const handleSEOKeyword = (field, event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const value = event.target.value.trim();
      if (value === "") {
        ErrorToast("Please Write Keyword");
        return;
      }
      setSeoData((prevData) => ({
        ...prevData,
        [field]: [...(prevData[field] || []), value],
      }));
      event.target.value = "";
    }
  };

  const removeSEOKeyword = (field, idx) => {
    setSeoData((prevData) => {
      const newArray = [...(prevData[field] || [])];
      newArray.splice(idx, 1);
      return {
        ...prevData,
        [field]: newArray,
      };
    });
  };

  // ADD SOCIAL DATA
  const addSEOData = async (e) => {
    e.preventDefault();
    console.log(seoData);
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("home_title", seoData.home_title);
      formdata.append("home_keyword", seoData.home_keyword);
      formdata.append("home_desc", seoData.home_desc);
      formdata.append("home_canonical", seoData.home_canonical);
      formdata.append("about_title", seoData.about_title);
      formdata.append("about_keyword", seoData.about_keyword);
      formdata.append("about_desc", seoData.about_desc);
      formdata.append("about_canonical", seoData.about_canonical);
      formdata.append("product_title", seoData.product_title);
      formdata.append("product_keyword", seoData.product_keyword);
      formdata.append("product_desc", seoData.product_desc);
      formdata.append("product_canonical", seoData.product_canonical);
      formdata.append("gallery_title", seoData.gallery_title);
      formdata.append("gallery_keyword", seoData.gallery_keyword);
      formdata.append("gallery_desc", seoData.gallery_desc);
      formdata.append("gallery_canonical", seoData.gallery_canonical);
      formdata.append("carrer_title", seoData.carrer_title);
      formdata.append("carrer_keyword", seoData.carrer_keyword);
      formdata.append("carrer_desc", seoData.carrer_desc);
      formdata.append("carrer_canonical", seoData.carrer_canonical);
      formdata.append("blog_title", seoData.blog_title);
      formdata.append("blog_keyword", seoData.blog_keyword);
      formdata.append("blog_desc", seoData.blog_desc);
      formdata.append("blog_canonical", seoData.blog_canonical);
      formdata.append("testimonial_title", seoData.testimonial_title);
      formdata.append("testimonial_keyword", seoData.testimonial_keyword);
      formdata.append("testimonial_desc", seoData.testimonial_desc);
      formdata.append("testimonial_canonical", seoData.testimonial_canonical);
      formdata.append("privacy_title", seoData.privacy_title);
      formdata.append("privacy_keyword", seoData.privacy_keyword);
      formdata.append("privacy_desc", seoData.privacy_desc);
      formdata.append("privacy_canonical", seoData.privacy_canonical);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/seo/${1}`,
        formdata
      );
      setLoading(false);
      toast.success("Data updated successfully!");
    } catch (error) {
      console.log("object");
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //get SEO data
  const getSeoData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/seo/${1}`
      );
      console.log(response.data);
      const homekw = response.data[0].home_keyword;
      const aboutkw = response.data[0].about_keyword;
      const productkw = response.data[0].product_keyword;
      const gallerykw = response.data[0].gallery_keyword;
      const carrerkw = response.data[0].carrer_keyword;
      const blogkw = response.data[0].blog_keyword;
      const testimonialkw = response.data[0].testimonial_keyword;
      const privacykw = response.data[0].privacy_keyword;

      setSeoData({
        home_title: response.data[0].home_title,
        home_keyword: homekw.split(","),
        home_desc: response.data[0].home_desc,
        home_canonical: response.data[0].home_canonical,
        about_title: response.data[0].about_title,
        about_keyword: aboutkw.split(","),
        about_desc: response.data[0].about_desc,
        about_canonical: response.data[0].about_canonical,
        product_title: response.data[0].product_title,
        product_keyword: productkw.split(","),
        product_desc: response.data[0].product_desc,
        product_canonical: response.data[0].product_canonical,
        gallery_title: response.data[0].gallery_title,
        gallery_keyword: gallerykw.split(","),
        gallery_desc: response.data[0].gallery_desc,
        gallery_canonical: response.data[0].gallery_canonical,
        carrer_title: response.data[0].carrer_title,
        carrer_keyword: carrerkw.split(","),
        carrer_desc: response.data[0].carrer_desc,
        carrer_canonical: response.data[0].carrer_canonical,
        blog_title: response.data[0].blog_title,
        blog_keyword: blogkw.split(","),
        blog_desc: response.data[0].blog_desc,
        blog_canonical: response.data[0].blog_canonical,
        testimonial_title: response.data[0].testimonial_title,
        testimonial_keyword: testimonialkw.split(","),
        testimonial_desc: response.data[0].testimonial_desc,
        testimonial_canonical: response.data[0].testimonial_canonical,
        privacy_title: response.data[0].privacy_title,
        privacy_keyword: privacykw.split(","),
        privacy_desc: response.data[0].privacy_desc,
        privacy_canonical: response.data[0].privacy_canonical,
      });
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //GLOBAL
  //GLOBAL HANDLE
  const handleChangeGlobal = (event) => {
    const { name, value } = event.target;
    setGlobalData((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };

  // ADD SOCIAL DATA
  const addGlobalData = async (e) => {
    e.preventDefault();
    console.log(globalData);
    window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("header", globalData.header);
      formdata.append("footer", globalData.footer);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/global/${1}`,
        formdata
      );
      setLoading(false);
      toast.success("Data updated successfully!");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //get social data
  const getSocialGlobal = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/global/${1}`
      );
      console.log(response.data);
      setGlobalData({
        header: response.data[0].header,
        footer: response.data[0].footer,
      });
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGeneralData();
    getSocialData();
    getSeoData();
    getSocialGlobal();
  }, []);

  return (
    <>
      {/* LOADING SECTION */}
      {loading && <Loading />}

      {/* HOME SECTION */}
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Edit Setting</p>
        </div>
        {/* TABS */}
        <div className="tabs-container">
          <div className="tabs">
            <div style={{ display: "flex" }}>
              <div
                className={`tab ${activeTab === "general" ? "active" : ""}`}
                onClick={() => showTab("general")}
              >
                General
              </div>
              <div
                className={`tab ${
                  activeTab === "social-media" ? "active" : ""
                }`}
                onClick={() => showTab("social-media")}
              >
                Social Media
              </div>
              <div
                className={`tab ${activeTab === "global" ? "active" : ""}`}
                onClick={() => showTab("global")}
              >
                Global
              </div>
              <div
                className={`tab ${activeTab === "seo" ? "active" : ""}`}
                onClick={() => showTab("seo")}
              >
                SEO
              </div>
            </div>
          </div>
          {/* GENREL TABS */}
          <div
            id="general"
            className={`tab-content add_data_form ${
              activeTab === "general" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={AddGeneralData}>
              <div className="mb-3">
                <label htmlFor="email" className="modal_label">
                  Email :-
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="modal_input"
                  placeholder="Enter Email"
                  onChange={handleChangeProduct}
                  value={generalData && generalData.email}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="number" className="modal_label">
                  Contact Number :-
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  className="modal_input"
                  placeholder="Enter Contact Number"
                  onChange={handleChangeProduct}
                  value={generalData && generalData.number}
                />
              </div>

              <div className="mb-3">
                <div className="two_input_flex">
                  <div style={{ width: "48%" }}>
                    <label htmlFor="favicon" className="modal_label">
                      Favicon:-
                    </label>
                  </div>
                  <div style={{ width: "48%" }}>
                    <label htmlFor="favicon" className="modal_label">
                      Preview
                    </label>
                  </div>
                </div>
                <div className="two_input_flex">
                  <div style={{ width: "48%" }}>
                    <input
                      type="file"
                      id="favicon"
                      name="favicon"
                      className="modal_input"
                      accept="image/*"
                      onChange={handleAddFileChange}
                    />
                  </div>
                  <div style={{ width: "48%" }}>
                    <div>
                      {settingImg.favicon ? (
                        <img
                          src={URL.createObjectURL(
                            generalData && settingImg.favicon
                          )}
                          width="100px"
                          height="100px"
                          alt="profile"
                        />
                      ) : (
                        <img
                          src={`/assets/upload/setting/${
                            generalData && generalData.favicon
                          }`}
                          width="100px"
                          height="100px"
                          alt="Add Favicon"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="two_input_flex">
                  <div style={{ width: "48%" }}>
                    <label htmlFor="logo" className="modal_label">
                      Logo:-
                    </label>
                  </div>
                  <div style={{ width: "48%" }}>
                    <label htmlFor="Preview" className="modal_label">
                      Preview
                    </label>
                  </div>
                </div>
                <div className="two_input_flex">
                  <div style={{ width: "48%" }}>
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      className="modal_input"
                      accept="image/*"
                      onChange={handleAddFileChange}
                    />
                  </div>
                  <div style={{ width: "48%" }}>
                    <div>
                      {settingImg.logo ? (
                        <img
                          src={URL.createObjectURL(
                            settingImg && settingImg.logo
                          )}
                          width="100px"
                          height="100px"
                          alt="profile"
                        />
                      ) : (
                        <img
                          src={`/assets/upload/setting/${
                            generalData && generalData.logo
                          }`}
                          width="100px"
                          height="100px"
                          alt="Add Logo"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="modal_label">
                  Username :-
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="modal_input"
                  placeholder="Enter Username"
                  onChange={handleChangeProduct}
                  value={generalData && generalData.username}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="modal_label">
                  Password :-
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  className="modal_input"
                  placeholder="Enter Password"
                  onChange={handleChangeProduct}
                  value={generalData && generalData.password}
                  required
                />
              </div>

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
                <Link href="/admin/settings">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* social-media TAB */}
          <div
            id="social-media"
            className={`tab-content add_data_form ${
              activeTab === "social-media" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={addSocialData}>
              <div className="mb-3">
                <label htmlFor="whatsapp" className="modal_label">
                  Whatsapp:-
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  className="modal_input"
                  placeholder="Enter Whatsapp"
                  onChange={handleChangeSocial}
                  value={socialData.whatsapp}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="facebook" className="modal_label">
                  Facebook:-
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  className="modal_input"
                  placeholder="Enter Facebook"
                  onChange={handleChangeSocial}
                  value={socialData && socialData.facebook}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="twiter" className="modal_label">
                  Twiter:-
                </label>
                <input
                  type="text"
                  id="twiter"
                  name="twiter"
                  className="modal_input"
                  placeholder="Enter Twiter"
                  onChange={handleChangeSocial}
                  value={socialData && socialData.twiter}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="instagram" className="modal_label">
                  Instagram:-
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  className="modal_input"
                  placeholder="Enter Instagram"
                  onChange={handleChangeSocial}
                  value={socialData && socialData.instagram}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="youtube" className="modal_label">
                  YouTube:-
                </label>
                <input
                  type="text"
                  id="youtube"
                  name="youtube"
                  className="modal_input"
                  placeholder="Enter Youtube"
                  onChange={handleChangeSocial}
                  value={socialData && socialData.youtube}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="linkedin" className="modal_label">
                  LinkedIn:-
                </label>
                <input
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  className="modal_input"
                  placeholder="Enter LinkedIn"
                  onChange={handleChangeSocial}
                  value={socialData && socialData.linkedin}
                />
              </div>

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
                <Link href="/admin/settings">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* GLOBAL TAB */}
          <div
            id="global"
            className={`tab-content add_data_form ${
              activeTab === "global" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={addGlobalData}>
              <div className="mb-3">
                <label htmlFor="header" className="modal_label">
                  Global Header:-
                </label>
                <textarea
                  type="text"
                  rows="10"
                  cols="70"
                  id="header"
                  name="header"
                  className="modal_input"
                  placeholder="Enter Global Header"
                  onChange={handleChangeGlobal}
                  value={globalData && globalData.header}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="footer" className="modal_label">
                  Global Footer:-
                </label>
                <textarea
                  type="text"
                  rows="10"
                  cols="70"
                  id="footer"
                  name="footer"
                  className="modal_input"
                  placeholder="Enter Global Footer"
                  onChange={handleChangeGlobal}
                  value={globalData && globalData.footer}
                />
              </div>

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
                <Link href="/admin/settings">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* SEO TAB */}
          <div
            id="seo"
            className={`tab-content add_data_form ${
              activeTab === "seo" ? "active" : ""
            }`}
          >
            <div className="sub-tabs-container">
              <div className="tabs">
                <div style={{ display: "flex" }}>
                  <div
                    className={`tab ${activeSubTab === "home" ? "active" : ""}`}
                    onClick={() => showSubTab("home")}
                  >
                    Home
                  </div>
                  <div
                    className={`tab ${
                      activeSubTab === "about" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("about")}
                  >
                    About
                  </div>
                  <div
                    className={`tab ${
                      activeSubTab === "product" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("product")}
                  >
                    Product
                  </div>
                  <div
                    className={`tab ${
                      activeSubTab === "gallery" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("gallery")}
                  >
                    Gallery
                  </div>

                  <div
                    className={`tab ${
                      activeSubTab === "carrer" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("carrer")}
                  >
                    Career
                  </div>

                  <div
                    className={`tab ${activeSubTab === "blog" ? "active" : ""}`}
                    onClick={() => showSubTab("blog")}
                  >
                    Blog
                  </div>

                  <div
                    className={`tab ${
                      activeSubTab === "testimonial" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("testimonial")}
                  >
                    Testimonial
                  </div>

                  {/* <div
                    className={`tab ${
                      activeSubTab === "privacyPolicy" ? "active" : ""
                    }`}
                    onClick={() => showSubTab("privacyPolicy")}
                  >
                    Privacy Policy
                  </div> */}
                </div>
              </div>
              <form method="post" onSubmit={addSEOData}>
                <div
                  id="home"
                  className={`tab-content add_data_form ${
                    activeSubTab === "home" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="home_title" className="modal_label">
                      Home Title:-
                    </label>
                    <input
                      type="text"
                      id="home_title"
                      name="home_title"
                      className="modal_input"
                      placeholder="Enter Home Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.home_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="home_keyword" className="modal_label">
                      Home Keywords:-
                    </label>
                    <input
                      type="text"
                      id="home_keyword"
                      name="home_keyword"
                      className="modal_input"
                      placeholder="Enter Home Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("home_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.home_keyword &&
                        seoData.home_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("home_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="home_desc" className="modal_label">
                      Home Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="home_desc"
                      name="home_desc"
                      className="modal_input"
                      placeholder="Enter Home Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.home_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="home_canonical" className="modal_label">
                      Home Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="home_canonical"
                      name="home_canonical"
                      className="modal_input"
                      placeholder="Enter Home Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.home_canonical}
                    />
                  </div>
                </div>

                <div
                  id="about"
                  className={`tab-content add_data_form ${
                    activeSubTab === "about" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="about_title" className="modal_label">
                      About Title:-
                    </label>
                    <input
                      type="text"
                      id="about_title"
                      name="about_title"
                      className="modal_input"
                      placeholder="Enter About Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.about_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="about_keyword" className="modal_label">
                      About Keywords:-
                    </label>
                    <input
                      type="text"
                      id="about_keyword"
                      name="about_keyword"
                      className="modal_input"
                      placeholder="Enter about Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("about_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.about_keyword &&
                        seoData.about_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("about_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="about_desc" className="modal_label">
                      About Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="about_desc"
                      name="about_desc"
                      className="modal_input"
                      placeholder="Enter about Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.about_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="about_canonical" className="modal_label">
                      About Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="about_canonical"
                      name="about_canonical"
                      className="modal_input"
                      placeholder="Enter about Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.about_canonical}
                    />
                  </div>
                </div>

                <div
                  id="product"
                  className={`tab-content add_data_form ${
                    activeSubTab === "product" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="product_title" className="modal_label">
                      Product Title:-
                    </label>
                    <input
                      type="text"
                      id="product_title"
                      name="product_title"
                      className="modal_input"
                      placeholder="Enter Product Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.product_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="product_keyword" className="modal_label">
                      Product Keywords:-
                    </label>
                    <input
                      type="text"
                      id="product_keyword"
                      name="product_keyword"
                      className="modal_input"
                      placeholder="Enter Product Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("product_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.product_keyword &&
                        seoData.product_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("product_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="product_desc" className="modal_label">
                      Product Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="product_desc"
                      name="product_desc"
                      className="modal_input"
                      placeholder="Enter Product Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.product_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="product_canonical" className="modal_label">
                      Product Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="product_canonical"
                      name="product_canonical"
                      className="modal_input"
                      placeholder="Enter Product Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.product_canonical}
                    />
                  </div>
                </div>

                <div
                  id="gallery"
                  className={`tab-content add_data_form ${
                    activeSubTab === "gallery" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="gallery_title" className="modal_label">
                      Gallery Title:-
                    </label>
                    <input
                      type="text"
                      id="gallery_title"
                      name="gallery_title"
                      className="modal_input"
                      placeholder="Enter gallery Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.gallery_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gallery_keyword" className="modal_label">
                      Gallery Keywords:-
                    </label>
                    <input
                      type="text"
                      id="gallery_keyword"
                      name="gallery_keyword"
                      className="modal_input"
                      placeholder="Enter gallery Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("gallery_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.gallery_keyword &&
                        seoData.gallery_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("gallery_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="gallery_desc" className="modal_label">
                      Gallery Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="gallery_desc"
                      name="gallery_desc"
                      className="modal_input"
                      placeholder="Enter gallery Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.gallery_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gallery_canonical" className="modal_label">
                      Gallery Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="gallery_canonical"
                      name="gallery_canonical"
                      className="modal_input"
                      placeholder="Enter gallery Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.gallery_canonical}
                    />
                  </div>
                </div>

                <div
                  id="carrer"
                  className={`tab-content add_data_form ${
                    activeSubTab === "carrer" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="carrer_title" className="modal_label">
                      Carrer Title:-
                    </label>
                    <input
                      type="text"
                      id="carrer_title"
                      name="carrer_title"
                      className="modal_input"
                      placeholder="Enter Carrer Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.carrer_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="carrer_keyword" className="modal_label">
                      Carrer Keywords:-
                    </label>
                    <input
                      type="text"
                      id="carrer_keyword"
                      name="carrer_keyword"
                      className="modal_input"
                      placeholder="Enter Carrer Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("carrer_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.carrer_keyword &&
                        seoData.carrer_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("carrer_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="carrer_desc" className="modal_label">
                      Carrer Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="carrer_desc"
                      name="carrer_desc"
                      className="modal_input"
                      placeholder="Enter Carrer Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.carrer_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="carrer_canonical" className="modal_label">
                      Carrer Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="carrer_canonical"
                      name="carrer_canonical"
                      className="modal_input"
                      placeholder="Enter Carrer Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.carrer_canonical}
                    />
                  </div>
                </div>

                <div
                  id="blog"
                  className={`tab-content add_data_form ${
                    activeSubTab === "blog" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="blog_title" className="modal_label">
                      Blog Title:-
                    </label>
                    <input
                      type="text"
                      id="blog_title"
                      name="blog_title"
                      className="modal_input"
                      placeholder="Enter Blog Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.blog_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="blog_keyword" className="modal_label">
                      Blog Keywords:-
                    </label>
                    <input
                      type="text"
                      id="blog_keyword"
                      name="blog_keyword"
                      className="modal_input"
                      placeholder="Enter Blog Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("blog_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.blog_keyword &&
                        seoData.blog_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("blog_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="blog_desc" className="modal_label">
                      Blog Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="blog_desc"
                      name="blog_desc"
                      className="modal_input"
                      placeholder="Enter Blog Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.blog_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="blog_canonical" className="modal_label">
                      Blog Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="blog_canonical"
                      name="blog_canonical"
                      className="modal_input"
                      placeholder="Enter Blog Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.blog_canonical}
                    />
                  </div>
                </div>

                <div
                  id="testimonial"
                  className={`tab-content add_data_form ${
                    activeSubTab === "testimonial" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="testimonial_title" className="modal_label">
                      Testimonial Title:-
                    </label>
                    <input
                      type="text"
                      id="testimonial_title"
                      name="testimonial_title"
                      className="modal_input"
                      placeholder="Enter Testimonial Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.testimonial_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="testimonial_keyword"
                      className="modal_label"
                    >
                      Testimonial Keywords:-
                    </label>
                    <input
                      type="text"
                      id="testimonial_keyword"
                      name="testimonial_keyword"
                      className="modal_input"
                      placeholder="Enter Testimonial Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("testimonial_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.testimonial_keyword &&
                        seoData.testimonial_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("testimonial_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="testimonial_desc" className="modal_label">
                      Testimonial Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="testimonial_desc"
                      name="testimonial_desc"
                      className="modal_input"
                      placeholder="Enter Testimonial Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.testimonial_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="testimonial_canonical"
                      className="modal_label"
                    >
                      Testimonial Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="testimonial_canonical"
                      name="testimonial_canonical"
                      className="modal_input"
                      placeholder="Enter Testimonial Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.testimonial_canonical}
                    />
                  </div>
                </div>

                {/* <div
                  id="privacyPolicy"
                  className={`tab-content add_data_form ${
                    activeSubTab === "privacyPolicy" ? "active" : ""
                  }`}
                >
                  <div className="mb-3">
                    <label htmlFor="privacy_title" className="modal_label">
                      Privacy Title:-
                    </label>
                    <input
                      type="text"
                      id="privacy_title"
                      name="privacy_title"
                      className="modal_input"
                      placeholder="Enter Privacy Title"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.privacy_title}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="privacy_keyword" className="modal_label">
                      Privacy Keywords:-
                    </label>
                    <input
                      type="text"
                      id="privacy_keyword"
                      name="privacy_keyword"
                      className="modal_input"
                      placeholder="Enter Privacy Keywords"
                      onKeyDown={(event) =>
                        handleSEOKeyword("privacy_keyword", event)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <div className="meta_main_section">
                      {seoData.privacy_keyword &&
                        seoData.privacy_keyword.map((keyword, index) => (
                          <div className="meta_tag_section" key={index}>
                            <div className="meta_tag_text">{keyword}</div>
                            <div
                              className="meta_remove_icon"
                              onClick={() =>
                                removeSEOKeyword("privacy_keyword", index)
                              }
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="privacy_desc" className="modal_label">
                      Privacy Description:-
                    </label>
                    <textarea
                      type="text"
                      rows="5"
                      cols="70"
                      id="privacy_desc"
                      name="privacy_desc"
                      className="modal_input"
                      placeholder="Enter Privacy Description"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.privacy_desc}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="privacy_canonical" className="modal_label">
                      Privacy Canonical Url:-
                    </label>
                    <input
                      type="text"
                      id="privacy_canonical"
                      name="privacy_canonical"
                      className="modal_input"
                      placeholder="Enter Privacy Canonical Url"
                      onChange={handleChangeSEO}
                      value={seoData && seoData.privacy_canonical}
                    />
                  </div>
                </div> */}
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
                  <Link href="/admin/settings">
                    <button type="button" className="success_btn cancel_btn">
                      CANCEL
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Toast />
      </section>
    </>
  );
};

export default EditSetting;
