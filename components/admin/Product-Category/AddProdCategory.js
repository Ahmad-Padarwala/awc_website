import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "@/layouts/Header";
import Link from "next/link";
import { useRouter } from "next/router";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import { Editor } from "@tinymce/tinymce-react";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import Loading from "@/layouts/Loading";

const AddProdCategory = () => {
  const router = useRouter();
  const [getActiveCateData, setGetActiveCateData] = useState([]);
  const [addProductCategoryData, setAddProductCategoryData] = useState({
    category_name: "",
    category_title: "",
    meta_description: "",
    canonical_url: "",
    category_description: "",
    category_image: null,
    sub_category: "",
  });
  const [addMetaTag, setAddMetaTag] = useState([]);
  const [addMetaKeyword, setAddMetaKeyword] = useState([]);
  const [loading, setLoading] = useState(false);

  // tabs
  const [activeTab, setActiveTab] = useState("general");

  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  //get active category
  const getActiveCategoryData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategorychanges/router`
      );
      console.log(response.data[0]);
      setGetActiveCateData(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //editor
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setAddProductCategoryData((prevData) => ({
      ...prevData,
      category_description: content,
    }));
  };
  //end

  //add product data section start
  const handleChangeProductCategory = (event) => {
    const { name, value } = event.target;
    setAddProductCategoryData((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };
  const handleAddFileChange = (event) => {
    const file = event.target.files[0];

    // Check if the file has a valid extension
    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      // Reset the input value to clear the invalid file
      event.target.value = "";
      WarningToast("Please add the JPG, JPEG, PNG & WEBP format file");
      return;
    }

    setAddProductCategoryData((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };

  //for validation
  const validateForm = () => {
    const requiredFields = ["category_name", "category_image"];
    for (const field of requiredFields) {
      if (!addProductCategoryData[field]) {
        if (field == "category_name") {
          ErrorToast(`Category Name is Required`);
          return false;
        } else if (field == "category_image") {
          ErrorToast(`Category Image is Required`);
          return false;
        }
      }
    }
    return true;
  };

  //save category
  const addCategoryData = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // window.scrollTo({ behavior: "smooth", top: 0 });
    setLoading(true);

    if (addProductCategoryData.category_name === "") {
      WarningToast("Please Enter the Category Name");
    }

    try {
      const formdata = new FormData();
      formdata.append("category_name", addProductCategoryData.category_name);
      formdata.append("category_title", addProductCategoryData.category_title);
      formdata.append(
        "meta_description",
        addProductCategoryData.meta_description
      );
      formdata.append("canonical_url", addProductCategoryData.canonical_url);
      // formdata.append(
      //   "category_description",
      //   addProductCategoryData.category_description
      //   );
      formdata.append("category_description", editorRef.current.getContent());
      formdata.append("category_image", addProductCategoryData.category_image);
      formdata.append("sub_category", addProductCategoryData.sub_category);
      formdata.append("meta_tag", addMetaTag);
      formdata.append("meta_keyword", addMetaKeyword);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/productcategory/router`;
      const res = await axios.post(url, formdata, config);
      setLoading(false);
      router.push("/admin/product-category");
    } catch (error) {
      console.log(error);
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // add meta keyword
  const handleKeyword = (event) => {
    if (event.key === "Enter" || event.key == ",") {
      event.preventDefault();
      if (event.target.value.trim() === "") {
        ErrorToast("Please Write Keyword");
        return;
      }
      setAddMetaKeyword([...addMetaKeyword, event.target.value.trim()]);
      event.target.value = "";
    }
  };
  const RemoveKeyword = (idx) => {
    const newArray = [...addMetaKeyword];
    newArray.splice(idx, 1);
    setAddMetaKeyword(newArray);
  };

  // add meta tags
  const handleTags = (event) => {
    if (event.key === "Enter" || event.key == ",") {
      event.preventDefault();
      if (event.target.value.trim() === "") {
        ErrorToast("Please Write Tag");
        return;
      }
      setAddMetaTag([...addMetaTag, event.target.value.trim()]);
      event.target.value = "";
    }
  };
  const RemoveTags = (idx) => {
    const newArray = [...addMetaTag];
    newArray.splice(idx, 1);
    setAddMetaTag(newArray);
  };

  useEffect(() => {
    getActiveCategoryData();
  }, []);
  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Add Product Category</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Product Category</span>
          </p>
        </div>
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
                className={`tab ${activeTab === "seo" ? "active" : ""}`}
                onClick={() => showTab("seo")}
              >
                SEO
              </div>
            </div>
          </div>
          <div
            id="general"
            className={`tab-content add_data_form ${
              activeTab === "general" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={addCategoryData}>
              <div className="mb-3">
                <label htmlFor="category_name" className="modal_label">
                  Category Name:- <small style={{ color: "red" }}> *</small>
                </label>
                <input
                  type="text"
                  id="category_name"
                  name="category_name"
                  className="modal_input"
                  placeholder="Enter Category Name"
                  onChange={handleChangeProductCategory}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category_title" className="modal_label">
                  Category Title:-
                </label>
                <input
                  type="text"
                  id="category_title"
                  name="category_title"
                  className="modal_input"
                  placeholder="Enter Category Title"
                  onChange={handleChangeProductCategory}
                />
              </div>
              <div className="mb-3">
                <p className="modal_label">Category Description:-</p>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                  }}
                  onChange={handleEditorChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category_image" className="modal_label">
                  Category Image:-
                  <span style={{ color: "red" }}> *</span>
                </label>
                <input
                  type="file"
                  id="category_image"
                  name="category_image"
                  className="modal_input"
                  accept="image/*"
                  onChange={handleAddFileChange}
                />
              </div>
              {addProductCategoryData.category_image && (
                <div className="mb-3">
                  <img
                    src={URL.createObjectURL(
                      addProductCategoryData.category_image
                    )}
                    alt="Product Category Thumbnail"
                    className="table_data_image"
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="sub_category" className="modal_label">
                  Choose Sub Category:
                </label>
                <select
                  name="sub_category"
                  id="sub_category"
                  form="sub_category"
                  className="modal_input"
                  onChange={handleChangeProductCategory}
                >
                  <option value={0}>Choose Sub Category</option>
                  {getActiveCateData.map((cate) => {
                    return (
                      <option key={cate.category_id} value={cate.category_id}>
                        {cate.category_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="submit"
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Adding..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/product-category">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
          </div>
          <div
            id="seo"
            className={`tab-content add_data_form ${
              activeTab === "seo" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={addCategoryData}>
              <div className="mb-3">
                <label htmlFor="meta_tag" className="modal_label">
                  Meta Tag:-
                </label>
                <input
                  type="text"
                  id="meta_tag"
                  name="meta_tag"
                  className="modal_input"
                  placeholder="Enter Meta Tag"
                  onKeyDown={handleTags}
                />
              </div>
              <div className="mb-3">
                <div className="meta_main_section">
                  {addMetaTag.map((tag, index) => (
                    <div className="meta_tag_section" key={index}>
                      <div className="meta_tag_text">{tag}</div>
                      <div className="meta_remove_icon">
                        <i
                          className="fa-solid fa-xmark"
                          onClick={() => {
                            RemoveTags(index);
                          }}
                        ></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="meta_keyword" className="modal_label">
                  Meta Keayword:-
                </label>
                <input
                  type="text"
                  id="meta_keyword"
                  name="meta_keyword"
                  className="modal_input"
                  placeholder="Enter Meta Keyword"
                  onKeyDown={handleKeyword}
                />
              </div>
              <div className="mb-3">
                <div className="meta_main_section">
                  {addMetaKeyword.map((keyword, index) => (
                    <div className="meta_tag_section" key={index}>
                      <div className="meta_tag_text">{keyword}</div>
                      <div className="meta_remove_icon">
                        <i
                          className="fa-solid fa-xmark"
                          onClick={() => {
                            RemoveKeyword(index);
                          }}
                        ></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="meta_description" className="modal_label">
                  Meta Description:-
                </label>
                <textarea
                  type="text"
                  rows="5"
                  cols="70"
                  id="meta_description"
                  name="meta_description"
                  className="modal_input"
                  placeholder="Enter Meta Description"
                  onChange={handleChangeProductCategory}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="canonical_url" className="modal_label">
                  Canonical URL:-
                </label>
                <input
                  type="text"
                  id="canonical_url"
                  name="canonical_url"
                  className="modal_input"
                  placeholder="Enter Canonical URL"
                  onChange={handleChangeProductCategory}
                />
              </div>
              <div className="mb-3">
                {/* <button type="submit" className="success_btn" value={loading ? "Adding..." : "SAVE"} disabled={loading}>
                  SAVE
                </button> */}
                <input
                  type="submit"
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Adding..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/product-category">
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
    </>
  );
};

export default AddProdCategory;
