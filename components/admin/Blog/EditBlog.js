import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/router";
import Loading from "@/layouts/Loading";
import Header from "@/layouts/Header";
import Link from "next/link";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import Toast, { ErrorToast } from "@/layouts/toast/Toast";

const EditBlog = () => {
  const router = useRouter();
  let blogId = router.query.id;
  const [getActiveCateData, setGetActiveCateData] = useState([]);
  const [editBlogData, setEditBlogData] = useState({
    blog_cate_id: "",
    blog_title: "",
    blog_description: "",
    meta_desc: "",
    canonical_url: "",
    blog_thumbnail: null,
  });
  const [editMetaTag, setEditMetaTag] = useState([]);
  const [editMetaKeyword, setEditMetaKeyword] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);

  // tabs
  const [activeTab, setActiveTab] = useState("general");

  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  // get active category
  const getActiveCategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blogcategory/router`
      );
      setGetActiveCateData(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  // get blog with id
  const getBlogCategoryForEdit = async (blogId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`
      );
      setEditBlogData(response.data[0]);
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

  // editor
  const editorDescRef = useRef(null);

  const handleDescEditorChange = () => {
    const content = editorDescRef.current.getContent();
    setEditBlogData((prevData) => ({
      ...prevData,
      blog_description: content,
    }));
  };

  // end
  // edit blog
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlogData((prevBlogData) => ({
      ...prevBlogData,
      [name]: value,
    }));
  };
  const handleEditFileChange = (event) => {
    const file = event.target.files[0];
    setEditBlogData((prevBlogData) => ({
      ...prevBlogData,
      [event.target.name]: file,
    }));

    setSelectedImage(file);
  };
  //for validation
  const validateForm = () => {
    const requiredFields = ["blog_title", "blog_thumbnail"];
    for (const field of requiredFields) {
      if (!editBlogData[field]) {
        if (field === "blog_title") {
          ErrorToast("Blog Title is Required");
          return false;
        } else if (field === "blog_thumbnail") {
          ErrorToast("Blog thumbnail is Required");
          return false;
        }
      }
    }
    return true;
  };

  const saveEditBlogData = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("blog_cate_id", editBlogData?.blog_cate_id);
      formdata.append("blog_title", editBlogData?.blog_title);
      formdata.append("blog_description", editBlogData?.blog_description);
      formdata.append("meta_tag", editMetaTag);
      formdata.append("meta_desc", editBlogData?.meta_desc);
      formdata.append("meta_keyword", editMetaKeyword);
      formdata.append("canonical_url", editBlogData?.canonical_url);
      formdata.append("blog_thumbnail", editBlogData?.blog_thumbnail);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`,
        formdata
      );
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      router.push("/admin/blog");
      console.log("correct");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
      console.log("incorrect");
    }
  };

  // edit meta keyword
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
    getActiveCategoryData();
    getBlogCategoryForEdit(blogId);
  }, [blogId]);

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Edit Blog</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Blog</span>
          </p>
        </div>
        <div className="tabs-container">
          <div className="tabs">
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

          <div
            id="general"
            className={`tab-content add_data_form ${
              activeTab === "general" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={saveEditBlogData}>
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
                  onChange={handleEditChange}
                  value={editBlogData?.blog_title || ""}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="blog_description" className="modal_label">
                  Blog Description:-
                </label>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorDescRef.current = editor)}
                  // initialValue={editBlogData?.blog_description}
                  value={editBlogData?.blog_description}
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
                  onEditorChange={(content, editor) =>
                    handleDescEditorChange(content)
                  }
                />
              </div>
              <div className="main">
                <div style={{ width: "48%" }}>
                  <div className="mb-3">
                    <label htmlFor="blog_thumbnail" className="modal_label">
                      Blog Thumbnail:-
                    </label>
                    <input
                      type="file"
                      id="blog_thumbnail"
                      name="blog_thumbnail"
                      className="modal_input"
                      accept="image/*"
                      onChange={handleEditFileChange}
                    />
                  </div>
                  <div className="mb-3">
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        width="100px"
                        height="100px"
                        alt="category_image"
                      />
                    ) : (
                      <img
                        src={`/assets/upload/blogs/${editBlogData?.blog_thumbnail}`}
                        width="100px"
                        height="100px"
                        alt="category_image"
                      />
                    )}
                  </div>
                </div>
                <div className="mb-3" style={{ width: "48%" }}>
                  <label htmlFor="blog_cate_id" className="modal_label">
                    Choose Category:*
                  </label>
                  <select
                    name="blog_cate_id"
                    id="blog_cate_id"
                    form="blog_cate_id"
                    className="modal_input"
                    style={{ padding: "10px 8px" }}
                    onChange={handleEditChange}
                    value={editBlogData?.blog_cate_id}
                  >
                    <option value={0}>Choose Category</option>
                    {getActiveCateData.map((cate) => {
                      return (
                        <option
                          key={cate.blog_cate_id}
                          value={cate.blog_cate_id}
                        >
                          {cate.category_title}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                {/* <button
                  type="button"
                  onClick={saveEditBlogData}
                  className="success_btn"
                >
                  SAVE
                </button> */}
                <input
                  type="button"
                  onClick={saveEditBlogData}
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Editing..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/blog">
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
                <label htmlFor="meta_desc" className="modal_label">
                  Meta Description:-
                </label>
                <textarea
                  type="text"
                  rows="5"
                  cols="70"
                  id="meta_desc"
                  name="meta_desc"
                  className="modal_input"
                  placeholder="Enter Meta Description"
                  onChange={handleEditChange}
                  value={editBlogData?.meta_desc}
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
                  value={editBlogData?.canonical_url}
                />
              </div>
              <div className="mb-3">
                {/* <button
                  type="button"
                  onClick={saveEditBlogData}
                  className="success_btn"
                >
                  SAVE
                </button> */}
                <input
                  type="button"
                  onClick={saveEditBlogData}
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Editing..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/blog">
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

export default EditBlog;
