import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Header from "@/layouts/Header";
import { useRouter } from "next/router";
import Link from "next/link";
import Toast, { ErrorToast, WarningToast } from "@/layouts/toast/Toast";
import { Editor } from "@tinymce/tinymce-react";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import Loading from "@/layouts/Loading";

const AddBlogCategory = () => {
  const router = useRouter();
  const [addBlogCategory, setAddBlogCategory] = useState({
    category_title: "",
    category_description: "",
    meta_description: "",
    canonical_url: "",
    category_image: null,
    category_icon: null,
  });
  const [addMetaTag, setAddMetaTag] = useState([]);
  const [addMetaKeyword, setAddMetaKeyword] = useState([]);
  const [loading, setLoading] = useState(false);

  //tab
  const [activeTab, setActiveTab] = useState("general");
  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  //add blog category
  const handleInputBlogCate = async (event) => {
    const { name, value } = event.target;
    setAddBlogCategory((prevCateData) => ({
      ...prevCateData,
      [name]: value,
    }));
  };

  // Function to handle Enter key press
  const handleMetaTag = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      // Add the entered keyword to the keywords array
      event.preventDefault();
      if (event.target.value.trim() === "") {
        ErrorToast("Please Write Tag");
        return;
      }
      setAddMetaTag([...addMetaTag, event.target.value]);
      // Clear the input field
      event.target.value = "";
    }
  };

  const RemoveMetaTag = (idx) => {
    const newArray = [...addMetaTag];
    newArray.splice(idx, 1);
    setAddMetaTag(newArray);
  };
  const handleKeyword = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      // Add the entered keyword to the keywords array
      event.preventDefault();
      if (event.target.value.trim() === "") {
        ErrorToast("Please Write Keyword");
        return;
      }
      setAddMetaKeyword([...addMetaKeyword, event.target.value]);
      // Clear the input field
      event.target.value = "";
    }
  };

  const RemoveKeyword = (idx) => {
    const newArray = [...addMetaKeyword];
    newArray.splice(idx, 1);
    setAddMetaKeyword(newArray);
  };

  //editor
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    setAddBlogCategory((prevData) => ({
      ...prevData,
      category_description: content,
    }));
  };
  //end

  // file handle
  const handleFileBlogCate = async (event) => {
    const file = event.target.files[0];

    // Check if a file is selected
    if (!file) {
      return;
    }

    // Check if the file has a valid extension
    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      // Reset the input value to clear the invalid file
      event.target.value = "";
      WarningToast("Please add the JPG, JPEG, PNG & WEBP format file");
      return;
    }

    setAddBlogCategory((prevImage) => ({
      ...prevImage,
      [event.target.name]: file,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "category_title",
      "category_image",
      "category_icon",
    ];
    for (const field of requiredFields) {
      if (!addBlogCategory[field]) {
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

  const saveBlogCategory = async (e) => {
    e.preventDefault();
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    window.scrollTo({ behavior: "smooth", top: 0 });

    setLoading(true);

    if (addBlogCategory.category_title === "") {
      WarningToast("Please Enter the Blog Category Title");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category_title", addBlogCategory.category_title);
      // formData.append(
      //   "category_description",
      //   addBlogCategory.category_description
      // );

      formData.append("category_description", editorRef.current.getContent());
      formData.append("meta_tag", addMetaTag);
      formData.append("meta_description", addBlogCategory.meta_description);
      formData.append("meta_keyword", addMetaKeyword);
      formData.append("canonical_url", addBlogCategory.canonical_url);
      formData.append("category_image", addBlogCategory.category_image);
      formData.append("category_icon", addBlogCategory.category_icon);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/blogcategory/router`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );

      setLoading(false);
      getAllBlogCategoryData();
      router.push("/admin/blog-category");
      console.log("object");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  //get blog category
  const [getAllBlogCategory, setGetAllBlogCategory] = useState([]);
  const getAllBlogCategoryData = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/blogcategory/router`)
      .then((res) => {
        setGetAllBlogCategory(res.data);
        setFilterdCategory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllBlogCategoryData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Add Blog Category</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Add Blog Category</span>
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
            <form method="post" onSubmit={saveBlogCategory}>
              <div className="mb-3">
                <label htmlFor="category_title" className="modal_label">
                  Category Title:-
                  <small style={{ color: "red" }}> *</small>
                </label>
                <input
                  type="text"
                  id="category_title"
                  name="category_title"
                  className="modal_input"
                  placeholder="Enter Category Title"
                  onChange={handleInputBlogCate}
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
                  <small style={{ color: "red" }}> *</small>
                </label>
                <input
                  type="file"
                  id="category_image"
                  name="category_image"
                  className="modal_input"
                  accept="image/*"
                  onChange={handleFileBlogCate}
                />
              </div>
              {addBlogCategory.category_image && (
                <div className="mb-3">
                  <img
                    src={URL.createObjectURL(addBlogCategory.category_image)}
                    alt="Selected Thumbnail"
                    className="table_data_image"
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="category_icon" className="modal_label">
                  Category Icon:-
                  <small style={{ color: "red" }}> *</small>
                </label>
                <input
                  type="file"
                  id="category_icon"
                  name="category_icon"
                  className="modal_input"
                  accept="image/*"
                  onChange={handleFileBlogCate}
                />
              </div>
              {addBlogCategory.category_icon && (
                <div className="mb-3">
                  <img
                    src={URL.createObjectURL(addBlogCategory.category_icon)}
                    alt="Selected Thumbnail"
                    className="table_data_image"
                  />
                </div>
              )}
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
            <form method="post" onSubmit={saveBlogCategory}>
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
                  onKeyDown={handleMetaTag}
                />
              </div>
              <div className="meta_main_section">
                {addMetaTag.map((tag, index) => (
                  <div className="mb-3" key={index}>
                    <div className="meta_tag_section">
                      <div className="meta_tag_text">{tag}</div>
                      <div
                        className="meta_remove_icon"
                        onClick={() => {
                          RemoveMetaTag(index);
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="meta_main_section">
                {addMetaKeyword.map((keyword, index) => (
                  <div className="mb-3" key={index}>
                    <div className="meta_tag_section">
                      <div className="meta_tag_text">{keyword}</div>
                      <div
                        className="meta_remove_icon"
                        onClick={() => {
                          RemoveKeyword(index);
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                  </div>
                ))}
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
                  onChange={handleInputBlogCate}
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
                  onChange={handleInputBlogCate}
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

export default AddBlogCategory;
