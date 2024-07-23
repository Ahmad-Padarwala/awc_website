import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "@/layouts/Header";
import Link from "next/link";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import { Editor } from "@tinymce/tinymce-react";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import Loading from "@/layouts/Loading";

const EditProdCategory = () => {
  const router = useRouter();

  let cateId = router.query.id;
  const [getActiveCateData, setGetActiveCateData] = useState([]);
  const [editProductCategoryData, setEditProductCategoryData] = useState({
    category_name: "",
    category_title: "",
    meta_description: "",
    canonical_url: "",
    category_description: "",
    category_image: null,
    sub_category: "",
  });
  const [editMetaTag, setEditMetaTag] = useState([]);
  const [editMetaKeyword, setEditMetaKeyword] = useState([]);
  const [loading, setLoading] = useState(true);

  //tabs
  const [activeTab, setActiveTab] = useState("general");
  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  //get active category
  const getActiveCategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategorychanges/router`
      );
      setGetActiveCateData(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //get category with id
  const getProductCategoryForEdit = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/productcategory/${id}`
      );
      setEditProductCategoryData(response.data[0]);
      console.log(response.data[0]);
      const keyString = response.data[0].meta_keyword;
      setEditMetaKeyword(keyString.trim() !== "" ? keyString.split(",") : []);
      const tagString = response.data[0].meta_tag;
      setEditMetaTag(tagString.trim() !== "" ? tagString.split(",") : []);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  //editor
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setEditProductCategoryData((prevData) => ({
      ...prevData,
      category_description: content,
    }));
  };
  //end

  //edit cate
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProductCategoryData((prevProdData) => ({
      ...prevProdData,
      [name]: value,
    }));
  };

  // handle file change

  const [selectedImage, setSelectedImage] = useState(null);

  const handleEditFileChange = (event) => {
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

    setEditProductCategoryData((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
    setSelectedImage(file);
  };

  //for validation
  const validateForm = () => {
    const requiredFields = ["category_name", "category_image"];
    for (const field of requiredFields) {
      if (!editProductCategoryData[field]) {
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

  // update category
  const saveEditCategoryData = async (e) => {
    setLoading(true);
    if (!validateForm()) {
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append("category_name", editProductCategoryData.category_name);
      formdata.append("category_title", editProductCategoryData.category_title);
      formdata.append(
        "meta_description",
        editProductCategoryData.meta_description
      );
      formdata.append("canonical_url", editProductCategoryData.canonical_url);
      // formdata.append(
      //   "category_description",
      //   editProductCategoryData.category_description
      // );
      formdata.append("category_description", editorRef.current.getContent());
      formdata.append("category_image", editProductCategoryData.category_image);
      formdata.append("sub_category", editProductCategoryData.sub_category);
      formdata.append("meta_tag", editMetaTag);
      formdata.append("meta_keyword", editMetaKeyword);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      };

      console.log(cateId);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/productcategory/${cateId}`;
      const res = await axios.patch(url, formdata, config);
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      router.push("/admin/product-category");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // edit meta keyword
  const handleKeyword = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const newKeyword = event.target.value.trim();
      if (newKeyword) {
        setEditMetaKeyword([...editMetaKeyword, newKeyword]);
        event.target.value = "";
      } else {
        ErrorToast("Please Write Keyword");
      }
    }
  };
  const RemoveKeyword = (idx) => {
    const newArray = [...editMetaKeyword];
    newArray.splice(idx, 1);
    setEditMetaKeyword(newArray);
  };

  // edit meta tags
  const handleTags = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const newTag = event.target.value.trim();
      if (newTag) {
        setEditMetaTag([...editMetaTag, newTag]);
        event.target.value = "";
      } else {
        ErrorToast("Please Write Tag");
      }
    }
  };
  const RemoveTags = (idx) => {
    const newArray = [...editMetaTag];
    newArray.splice(idx, 1);
    setEditMetaTag(newArray);
  };

  useEffect(() => {
    getActiveCategoryData();
    getProductCategoryForEdit(cateId);
  }, [cateId]);
  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Edit Product Category</p>
          <p>
            <Link href="/admin/admindashboar">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Product Category</span>
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
            <form>
              <div className="mb-3">
                <label htmlFor="category_name" className="modal_label">
                  Category Name:-
                  <span style={{ color: "red" }}> *</span>
                </label>
                <input
                  type="text"
                  id="category_name"
                  name="category_name"
                  className="modal_input"
                  placeholder="Enter Category Name"
                  onChange={handleEditChange}
                  value={editProductCategoryData?.category_name}
                  required
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
                  onChange={handleEditChange}
                  value={editProductCategoryData?.category_title}
                />
              </div>
              <div className="mb-3">
                <p className="modal_label">Category Description:-</p>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={editProductCategoryData?.category_description}
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
                </label>
                <input
                  type="file"
                  id="category_image"
                  name="category_image"
                  className="modal_input"
                  accept="image/*"
                  onChange={handleEditFileChange}
                />
              </div>
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  width="100px"
                  height="100px"
                  alt="category_image"
                />
              ) : (
                <img
                  src={`/assets/upload/product-category/${editProductCategoryData?.category_image}`}
                  width="100px"
                  height="100px"
                  className="modal_data_image"
                  alt="category_image"
                />
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
                  onChange={handleEditChange}
                  value={editProductCategoryData?.sub_category}
                >
                  <option value={0}>Choose Sub Category</option>
                  {getActiveCateData.map((cate) => {
                    if (
                      cate.category_id != cateId &&
                      cate.sub_category != cateId
                    )
                      return (
                        <option
                          selected={
                            cate.category_id ==
                            editProductCategoryData.sub_category
                          }
                          key={cate.category_id}
                          value={cate.category_id}
                        >
                          {cate.category_name}
                        </option>
                      );
                  })}
                </select>
              </div>
              <div className="mb-3">
                {/* <button
                  type="button"
                  onClick={() =>
                    saveEditCategoryData(editProductCategoryData.category_id)
                  }
                  className="success_btn"
                >
                  SAVE
                </button> */}
                <input
                  onClick={() =>
                    saveEditCategoryData(editProductCategoryData.category_id)
                  }
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  type="submit"
                  value={loading ? "Editing..." : "SAVE"}
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
            <form>
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
                {editMetaTag.length > 0 && (
                  <div className="meta_main_section">
                    {editMetaTag.map((tag, index) => (
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
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="meta_keyword" className="modal_label">
                  Meta Keyword:-
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
                {editMetaKeyword.length > 0 && (
                  <div className="meta_main_section">
                    {editMetaKeyword.map((keyword, index) => (
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
                )}
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
                  onChange={handleEditChange}
                  value={editProductCategoryData?.meta_description}
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
                  onChange={handleEditChange}
                  value={editProductCategoryData?.canonical_url}
                />
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() =>
                    saveEditCategoryData(editProductCategoryData.category_id)
                  }
                  className="success_btn"
                >
                  SAVE
                </button>
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

export default EditProdCategory;
