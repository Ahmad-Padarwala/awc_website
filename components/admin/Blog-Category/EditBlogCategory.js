import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "@/layouts/Header";
import Link from "next/link";
import Toast, { ErrorToast } from "@/layouts/toast/Toast";
import { Editor } from "@tinymce/tinymce-react";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import Loading from "@/layouts/Loading";

const EditBlogCategory = () => {
  const router = useRouter();
  let cateId = router.query.id;

  const [editBlogCategoryData, setEditBlogCategoryData] = useState({
    category_title: "",
    category_description: "",
    meta_description: "",
    canonical_url: "",
    category_image: null,
    category_icon: null,
  });
  const [editMetaTag, setEditMetaTag] = useState([]);
  const [editMetaKeyword, setEditMetaKeyword] = useState([]);
  const [loading, setLoading] = useState(true);

  //tabs
  const [activeTab, setActiveTab] = useState("general");
  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);

  //get data with id
  const getEditBlogCategory = async (cateId) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/blogcategory/${cateId}`)
      .then((res) => {
        setEditBlogCategoryData(res.data[0]);
        const keyString = res.data[0].meta_keyword;
        setEditMetaKeyword(keyString.trim() !== "" ? keyString.split(",") : []);
        const tagString = res.data[0].meta_tag;
        setEditMetaTag(tagString.trim() !== "" ? tagString.split(",") : []);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
      });
  };

  //editor
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setEditBlogCategoryData((prevData) => ({
      ...prevData,
      category_description: content,
    }));
  };
  //end

  //edit
  const handleEditCategory = async (event) => {
    const { name, value } = event.target;
    setEditBlogCategoryData((prevCateData) => ({
      ...prevCateData,
      [name]: value,
    }));
  };
  const handleEditFileChange = async (event) => {
    const file = event.target.files[0];
    setEditBlogCategoryData((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));

    if (event.target.name == "category_icon") {
      setSelectedIcon(file);
    }
    if (event.target.name == "category_image") {
      setSelectedImage(file);
    }
  };

  //for validation
  const validateForm = () => {
    const requiredFields = [
      "category_title",
      "category_image",
      "category_icon",
    ];
    for (const field of requiredFields) {
      if (!editBlogCategoryData[field]) {
        if (field == "category_title") {
          ErrorToast(`Category Title is Required`);
          return false;
        } else if (field == "category_image") {
          ErrorToast(`Category Image is Required`);
          return false;
        } else if (field == "category_icon") {
          ErrorToast(`Category Icon is Required`);
          return false;
        }
      }
    }
    return true;
  };
  const saveEditCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append("category_title", editBlogCategoryData.category_title);
      // formdata.append(
      //   "category_description",
      //   editBlogCategoryData.category_description
      // );
      formdata.append("category_description", editorRef.current.getContent());
      formdata.append("meta_tag", editMetaTag);
      formdata.append("meta_desc", editBlogCategoryData.meta_description);
      formdata.append("meta_keyword", editMetaKeyword);
      formdata.append("canonical_url", editBlogCategoryData.canonical_url);

      formdata.append("category_image", editBlogCategoryData.category_image);
      formdata.append("category_icon", editBlogCategoryData.category_icon);
      const result = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogcategory/${cateId}`,
        formdata
      );
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      router.push("/admin/blog-category");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  const handleKeyword = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (event.target.value.trim() === "") {
        ErrorToast("Please Write Keyword");
        return;
      }
      setEditMetaKeyword([...editMetaKeyword, event.target.value]);
      event.target.value = "";
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
      if (event.target.value.trim() === "") {
        ErrorToast("Please Write Tag");
        return;
      }
      setEditMetaTag([...editMetaTag, event.target.value.trim()]);
      event.target.value = "";
    }
  };
  const RemoveTags = (idx) => {
    const newArray = [...editMetaTag];
    newArray.splice(idx, 1);
    setEditMetaTag(newArray);
  };

  useEffect(() => {
    getEditBlogCategory(cateId);
  }, [cateId]);
  return (
    <>
      {loading && <Loading />}

      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Edit Blog Category</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Blog Category</span>
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
            <form method="post" onSubmit={saveEditCategory}>
              <div className="mb-3">
                <label htmlFor="editBlog_title" className="modal_label">
                  Category Title:-
                  <small style={{ color: "red" }}> *</small>
                </label>
                <input
                  type="text"
                  id="editBlog_title"
                  name="category_title"
                  className="modal_input"
                  onChange={handleEditCategory}
                  value={editBlogCategoryData?.category_title}
                  placeholder="Enter Category Title"
                />
              </div>
              <div className="mb-3">
                <p className="modal_label">Category Description:-</p>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={editBlogCategoryData?.category_description}
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
                <label htmlFor="editBlog_image" className="modal_label">
                  Blog Image:-
                </label>
                <input
                  type="file"
                  id="editBlog_image"
                  name="category_image"
                  onChange={handleEditFileChange}
                  className="modal_input mb-3"
                  accept="image/*"
                />
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    width="100px"
                    height="100px"
                    alt="category_image"
                  />
                ) : (
                  <img
                    src={`/assets/upload/blog/${editBlogCategoryData?.category_image}`}
                    width="100px"
                    height="100px"
                    alt="category_image"
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="editBlog_icon" className="modal_label">
                  Blog Icon:-
                </label>
                <input
                  type="file"
                  id="editBlog_icon"
                  name="category_icon"
                  className="modal_input mb-3"
                  onChange={handleEditFileChange}
                  accept="image/*"
                />
                {selectedIcon ? (
                  <img
                    src={URL.createObjectURL(selectedIcon)}
                    width="100px"
                    height="100px"
                    alt="category_image"
                  />
                ) : (
                  <img
                    src={`/assets/upload/blog/${editBlogCategoryData?.category_icon}`}
                    width="100px"
                    height="100px"
                    alt="category_image"
                  />
                )}
                {/* <img
                  src={
                    editBlogCategoryData.category_icon instanceof File
                      ? URL.createObjectURL(editBlogCategoryData.category_icon)
                      : `/assets/upload/blog/${editBlogCategoryData.category_icon}`
                  }
                  alt="category_image"
                  className="modal_data_image"
                /> */}
              </div>
              <div className="mb-3">
                {/* <button
                  type="button"
                  onClick={saveEditCategory}
                  className="success_btn"
                >
                  SAVE
                </button> */}
                <input
                  type="button"
                  onClick={saveEditCategory}
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Editing..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/blog-category">
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
                  onChange={handleEditCategory}
                  value={editBlogCategoryData?.meta_description}
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
                  onChange={handleEditCategory}
                  value={editBlogCategoryData?.canonical_url}
                />
              </div>
              <div className="mb-3">
                {/* <button
                  type="button"
                  onClick={saveEditCategory}
                  className="success_btn"
                >
                  SAVE
                </button> */}
                <input
                  type="button"
                  onClick={saveEditCategory}
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Editing..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/blog-category">
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

export default EditBlogCategory;
