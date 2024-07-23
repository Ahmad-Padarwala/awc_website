import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/layouts/Loading";
import Header from "@/layouts/Header";
import DeleteModal from "@/layouts/DeleteModal";
import { useRouter } from "next/router";
import Link from "next/link";
import Toast, { ErrorToast, SuccessToast } from "@/layouts/toast/Toast";

const Blogs = () => {
  //filter Start
  const [filterValue, setFilterValue] = useState(""); // State to hold the filter value
  const handleFilterChange = (value) => {
    setFilterValue(value); // Update the filter value
  };

  useEffect(() => {
    setFilteredBlogs(
      getAllBlogs.filter((e) => {
        let data = e.blog_title;
        return data.includes(filterValue);
      })
    );
  }, [filterValue]);

  const router = useRouter();
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [getAllBlogs, setGetAllBlogs] = useState([]);
  const [getCategoryData, setGetCategoryData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [loading, setLoading] = useState(true);

  // delete modal
  const openDeleteModal = (blogId) => {
    setSelectedBlogId(blogId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedBlogId(null);
    setIsDeleteModalOpen(false);
  };
  const deleteBlog = () => {
    if (selectedBlogId) {
      deleteBlogData(selectedBlogId);
      closeDeleteModal();
    }
  };
  const deleteBlogData = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/blog/${deleteId}`);
      getAllBlogData();
      getBlogCategoryData();
      setLoading(false);
      SuccessToast("Blog Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // get all blog category
  const getBlogCategoryData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blogcategory/router`
      );
      setGetCategoryData(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  // get all blog data
  const getAllBlogData = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/blog/router`)
      .then((res) => {
        setGetAllBlogs(res.data);
        setFilteredBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        ErrorToast(err?.response?.data?.message);
        setLoading(false);
      });
  };

  //status edit
  const blogStatusChange = async (blogId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/statuschanges/${blogId}/${no}`
      );
      getAllBlogData();
      getBlogCategoryData();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // view blog data
  const handleViewBlog = (id) => {
    setLoading(true);
    router.push(`/admin/blog/view-blog?id=${id}`);
  };

  // edit blog data
  const handleEditBlog = (id) => {
    setLoading(true);
    router.push(`/admin/blog/edit-blog?id=${id}`);
  };

  //for truncate text code
  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    } else {
      return str;
    }
  };

  useEffect(() => {
    getAllBlogData();
    getBlogCategoryData();
  }, []);

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header onFilterChange={handleFilterChange} />
        <div className="admin_page_top">
          <div className="page_top_left_section">
            <p className="admin_page_header">Blogs</p>
            <p>
              <Link href="/admin/admindashboard">
                <i className="fa-solid fa-house"></i>
              </Link>
              <i className="fa-solid fa-angles-right"></i>
              <span>Blogs</span>
            </p>
          </div>
          <div className="content_add_btn_section">
            <Link href="/admin/blog/add-blog">
              <button type="button">
                <i className="fa-solid fa-plus"></i>Add Blog
              </button>
            </Link>
          </div>
        </div>

        <div className="admin_category_table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "15%" }}>ID</th>
                <th style={{ width: "25%" }}>THUMBNAIL</th>
                <th style={{ width: "30%" }}>TITLE</th>
                <th style={{ width: "20%" }}>CATEGORY</th>
                <th style={{ width: "15%" }}>ACTION</th>
                <th style={{ width: "10%" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <tr key={blog.blog_id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`/assets/upload/blogs/${blog.blog_thumbnail}`}
                        width="100%"
                        alt="blog"
                        className="tabel_data_image"
                      />
                    </td>
                    <td>{truncateString(blog.blog_title, 40)}</td>
                    <td>
                      {blog.blog_cate_id
                        ? truncateString(
                            getCategoryData.find(
                              (category) =>
                                category.blog_cate_id === blog.blog_cate_id
                            )?.category_title,
                            40
                          )
                        : "null"}
                    </td>

                    <td>
                      <button
                        className="editbutton"
                        onClick={() => handleEditBlog(blog.blog_id)}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        className="data_delete_btn"
                        onClick={() => openDeleteModal(blog.blog_id)}
                      >
                        <i className="fa-sharp fa-solid fa-trash"></i>
                      </button>
                    </td>
                    <td>
                      {blog.status === 1 ? (
                        <img
                          className="status_btn"
                          src="/assets/images/activeStatus.png"
                          alt="active_btn"
                          onClick={() => {
                            blogStatusChange(blog.blog_id, 1);
                          }}
                        />
                      ) : (
                        <img
                          className="status_btn"
                          src="/assets/images/inActiveStatus.png"
                          alt="deactive_btn"
                          onClick={() => {
                            blogStatusChange(blog.blog_id, 0);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" align="center">
                    Data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* delete modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteBlog}
        />
        <Toast />
      </section>
    </>
  );
};

export default Blogs;
