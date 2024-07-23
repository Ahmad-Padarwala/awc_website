import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/router";
import Header from "@/layouts/Header";
import Loading from "@/layouts/Loading";
import Link from "next/link";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import Toast, { ErrorToast } from "@/layouts/toast/Toast";

const AddBlog = () => {
  const [getActiveCateData, setGetActiveCateData] = useState([]);
  const [addBlogData, setAddBlogData] = useState({
    blog_cate_id: "",
    blog_title: "",
    blog_description: "",
    meta_desc: "",
    canonical_url: "",
    blog_thumbnail: null,
  });
  const [addMetaTag, setAddMetaTag] = useState([]);
  const [addMetaKeyword, setAddMetaKeyword] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // tabs
  const [activeTab, setActiveTab] = useState("general");

  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  // get active category
  const getActiveCategoryData = async () => {
    setLoading(true);
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

  // editor
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setAddBlogData((prevData) => ({
      ...prevData,
      blog_description: content,
    }));

    // Log the content of the editor
    console.log(content);
  };

  // end
  // add blog data section start
  const handleChangeBlog = (event) => {
    const { name, value } = event.target;
    setAddBlogData((prevBlogData) => ({
      ...prevBlogData,
      [name]: value,
    }));
  };

  const handleAddFileChange = (event) => {
    const file = event.target.files[0];
    setAddBlogData((prevBlogData) => ({
      ...prevBlogData,
      [event.target.name]: file,
    }));
  };
  //for validation
  const validateForm = () => {
    const requiredFields = ["blog_title", "blog_thumbnail"];
    for (const field of requiredFields) {
      if (!addBlogData[field]) {
        if (field == "blog_title") {
          ErrorToast(`Blog Title is Required`);
          return false;
        } else if (field == "blog_thumbnail") {
          ErrorToast(`Blog thumbanil is Required`);
          return false;
        }
      }
    }
    return true;
  };

  const addBlogTableData = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("blog_cate_id", addBlogData.blog_cate_id);
      formdata.append("blog_title", addBlogData.blog_title);
      formdata.append("blog_description", addBlogData.blog_description);
      formdata.append("meta_desc", addBlogData.meta_desc);
      formdata.append("canonical_url", addBlogData.canonical_url);
      formdata.append("blog_thumbnail", addBlogData.blog_thumbnail);
      formdata.append("meta_tag", addMetaTag);
      formdata.append("meta_keyword", addMetaKeyword);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/router`,
        formdata
      );
      setLoading(false);
      router.push("/admin/blog");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // add meta keyword
  const handleKeyword = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const value = event.target.value.trim();
      if (value == "") {
        ErrorToast("Please Write Keyword");
        return;
      }
      setAddMetaKeyword([...addMetaKeyword, value]);
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
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const value = event.target.value.trim();
      if (value == "") {
        ErrorToast("Please Write Tag");
        return;
      }
      setAddMetaTag([...addMetaTag, value]);
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
          <p className="admin_page_header">Add Blog</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Blog</span>
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
            <form method="post" onSubmit={addBlogTableData}>
              <div className="mb-3">
                <label htmlFor="blog_title" className="modal_label">
                  Blog Title:-
                  <small style={{ color: "red" }}> *</small>
                </label>
                <input
                  type="text"
                  id="blog_title"
                  name="blog_title"
                  className="modal_input"
                  placeholder="Enter Blog Title"
                  onChange={handleChangeBlog}
                />
              </div>
              <div className="mb-3">
                <p className="modal_label">Blog Description:-</p>
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
                  onEditorChange={(content, editor) =>
                    handleEditorChange(content, editor)
                  }
                />
              </div>
              <div className="main" style={{ display: "flex" }}>
                <div style={{ width: "48%" }}>
                  <div className="mb-3">
                    <label htmlFor="blog_thumbnail" className="modal_label">
                      Blog Thumbnail:-
                      <small style={{ color: "red" }}> *</small>
                    </label>
                    <input
                      type="file"
                      id="blog_thumbnail"
                      name="blog_thumbnail"
                      className="modal_input"
                      accept="image/*"
                      onChange={handleAddFileChange}
                    />
                  </div>
                  {addBlogData.blog_thumbnail && (
                    <div className="mb-3">
                      <img
                        src={URL.createObjectURL(addBlogData.blog_thumbnail)}
                        alt="Selected Thumbnail"
                        className="tabel_data_image"
                      />
                    </div>
                  )}
                </div>
                <div
                  className="mb-3"
                  style={{ width: "48%", marginLeft: "30px" }}
                >
                  <label htmlFor="blog_cate_id" className="modal_label">
                    Choose Category:
                    <small style={{ color: "red" }}> *</small>
                  </label>
                  <select
                    name="blog_cate_id"
                    id="blog_cate_id"
                    form="blog_cate_id"
                    className="modal_input"
                    style={{ padding: "10px 8px" }}
                    onChange={handleChangeBlog}
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
                {/* <button type="submit" className="success_btn">
                  SAVE
                </button> */}
                <input
                  type="submit"
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Adding..." : "SAVE"}
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
            <form method="post" onSubmit={addBlogTableData}>
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
                  onChange={handleChangeBlog}
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
                  onChange={handleChangeBlog}
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
                  value={loading ? "Adding..." : "SAVE"}
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

export default AddBlog;
