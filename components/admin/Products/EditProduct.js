import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/router";
import Loading from "@/layouts/Loading";
import Header from "@/layouts/Header";
import Link from "next/link";
import YouTube from "react-youtube";
import Toast, {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "@/layouts/toast/Toast";
const EditorApi = process.env.NEXT_PUBLIC_EDITOR_API;
import DeleteModal from "@/layouts/DeleteModal";

const EditProduct = () => {
  const router = useRouter();
  let prodId = router.query.id;

  // USESTATE VARIABLE
  const [getActiveCateData, setGetActiveCateData] = useState([]);
  const [editProductData, setEditProductData] = useState({
    cate_id: "",
    product_title: "",
    product_short_desc: "",
    product_long_desc: "",
    meta_desc: "",
    canonical_url: "",
    product_image: null,
    product_brochure: null,
  });
  const [editMetaTag, setEditMetaTag] = useState([]);
  const [editMetaKeyword, setEditMetaKeyword] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMultiImages, setAddMultiImages] = useState({
    product_images: [],
  });
  const [addMultiDocs, setAddMultiDocs] = useState({
    product_docs: [],
  });
  const [addMultiDrawing, setAddMultiDrawing] = useState({
    product_drawing: [],
  });
  const [allProductDrawing, setAllProductDrawing] = useState([]);

  const [allProductImages, setAllProductImages] = useState([]);
  const [allProductDocs, setAllProductDocs] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productImgId, setproductImgId] = useState(null);
  const [deleteopt, setDeleteopt] = useState("");
  const [addMultiCertificate, setAddMultiCertificate] = useState({
    product_certificate: [],
  });
  const [allProductCertificate, setAllProductCertificate] = useState([]);

  const [addProductVedio, setAddProductVedio] = useState({
    vedio_title: "",
    vedio_description: "",
    vedio_link: "",
    vedio_thumbnail: "",
  });
  const [allProductVedios, setAllProductVedios] = useState([]);
  // per image edit data var
  const [editingId, setEditingId] = useState(null);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingDrawingId, setEditingDrawingId] = useState(null);

  const [editingCertificateId, setEditingCertificateId] = useState(null);
  const [editingVedioId, setEditingVedioId] = useState(null);

  const [editperimg, setEditperimg] = useState({
    product_image: null,
    alternative: "",
    image_height: "",
    image_title: "",
    image_width: "",
    sort_image: "",
  });

  const [editDoc, setEditDoc] = useState({
    pdf_title: "",
    pdf_link: null,
  });
  const [editDrawing, setEditDrawing] = useState({
    pdf_title: "",
    pdf_link: null,
  });
  const [editCertificate, setEditCertificate] = useState({
    certificate_title: "",
    certificate_link: null,
  });

  //TABS HANDLER
  const [activeTab, setActiveTab] = useState("general");

  const showTab = (tabId) => {
    setActiveTab(tabId);
  };

  // ... Other state variables and functions ...

  // Function to handle edit click
  const handleEditVedioClick = (vedioId, vedio) => {
    setEditingVedioId(vedioId);
    setAddProductVedio({
      vedio_title: vedio.video_title,
      vedio_description: vedio.video_description,
      vedio_link: vedio.product_video,
      vedio_thumbnail: vedio.video_thumbnail, // You may need to handle the thumbnail separately
    });
  };

  // Function to handle cancel click
  const handleCancelEditClick = (e) => {
    e.preventDefault();
    setEditingVedioId(null);
    setAddProductVedio({
      vedio_title: "",
      vedio_description: "",
      vedio_link: "",
      vedio_thumbnail: null,
    });
  };

  //DELETE MODAL HANDLER
  const openDeleteModal = (prodId, opt) => {
    setproductImgId(prodId);
    setDeleteopt(opt);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setproductImgId(null);
    setIsDeleteModalOpen(false);
  };
  const deleteCategory = () => {
    if (productImgId) {
      if (deleteopt == "image") {
        deleteProductImg(productImgId);
      } else if (deleteopt == "docs") {
        deleteProductdocs(productImgId);
      } else if (deleteopt == "video") {
        deleteProductVideos(productImgId);
      } else if (deleteopt == "certificate") {
        deleteProductcertificate(productImgId);
      } else if (deleteopt == "drawing") {
        deleteProductDrawing(productImgId);
      }

      closeDeleteModal();
    }
  };
  // END DELETE MODAL HANDLER
  const getYouTubeVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|y\/|\/v\/|\/e\/|watch\?.*v=)([^"&?\/\s]{11})/
    );

    return videoIdMatch ? videoIdMatch[1] : null;
  };
  // GET ACTIVE CATEGORY
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

  //GET PRODUCT DATA WHICH IS SELECT FOR EDIT
  const getProductCategoryForEdit = async (prodId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${prodId}`
      );
      setEditProductData(response.data[0]);
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

  //EDITOR
  const editorShortRef = useRef(null);
  const editorLongRef = useRef(null);
  const handleShortEditorChange = (content, editor) => {
    setEditProductData((prevData) => ({
      ...prevData,
      product_short_desc: content,
    }));
  };
  const handleLongEditorChange = (content, editor) => {
    setEditProductData((prevData) => ({
      ...prevData,
      product_long_desc: content,
    }));
  };
  //end

  //edit cate
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prevProdData) => ({
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
      WarningToast("Please add the JPG, JPEG, PNG & JPEG format file");
      return;
    }

    setEditProductData((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
    setSelectedImage(file);
  };
  const handleEditPdfFileChange = (event) => {
    const file = event.target.files[0];

    // Check if the file has a valid extension
    const validExtensions = ["pdf"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      // Reset the input value to clear the invalid file
      event.target.value = "";
      WarningToast("Please add the PDF file format");
      return;
    }

    setEditProductData((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };
  const saveEditProductData = async (e) => {
    e.preventDefault();
    if (editProductData.product_title === "") {
      ErrorToast("Please Enter the Product Title");
      return false;
    }

    if (editProductData.product_image === null) {
      ErrorToast("Please Select Product Image");
      return false;
    }
    if (editProductData.product_brochure === null) {
      ErrorToast("Please Select Product Brochure");
      return false;
    }

    if (editProductData.cate_id == 0) {
      ErrorToast("Please Select Category");
      return false;
    }

    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("cate_id", editProductData?.cate_id);
      formdata.append("product_title", editProductData?.product_title);
      formdata.append(
        "product_short_desc",
        editProductData?.product_short_desc
      );
      formdata.append("product_long_desc", editProductData?.product_long_desc);
      formdata.append("meta_tag", editMetaTag);
      formdata.append("meta_desc", editProductData?.meta_desc);
      formdata.append("meta_keyword", editMetaKeyword);
      formdata.append("canonical_url", editProductData?.canonical_url);
      formdata.append("product_image", editProductData?.product_image);
      formdata.append("product_brochure", editProductData?.product_brochure);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${prodId}`,
        formdata
      );
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      router.push("/admin/products");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
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

  // USEEFFECT METHOD
  useEffect(() => {
    getActiveCategoryData();
    getProductCategoryForEdit(prodId);
    getAllProductImages();
    getAllProductDocs();
    getAllProductCertificate();
    getAllProductVedios();
    getAllProductDrawing();
  }, [prodId]);

  ///  **************** ALL DOCS ******************

  // get all Docs of product
  const getAllProductDocs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdocs/${prodId}`
      );
      setAllProductDocs(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  // ADD MULTIPLE DOCS AND MULTIPLE DOCS HANDLER
  const handleAddMultipleDocsChange = async (event) => {
    const files = event.target.files;
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    // Check if any non-PDF files were selected
    const nonPdfFiles = Array.from(files).filter(
      (file) => file.type !== "application/pdf"
    );

    if (nonPdfFiles.length > 0) {
      WarningToast("Only PDF files are taken from given files.");
    }

    const newdocs = Array.from(pdfFiles).map((file) => ({
      file,
      docs_title: "",
    }));
    setAddMultiDocs((prevMultiDocs) => ({
      ...prevMultiDocs,
      product_docs: [...prevMultiDocs.product_docs, ...newdocs],
    }));
  };

  const removeMultiDocs = async (index) => {
    const newDocs = [...addMultiDocs.product_docs];
    newDocs.splice(index, 1);
    setAddMultiDocs((prevMultiDocs) => ({
      ...prevMultiDocs,
      product_docs: newDocs,
    }));
  };

  const handleDocsDetailsChange = (index, field, value) => {
    console.log(addMultiDocs);
    setAddMultiDocs((prevMultiDocs) => {
      const updatedImages = [...prevMultiDocs.product_docs];
      updatedImages[index][field] = value;
      return {
        ...prevMultiDocs,
        product_docs: updatedImages,
      };
    });
  };

  const saveMultipleDocs = async (e) => {
    e.preventDefault();
    console.log(allProductDocs);
    window.scrollTo({ behavior: "smooth", top: 0 });
    if (addMultiDocs.product_docs.length == 0) {
      ErrorToast("please atleast one doc select");
      return false;
    }
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("product_id", prodId);
      addMultiDocs.product_docs.forEach((docs, index) => {
        formdata.append(`product_docs`, docs.file);
        formdata.append(`docs_title_${index}`, docs.docs_title);
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdocs/router`,
        formdata
      );
      setLoading(false);
      setAddMultiDocs({ product_docs: [] });
      getAllProductDocs();
      SuccessToast("Docs Added Successfully");
    } catch (error) {
      console.log("Error adding prod images" + error);
      setLoading(false);
    }
  };
  // DELETE DOCS
  const deleteProductdocs = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdocs/${deleteId}`
      );
      getAllProductDocs();
      setLoading(false);
      SuccessToast("Product Docs Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // get all certificate of product
  const getAllProductCertificate = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productcertificate/${prodId}`
      );
      setAllProductCertificate(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  // ADD MULTIPLE CERTIFICATE AND MULTIPLE CERTIFICATE HANDLER
  const handleAddMultipleCertificateChange = async (event) => {
    const files = event.target.files;
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    // Check if any non-PDF files were selected
    const nonPdfFiles = Array.from(files).filter(
      (file) => file.type !== "application/pdf"
    );

    if (nonPdfFiles.length > 0) {
      WarningToast("Only PDF files are taken from given files.");
    }

    const newdocs = Array.from(pdfFiles).map((file) => ({
      file,
      certificate_title: "",
    }));
    setAddMultiCertificate((prevMultiCertificate) => ({
      ...prevMultiCertificate,

      product_certificate: [
        ...prevMultiCertificate.product_certificate,
        ...newdocs,
      ],
    }));
  };

  const removeMultiCertificate = async (index) => {
    const newDocs = [...addMultiCertificate.product_certificate];
    newDocs.splice(index, 1);
    setAddMultiCertificate((prevMultiCertificate) => ({
      ...prevMultiCertificate,
      product_certificate: newDocs,
    }));
  };

  const handleCertificateDetailsChange = (index, field, value) => {
    setAddMultiCertificate((prevMultiCertificate) => {
      const updatedImages = [...prevMultiCertificate.product_certificate];
      updatedImages[index][field] = value;
      return {
        ...prevMultiCertificate,
        product_certificate: updatedImages,
      };
    });
  };

  const saveMultipleCertificate = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });

    if (addMultiCertificate.product_certificate.length == 0) {
      ErrorToast("please atleast one Certificate select");
      return false;
    }
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("product_id", prodId);
      addMultiCertificate.product_certificate.forEach((docs, index) => {
        formdata.append(`product_certificate`, docs.file);
        formdata.append(`certificate_title_${index}`, docs.certificate_title);
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productcertificate/router`,
        formdata
      );
      setLoading(false);
      setAddMultiCertificate({ product_docs: [] });
      getAllProductCertificate();
      SuccessToast("Certificate Added Successfully");
    } catch (error) {
      console.log("Error adding prod images" + error);
      setLoading(false);
    }
  };
  // DELETE DOCS
  const deleteProductcertificate = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productcertificate/${deleteId}`
      );
      getAllProductCertificate();
      setLoading(false);
      SuccessToast("Product Certificate Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //PRODUCT CERTIFICATE CHANGE

  const handlePerCertificateData = (event) => {
    const { name, value } = event.target;
    setEditCertificate((prevCertificateData) => ({
      ...prevCertificateData,
      [name]: value,
    }));
  };

  const handleEditCertificateClick = (certiId, data) => {
    setEditingCertificateId(certiId);

    setEditCertificate({
      certificate_title: data.certificate_title,
      certificate_link: data.certificate_link,
    });
  };

  const handlePerCertificateFileData = (event) => {
    const file = event.target.files[0];
    setEditCertificate((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };
  const handleUpdateCertiClick = async (prodDocsId) => {
    try {
      const formdata = new FormData();
      formdata.append("certificate_link", editCertificate?.certificate_link);
      formdata.append("certificate_title", editCertificate?.certificate_title);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productcertificate/perdocdata/${prodDocsId}`,
        formdata
      );
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      getAllProductCertificate();

      setEditingCertificateId(null);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //PRODUCT CERTIFICATE STATUS CHANGE
  const productCertificateStatusChange = async (certiId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productcertificate/statuschanges/${certiId}/${no}`
      );
      getAllProductCertificate();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // PRODUCT STATUS CHANGE
  const productDocsStatusChange = async (docId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdocs/statuschanges/${docId}/${no}`
      );
      getAllProductDocs();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // PER DOC EDIT HANDLE.
  const handlePerDocData = (event) => {
    const { name, value } = event.target;
    setEditDoc((prevDocData) => ({
      ...prevDocData,
      [name]: value,
    }));
  };

  const handleEditDocClick = (docId, data) => {
    setEditingDocId(docId);
    setEditDoc({
      pdf_title: data.pdf_title,
      pdf_link: data.pdf_link,
    });
  };

  const handlePerDocFileData = (event) => {
    const file = event.target.files[0];
    setEditDoc((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };

  const handleUpdateDocClick = async (prodDocsId) => {
    try {
      const formdata = new FormData();
      formdata.append("pdf_link", editDoc?.pdf_link);
      formdata.append("pdf_title", editDoc?.pdf_title);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdocs/perdocdata/${prodDocsId}`,
        formdata
      );
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      getAllProductDocs();
      setEditingDocId(null);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  // END DOC EDIT HANDLE

  //END DOCS HANDLER AND ADD MULTIPLE DOCS

  ///  **************** END DOCS ******************

  ///  **************** ALL IMAGES SECTION ******************

  // get all images of product
  const getAllProductImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productimages/${prodId}`
      );
      setAllProductImages(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  // edit multiple images

  const saveMultipleImages = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    if (addMultiImages.product_images.length === 0) {
      ErrorToast("No files selected. Please select at least one image");
      return;
    }
    setLoading(true);
    console.log(addMultiImages);
    try {
      const formdata = new FormData();
      formdata.append("product_id", prodId);
      addMultiImages.product_images.forEach((image, index) => {
        console.log(image);
        formdata.append(`product_images`, image.file);
        formdata.append(`image_title_${index}`, image.image_title);
        formdata.append(`sort_image_${index}`, image.sort_image);
        formdata.append(`image_width_${index}`, image.image_width);
        formdata.append(`image_height_${index}`, image.image_height);
        formdata.append(`alternative_${index}`, image.alternative);
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productimages/router`,
        formdata
      );
      setLoading(false);
      getAllProductImages();
      setAddMultiImages({ product_images: [] });
    } catch (error) {
      console.log("Error adding prod images" + error);
      setLoading(false);
    }
  };

  //status edit
  const productImageStatusChange = async (imgId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productimages/statuschanges/${imgId}/${no}`
      );
      getAllProductImages();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  //handle images
  const handleAddMultipleImagesChange = async (event) => {
    const files = event.target.files;

    // Filter out non-image files
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    // Check if any non-image files were selected
    const nonImageFiles = Array.from(files).filter(
      (file) => !file.type.startsWith("image/")
    );

    if (nonImageFiles.length > 0) {
      WarningToast("Only image files are taken from given files.");
    }
    const newImages = Array.from(imageFiles).map((file) => ({
      file,
      image_title: "",
      sort_image: "",
      image_width: "",
      image_height: "",
      alternative: "",
    }));
    setAddMultiImages((prevMultiImages) => ({
      ...prevMultiImages,
      product_images: [...prevMultiImages.product_images, ...newImages],
    }));
  };

  const removeMultiImage = async (index) => {
    const newImages = [...addMultiImages.product_images];
    newImages.splice(index, 1);
    setAddMultiImages((prevMultiImages) => ({
      ...prevMultiImages,
      product_images: newImages,
    }));
  };

  const handleImageDetailsChange = (index, field, value) => {
    setAddMultiImages((prevMultiImages) => {
      const updatedImages = [...prevMultiImages.product_images];
      updatedImages[index][field] = value;
      return {
        ...prevMultiImages,
        product_images: updatedImages,
      };
    });
  };

  // DELETE IMAGE
  const deleteProductImg = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productimages/${deleteId}`
      );
      getAllProductImages();
      setLoading(false);
      SuccessToast("Product Image Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // PER IMG EDIT HANDLE

  const [selectedImages, setSelectedImages] = useState(
    Array(allProductImages.length).fill(null)
  );

  const handlePerImgData = (event) => {
    const { name, value } = event.target;
    setEditperimg((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };

  const handlePerImgFileData = (event, index) => {
    const file = event.target.files[0];

    // Update selectedImages array with the new file for the specific index
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages[index] = file;
    setSelectedImages(updatedSelectedImages);

    // Update editperimg state with the new file
    setEditperimg((prevProfileData) => ({
      ...prevProfileData,
      product_image: file, // Update the product_image property
      [event.target.name]: file,
    }));
  };

  const handleEditClick = (productId, data) => {
    setEditingId(productId);
    setEditperimg({
      product_image: data.product_image,
      alternative: data.alternative,
      image_height: data.image_height,
      image_title: data.image_title,
      image_width: data.image_width,
      sort_image: data.sort_image,
    });
  };

  const handleUpdateClick = async (proImgId) => {
    try {
      const formdata = new FormData();
      formdata.append("product_image", editperimg?.product_image);
      formdata.append("image_title", editperimg?.image_title);
      formdata.append("alternative", editperimg?.alternative);
      formdata.append("image_height", editperimg?.image_height);
      formdata.append("image_width", editperimg?.image_width);
      formdata.append("sort_image", editperimg?.sort_image);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productimages/perimgdata/${proImgId}`,
        formdata
      );
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      getAllProductImages();
      setEditingId(null);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };
  // END IMG EDIT HANDLE

  ///  **************** END IMAGES SECTION ******************

  // HANDLE VEDIO DATA
  //EDITOR
  const VedioeditorRef = useRef(null);
  const handleVedioEditorChange = (content, editor) => {
    setAddProductVedio((prevData) => ({
      ...prevData,
      vedio_description: content,
    }));
  };
  //end
  //HANDLE VEDIO CONTENT SAVE
  const handleVedioContentChange = (event) => {
    console.log(event);
    const { name, value } = event.target;
    setAddProductVedio((prevContData) => ({
      ...prevContData,
      [name]: value,
    }));
  };
  const handleVedioFileChange = (event) => {
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
    setAddProductVedio((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };

  //status edit
  const productVideosStatusChange = async (imgId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productvedios/statuschanges/${imgId}/${no}`
      );
      getAllProductVedios();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // GET ALL PRODUCT VIDEOS FOR SHOWING WHEN ADD IN VIDEOS TAB
  const getAllProductVedios = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productvedios/${prodId}`
      );
      setAllProductVedios(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };

  // DELETE DOCS
  const deleteProductVideos = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productvedios/${deleteId}`
      );
      getAllProductVedios();
      setLoading(false);
      SuccessToast("Product Video Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //SAVE VEDIO DATA

  const saveVedios = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    if (addProductVedio.vedio_title === "") {
      ErrorToast("Please Enter the Video Title");
      return false;
    }
    if (addProductVedio.vedio_link === "") {
      ErrorToast("Please Enter the Video Link");
      return false;
    }
    setLoading(true);
    console.log(addProductVedio);
    try {
      const formdata = new FormData();
      formdata.append("product_id", prodId);
      formdata.append("vedio_title", addProductVedio.vedio_title);
      formdata.append("vedio_link", addProductVedio.vedio_link);
      formdata.append("vedio_description", addProductVedio.vedio_description);
      formdata.append("vedio_thumbnail", addProductVedio.vedio_thumbnail);

      const url = editingVedioId
        ? `${process.env.NEXT_PUBLIC_API_URL}/products/productvedios/pervideodata/${editingVedioId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/products/productvedios/router`;

      const method = editingVedioId ? "patch" : "post";

      await axios[method](url, formdata);

      setLoading(false);
      if (editingVedioId) {
        setEditingVedioId(null);
      }
      setAddProductVedio({
        vedio_title: "",
        vedio_link: "",
        vedio_description: "",
        vedio_thumbnail: null,
      });
      getAllProductVedios();
      setActiveTab("docs");
    } catch (error) {
      console.log("Error adding prod images" + error);
      setLoading(false);
    }
  };

  //END PRODUCT VEDIO SECTION

  //PRODUCT Drawing

  // PRODUCT STATUS CHANGE
  const productDrawingStatusChange = async (docId, no) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdrawing/statuschanges/${docId}/${no}`
      );
      getAllProductDrawing();
      setLoading(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // DELETE DOCS
  const deleteProductDrawing = async (deleteId) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdrawing/${deleteId}`
      );
      getAllProductDrawing();
      setLoading(false);
      SuccessToast("Product Drawing Deleted Successfully");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // PER DOC EDIT HANDLE.
  const handlePerDrawingData = (event) => {
    const { name, value } = event.target;
    setEditDrawing((prevDocData) => ({
      ...prevDocData,
      [name]: value,
    }));
  };

  const handleEditDrawingClick = (docId, data) => {
    setEditingDrawingId(docId);
    setEditDrawing({
      pdf_title: data.pdf_title,
      pdf_link: data.pdf_link,
    });
  };

  const handlePerDrewingFileData = (event) => {
    const file = event.target.files[0];
    setEditDrawing((prevProfileData) => ({
      ...prevProfileData,
      [event.target.name]: file,
    }));
  };

  const handleUpdateDrawingClick = async (prodDocsId) => {
    console.log(editDrawing);
    console.log(prodDocsId);
    try {
      const formdata = new FormData();
      formdata.append("pdf_link", editDrawing?.pdf_link);
      formdata.append("pdf_title", editDrawing?.pdf_title);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdrawing/perdrawingdata/${prodDocsId}`,
        formdata
      );
      window.scrollTo({ behavior: "smooth", top: 0 });
      setLoading(false);
      getAllProductDrawing();
      setEditingDrawingId(null);
      SuccessToast("Drawing Successfully Updated");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleAddMultipleDrawingChange = async (event) => {
    const files = event.target.files;
    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    // Check if any non-PDF files were selected
    const nonPdfFiles = Array.from(files).filter(
      (file) => file.type !== "application/pdf"
    );

    if (nonPdfFiles.length > 0) {
      WarningToast("Only PDF files are taken from given files.");
    }

    const newcertificate = Array.from(pdfFiles).map((file) => ({
      file,
      drawing_title: "",
    }));
    setAddMultiDrawing((prevMultiDrawing) => ({
      ...prevMultiDrawing,
      product_drawing: [...prevMultiDrawing.product_drawing, ...newcertificate],
    }));
  };

  const removeMultiDrawing = async (index) => {
    const newdrawing = [...addMultiDrawing.product_drawing];
    newdrawing.splice(index, 1);
    setAddMultiDrawing((prevMultiDrawing) => ({
      ...prevMultiDrawing,
      product_drawing: newdrawing,
    }));
  };

  const handleDrawingDetailsChange = (index, field, value) => {
    setAddMultiDrawing((prevMultiDrawing) => {
      const updatedImages = [...prevMultiDrawing.product_drawing];
      updatedImages[index][field] = value;
      return {
        ...prevMultiDrawing,
        product_drawing: updatedImages,
      };
    });
  };

  const saveMultipleDrawing = async (e) => {
    e.preventDefault();
    window.scrollTo({ behavior: "smooth", top: 0 });
    console.log(addMultiDrawing);
    if (addMultiDrawing.product_drawing.length == 0) {
      ErrorToast("please atleast one Drawing select");
      return false;
    }
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("product_id", prodId);
      addMultiDrawing.product_drawing.forEach((docs, index) => {
        formdata.append(`product_drawing`, docs.file);
        formdata.append(`drawing_title_${index}`, docs.drawing_title);
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdrawing/router`,
        formdata
      );
      setLoading(false);
      getAllProductDrawing();
      setAddMultiDrawing({ product_drawing: [] });
      setActiveTab("drawing");
      console.log("hiii");
    } catch (error) {
      console.log("Error adding prod images" + error);
      setLoading(false);
    }
  };

  // get all Docs of product
  const getAllProductDrawing = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productdrawing/${prodId}`
      );
      setAllProductDrawing(response.data);
      setLoading(false);
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
      setLoading(false);
    }
  };
  //END

  return (
    <>
      {loading && <Loading />}
      <section className="home-section">
        <Header />
        <div className="admin_page_top">
          <p className="admin_page_header">Edit Product</p>
          <p>
            <Link href="/admin/admindashboard">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i className="fa-solid fa-angles-right"></i>
            <span>Edit Product</span>
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
              <div
                className={`tab ${activeTab === "image" ? "active" : ""}`}
                onClick={() => showTab("image")}
              >
                Images
              </div>
              <div
                className={`tab ${activeTab === "video" ? "active" : ""}`}
                onClick={() => showTab("video")}
              >
                Videos
              </div>
              <div
                className={`tab ${activeTab === "docs" ? "active" : ""}`}
                onClick={() => showTab("docs")}
              >
                Docs
              </div>
              <div
                className={`tab ${activeTab === "certificate" ? "active" : ""}`}
                onClick={() => showTab("certificate")}
              >
                Certificate
              </div>
              <div
                className={`tab ${activeTab === "drawing" ? "active" : ""}`}
                onClick={() => showTab("drawing")}
              >
                Drawing
              </div>
            </div>
          </div>

          <div
            id="general"
            className={`tab-content add_data_form ${
              activeTab === "general" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={saveEditProductData}>
              <div className="mb-3">
                <label htmlFor="product_title" className="modal_label">
                  Product Title:-
                  <small style={{ color: "red" }}> *</small>
                </label>
                <input
                  type="text"
                  id="product_title"
                  name="product_title"
                  className="modal_input"
                  placeholder="Enter Product Title"
                  value={editProductData?.product_title}
                  onChange={handleEditChange}
                />
              </div>
              <div className="mb-3">
                <p className="modal_label">Product Short Description:-</p>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorShortRef.current = editor)}
                  value={editProductData?.product_short_desc}
                  init={{
                    height: 300,
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
                  onEditorChange={(e) =>
                    handleShortEditorChange(editorShortRef.current.getContent())
                  }
                />
              </div>
              <div className="mb-3">
                <p className="modal_label">Product Long Description:-</p>
                <Editor
                  apiKey={EditorApi}
                  onInit={(evt, editor) => (editorLongRef.current = editor)}
                  value={editProductData?.product_long_desc}
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
                  onEditorChange={(e) =>
                    handleLongEditorChange(editorLongRef.current.getContent())
                  }
                />
              </div>
              <div className="two_input_flex">
                <div style={{ width: "48%" }}>
                  <div className="mb-3">
                    <label htmlFor="product_image" className="modal_label">
                      Product Thumbnail:-
                    </label>
                    <input
                      type="file"
                      id="product_image"
                      name="product_image"
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
                      alt="product_image"
                    />
                  ) : (
                    <img
                      src={`/assets/upload/products/${editProductData?.product_image}`}
                      width="100px"
                      height="100px"
                      className="modal_data_image"
                      alt="product_image"
                    />
                  )}
                </div>
                <div style={{ width: "48%" }}>
                  <div className="mb-3">
                    <label htmlFor="product_brochure" className="modal_label">
                      Product Brochure:-
                    </label>
                    <input
                      type="file"
                      id="product_brochure"
                      name="product_brochure"
                      className="modal_input"
                      onChange={handleEditPdfFileChange}
                    />
                  </div>
                  {editProductData.product_brochure != "" ? (
                    <Link
                      href={`/assets/upload/products/${editProductData?.product_brochure}`}
                      target="_blank"
                    >
                      <img
                        src={`/assets/images/pdf-icon.webp`}
                        width="100px"
                        height="100px"
                        className="modal_data_image"
                        alt="product_image"
                      />
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="cate_id" className="modal_label">
                  Choose Category:
                </label>
                <select
                  name="cate_id"
                  id="cate_id"
                  form="cate_id"
                  className="modal_input"
                  onChange={handleEditChange}
                >
                  <option value={0}>Choose Category</option>
                  {getActiveCateData.map((cate) => {
                    return (
                      <option
                        selected={cate.category_id == editProductData?.cate_id}
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
                  onClick={saveEditProductData}
                  className="success_btn"
                >
                  SAVE
                </button> */}
                <input
                  type="button"
                  onClick={saveEditProductData}
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Editing..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/products">
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
                  value={editProductData?.meta_desc}
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
                  value={editProductData?.canonical_url}
                />
              </div>
              <div className="mb-3">
                {/* <button
                  type="button"
                  onClick={saveEditProductData}
                  className="success_btn"
                >
                  SAVE
                </button> */}
                <input
                  type="button"
                  onClick={saveEditProductData}
                  style={loading ? { cursor: "not-allowed" } : {}}
                  className="success_btn"
                  value={loading ? "Editing..." : "SAVE"}
                  disabled={loading}
                />
                <Link href="/admin/products">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
          </div>

          {/* Image Tabs */}
          <div
            id="image"
            className={`tab-content add_data_form ${
              activeTab === "image" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={saveMultipleImages}>
              <div className="mb-3">
                <label htmlFor="product_images" className="modal_label">
                  Product Images:-
                </label>
                <input
                  type="file"
                  id="product_images"
                  name="product_images"
                  className="modal_input"
                  accept="image/*"
                  onChange={handleAddMultipleImagesChange}
                  multiple
                />
              </div>
              <div
                className="mb-3"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {addMultiImages.product_images &&
                addMultiImages.product_images.length > 0 ? (
                  <table className="multi-images-table">
                    <thead>
                      <tr>
                        <th width="10%">Image</th>
                        <th width="25%">Title</th>
                        <th width="10%">Width</th>
                        <th width="10%">Height</th>
                        <th width="20%">Alternative Text</th>
                        <th width="10%">Sort</th>
                        <th width="10%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addMultiImages.product_images.map((image, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={URL.createObjectURL(image.file)}
                              alt={`Selected productimg ${index + 1}`}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id={`image_title-${index}`}
                              name="image_title"
                              placeholder="Image Title"
                              onChange={(e) =>
                                handleImageDetailsChange(
                                  index,
                                  "image_title",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id={`image_width-${index}`}
                              name="image_width"
                              placeholder="Width"
                              onChange={(e) =>
                                handleImageDetailsChange(
                                  index,
                                  "image_width",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id={`image_height-${index}`}
                              name="image_height"
                              placeholder="Height"
                              onChange={(e) =>
                                handleImageDetailsChange(
                                  index,
                                  "image_height",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id={`alternative-${index}`}
                              name="alternative"
                              placeholder="alternative"
                              onChange={(e) =>
                                handleImageDetailsChange(
                                  index,
                                  "alternative",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              id={`sort_image-${index}`}
                              name="sort_image"
                              placeholder="sort"
                              onChange={(e) =>
                                handleImageDetailsChange(
                                  index,
                                  "sort_image",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="remove_multi_img_btn"
                              onClick={() => removeMultiImage(index)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No images selected</p>
                )}
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
                <Link href="/admin/products">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
            <hr style={{ marginTop: "30px", marginBottom: "20px" }} />
            <div className="admin_category_table">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>ID</th>
                    <th style={{ width: "10%" }}>IMAGE</th>
                    <th style={{ width: "25%" }}>TITLE</th>
                    <th style={{ width: "10%" }}>HEIGHT</th>
                    <th style={{ width: "10%" }}>WIDTH</th>
                    <th style={{ width: "20%" }}>Alt TEXT</th>
                    <th style={{ width: "10%" }}>SORT</th>
                    <th style={{ width: "15%" }}>ACTION</th>
                    <th style={{ width: "10%" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {allProductImages.length > 0 ? (
                    allProductImages.map((product, index) => (
                      <tr key={product.product_id}>
                        <td>{index + 1}</td>
                        {/* {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <input
                              type="file"
                              name="product_image"
                              style={{ display: "none" }}
                              onChange={handlePerImgFileData}
                            />
                            <img
                              src={`/assets/upload/products/productImages/${product.product_image}`}
                              width="100%"
                              alt="product"
                              className="table_data_image"
                            />
                          </td>
                        ) : (
                          <td>
                            <img
                              src={`/assets/upload/products/productImages/${product.product_image}`}
                              width="100%"
                              alt="product"
                              className="table_data_image"
                            />
                          </td>
                        )} */}
                        {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <input
                              type="file"
                              id={`product_image_input_${index}`}
                              style={{ display: "none" }}
                              onChange={(e) => handlePerImgFileData(e, index)}
                            />
                            <div className="image-container">
                              <div
                                className="overlay"
                                onClick={() =>
                                  document
                                    .getElementById(
                                      `product_image_input_${index}`
                                    )
                                    .click()
                                }
                              >
                                <i
                                  className={`fa-solid fa-image ${
                                    selectedImages[index] ? "visible" : ""
                                  }`}
                                ></i>
                              </div>
                              <img
                                src={
                                  selectedImages[index]
                                    ? URL.createObjectURL(selectedImages[index])
                                    : `/assets/upload/products/productImages/${product.product_image}`
                                }
                                width="100%"
                                alt="product"
                                className="table_data_image"
                              />
                            </div>
                          </td>
                        ) : (
                          <td>
                            <img
                              src={`/assets/upload/products/productImages/${product.product_image}`}
                              width="100%"
                              alt="product"
                              className="table_data_image"
                            />
                          </td>
                        )}

                        {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="image_title"
                              onChange={handlePerImgData}
                              value={editperimg.image_title}
                            />
                          </td>
                        ) : (
                          <td>{product.image_title}</td>
                        )}
                        {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="image_height"
                              onChange={handlePerImgData}
                              value={editperimg.image_height}
                            />
                          </td>
                        ) : (
                          <td>{product.image_height}</td>
                        )}
                        {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="image_width"
                              onChange={handlePerImgData}
                              value={editperimg.image_width}
                            />
                          </td>
                        ) : (
                          <td>{product.image_width}</td>
                        )}
                        {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="alternative"
                              onChange={handlePerImgData}
                              value={editperimg.alternative}
                            />
                          </td>
                        ) : (
                          <td>{product.alternative}</td>
                        )}
                        {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="sort_image"
                              onChange={handlePerImgData}
                              value={editperimg.sort_image}
                            />
                          </td>
                        ) : (
                          <td>{product.sort_image}</td>
                        )}
                        {editingId === product.prod_image_id ? (
                          <td className="edit-row">
                            <div>
                              <button
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  padding: "5px",
                                }}
                                onClick={() =>
                                  handleUpdateClick(product.prod_image_id)
                                }
                              >
                                <i className="fa-solid fa-floppy-disk"></i>
                                {/* <i class="fa-solid fa-floppy-disk"></i>U */}
                              </button>
                              <button
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  padding: "5px",
                                }}
                                className="cancel"
                                onClick={() => setEditingId(null)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          </td>
                        ) : (
                          <td>
                            <button
                              className="editbutton"
                              onClick={() =>
                                handleEditClick(product.prod_image_id, product)
                              }
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              className="data_delete_btn"
                              onClick={() =>
                                openDeleteModal(product.prod_image_id, "image")
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        )}
                        <td>
                          {product.status === 1 ? (
                            <img
                              src="/assets/images/activeStatus.png"
                              alt="active"
                              className="status_btn"
                              onClick={() => {
                                productImageStatusChange(
                                  product.prod_image_id,
                                  1
                                );
                              }}
                            />
                          ) : (
                            <img
                              src="/assets/images/inActiveStatus.png"
                              alt="inActive"
                              className="status_btn"
                              onClick={() => {
                                productImageStatusChange(
                                  product.prod_image_id,
                                  0
                                );
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" align="center">
                        data is not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vedio Tabs */}
          <div
            id="video"
            className={`tab-content add_data_form ${
              activeTab === "video" ? "active" : ""
            }`}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "70%", margin: "20px" }}>
                {allProductVedios && (
                  <div className="admin_category_table">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "5%" }}>ID</th>
                          <th style={{ width: "10%" }}>IMAGE</th>
                          <th style={{ width: "15%" }}>TITLE</th>
                          <th style={{ width: "30%" }}>LINK</th>
                          <th style={{ width: "18%" }}>ACTION</th>
                          <th style={{ width: "12%" }}>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allProductVedios.length > 0 ? (
                          allProductVedios.map((product, index) => (
                            <tr key={product.product_id}>
                              <td>{index + 1}</td>
                              <td>
                                <img
                                  src={`/assets/upload/products/productVedios/${product.video_thumbnail}`}
                                  width="100%"
                                  alt="Video Thumbnail"
                                  className="tabel_data_image"
                                />
                              </td>
                              <td>{product.video_title}</td>
                              <td>
                                {product.product_video && (
                                  <YouTube
                                    videoId={getYouTubeVideoId(
                                      product.product_video
                                    )}
                                    opts={{
                                      width: "100%",
                                      height: "100",
                                      playerVars: {
                                        autoplay: 0,
                                      },
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {editingVedioId !== product.prod_video_id ? (
                                  <>
                                    <button
                                      className="editbutton"
                                      onClick={() => {
                                        handleEditVedioClick(
                                          product.prod_video_id,
                                          product
                                        );
                                      }}
                                    >
                                      <i className="fa-regular fa-pen-to-square"></i>
                                    </button>
                                    <button
                                      className="data_delete_btn"
                                      onClick={() =>
                                        openDeleteModal(
                                          product.prod_video_id,
                                          "video"
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </>
                                ) : (
                                  <span>
                                    <button
                                      className="editbutton"
                                      style={{
                                        borderRadius: "3px",
                                        backgroundColor: "#bc1c1c",
                                        color: "#fff",
                                      }}
                                      onClick={handleCancelEditClick}
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                  </span>
                                )}
                              </td>
                              <td>
                                {product.status === 1 ? (
                                  <img
                                    src="/assets/images/activeStatus.png"
                                    alt="active"
                                    className="status_btn"
                                    onClick={() => {
                                      productVideosStatusChange(
                                        product.prod_video_id,
                                        1
                                      );
                                    }}
                                  />
                                ) : (
                                  <img
                                    src="/assets/images/inActiveStatus.png"
                                    alt="inActive"
                                    className="status_btn"
                                    onClick={() => {
                                      productVideosStatusChange(
                                        product.prod_video_id,
                                        0
                                      );
                                    }}
                                  />
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" align="center">
                              data is not available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div style={{ width: "30%" }}>
                <form method="post" onSubmit={saveVedios}>
                  <div className="mb-3">
                    <label htmlFor="vedio_title" className="modal_label">
                      Video Title:-
                      <small style={{ color: "red" }}> *</small>
                    </label>
                    <input
                      type="text"
                      id="vedio_title"
                      name="vedio_title"
                      className="modal_input"
                      placeholder="Enter Video Title"
                      onChange={handleVedioContentChange}
                      value={addProductVedio.vedio_title}
                    />
                  </div>
                  <div className="mb-3">
                    <p className="modal_label">Video Description:-</p>
                    <Editor
                      apiKey={EditorApi}
                      value={addProductVedio.vedio_description}
                      onInit={(evt, editor) =>
                        (VedioeditorRef.current = editor)
                      }
                      init={{
                        height: 300,
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
                      onEditorChange={() =>
                        handleVedioEditorChange(
                          VedioeditorRef.current.getContent()
                        )
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="vedio_link" className="modal_label">
                      Video Link:-
                      <small style={{ color: "red" }}> *</small>
                    </label>
                    <input
                      type="text"
                      id="vedio_link"
                      name="vedio_link"
                      className="modal_input"
                      placeholder="Enter Video Link"
                      onChange={handleVedioContentChange}
                      value={addProductVedio.vedio_link}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="vedio_thumbnail" className="modal_label">
                      Video Image:-
                    </label>
                    <input
                      type="file"
                      id="vedio_thumbnail"
                      name="vedio_thumbnail"
                      className="modal_input"
                      accept="image/*"
                      onChange={handleVedioFileChange}
                      required={!editingVedioId}
                    />
                    {editingVedioId ? (
                      <img
                        src={`/assets/upload/products/productVedios/${addProductVedio.vedio_thumbnail}`}
                        width="100%"
                        alt="product"
                        className="tabel_data_image"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  ></div>
                  <div className="mb-3">
                    {/* <button type="submit" className="success_btn">
                      {editingVedioId ? "UPDATE" : "SAVE"}
                    </button> */}
                    <input
                      type="submit"
                      style={loading ? { cursor: "not-allowed" } : {}}
                      className="success_btn"
                      value={
                        loading
                          ? "Editing..."
                          : editingVedioId
                          ? "UPDATE"
                          : "SAVE"
                      }
                      disabled={loading}
                    />
                    <button onClick={handleCancelEditClick}>
                      <button type="button" className="success_btn cancel_btn">
                        CANCEL
                      </button>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Docs Tabs */}
          <div
            id="docs"
            className={`tab-content add_data_form ${
              activeTab === "docs" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={saveMultipleDocs}>
              <div className="mb-3">
                <label htmlFor="product_images" className="modal_label">
                  Product Docs:-
                </label>
                <input
                  type="file"
                  id="product_images"
                  name="product_images"
                  className="modal_input"
                  accept=".pdf"
                  onChange={handleAddMultipleDocsChange}
                  multiple
                />
              </div>
              <div
                className="mb-3"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {addMultiDocs.product_docs &&
                addMultiDocs.product_docs.length > 0 ? (
                  <table className="multi-images-table">
                    <thead>
                      <tr>
                        <th width="5%">Image</th>
                        <th width="25%">Title</th>
                        <th width="5%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addMultiDocs.product_docs.map((image, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={"/assets/images/pdf-icon.webp"}
                              alt={`Selected productimg ${index + 1}`}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              id={`docs_title-${index}`}
                              name="docs_title"
                              placeholder="docs Title"
                              onChange={(e) =>
                                handleDocsDetailsChange(
                                  index,
                                  "docs_title",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="remove_multi_img_btn"
                              onClick={() => removeMultiDocs(index)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No images selected</p>
                )}
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
                <Link href="/admin/products">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
            <hr style={{ marginTop: "30px", marginBottom: "20px" }} />
            <div className="admin_category_table">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th style={{ width: "10%" }}>IMAGE</th>
                    <th style={{ width: "25%" }}>TITLE</th>
                    <th style={{ width: "10%" }}>ACTION</th>
                    <th style={{ width: "10%" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {allProductDocs.length > 0 ? (
                    allProductDocs.map((product, index) => (
                      <tr key={product.product_id}>
                        <td>{index + 1}</td>
                        {editingDocId === product.prod_docs_id ? (
                          <td className="edit-row">
                            <input
                              type="file"
                              name="pdf_link"
                              id={`pdf_input_${index}`}
                              style={{ display: "none" }}
                              onChange={handlePerDocFileData}
                            />
                            <td>
                              <div className="image-container">
                                <label
                                  htmlFor={`pdf_input_${index}`}
                                  className="overlay"
                                >
                                  <i className="fa-solid fa-image"></i>
                                </label>
                                <img
                                  src={`/assets/images/pdf-icon.webp`}
                                  width="100%"
                                  alt="product"
                                  className="tabel_data_image"
                                />
                              </div>
                            </td>
                          </td>
                        ) : (
                          <td>
                            <td>
                              <div
                                onClick={() =>
                                  window.open(
                                    `/assets/upload/products/productDocs/${product.pdf_link}`,
                                    "_blank"
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <img
                                  src={`/assets/images/pdf-icon.webp`}
                                  width="100%"
                                  alt="product"
                                  className="tabel_data_image"
                                />
                              </div>
                            </td>
                          </td>
                        )}
                        {editingDocId === product.prod_docs_id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="pdf_title"
                              onChange={handlePerDocData}
                              value={editDoc.pdf_title}
                            />
                          </td>
                        ) : (
                          <td>{product.pdf_title}</td>
                        )}
                        {editingDocId === product.prod_docs_id ? (
                          <td className="edit-row">
                            <div>
                              <button
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  padding: "5px",
                                }}
                                onClick={() =>
                                  handleUpdateDocClick(product.prod_docs_id)
                                }
                              >
                                <i className="fa-solid fa-floppy-disk"></i>
                              </button>
                              <button
                                className="cancel"
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  padding: "5px",
                                }}
                                onClick={() => setEditingDocId(null)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          </td>
                        ) : (
                          <td>
                            <button
                              className="editbutton"
                              onClick={() =>
                                handleEditDocClick(
                                  product.prod_docs_id,
                                  product
                                )
                              }
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              className="data_delete_btn"
                              onClick={() =>
                                openDeleteModal(product.prod_docs_id, "docs")
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        )}
                        <td>
                          {product.status === 1 ? (
                            <img
                              src="/assets/images/activeStatus.png"
                              alt="active"
                              className="status_btn"
                              onClick={() =>
                                productDocsStatusChange(product.prod_docs_id, 1)
                              }
                            />
                          ) : (
                            <img
                              src="/assets/images/inActiveStatus.png"
                              alt="inActive"
                              className="status_btn"
                              onClick={() =>
                                productDocsStatusChange(product.prod_docs_id, 0)
                              }
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" align="center">
                        data is not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certificate Tabs */}
          <div
            id="docs"
            className={`tab-content add_data_form ${
              activeTab === "certificate" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={saveMultipleCertificate}>
              <div className="mb-3">
                <label htmlFor="product_images" className="modal_label">
                  Product Certificate:-
                </label>
                <input
                  type="file"
                  id="product_images"
                  name="product_images"
                  className="modal_input"
                  accept=".pdf,.png"
                  onChange={handleAddMultipleCertificateChange}
                  multiple
                />
              </div>
              <div
                className="mb-3"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {addMultiCertificate.product_certificate &&
                addMultiCertificate.product_certificate.length > 0 ? (
                  <table className="multi-images-table">
                    <thead>
                      <tr>
                        <th width="5%">Image</th>
                        <th width="25%">Title</th>
                        <th width="5%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addMultiCertificate.product_certificate.map(
                        (image, index) => (
                          <tr key={index}>
                            <td>
                              <img
                                src={"/assets/images/pdf-icon.webp"}
                                alt={`Selected productimg ${index + 1}`}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                id={`certificate_title-${index}`}
                                name="certificate_title"
                                placeholder="certificate Title"
                                onChange={(e) =>
                                  handleCertificateDetailsChange(
                                    index,
                                    "certificate_title",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="remove_multi_img_btn"
                                onClick={() => removeMultiCertificate(index)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p>No images selected</p>
                )}
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
                <Link href="/admin/products">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
            <hr style={{ marginTop: "30px", marginBottom: "20px" }} />
            <div className="admin_category_table">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th style={{ width: "10%" }}>IMAGE</th>
                    <th style={{ width: "25%" }}>TITLE</th>
                    <th style={{ width: "10%" }}>ACTION</th>
                    <th style={{ width: "10%" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {allProductCertificate.length > 0 ? (
                    allProductCertificate.map((product, index) => (
                      <tr key={product.product_id}>
                        <td>{index + 1}</td>
                        {editingCertificateId === product.prod_certi_id ? (
                          <td className="edit-row">
                            <input
                              type="file"
                              name="certificate_link"
                              onChange={handlePerCertificateFileData}
                            />
                            <td>
                              <img
                                src={`/assets/images/pdf-icon.webp`}
                                width="100%"
                                alt="product"
                                className="tabel_data_image"
                              />
                            </td>
                          </td>
                        ) : (
                          <td>
                            <td>
                              <div
                                onClick={() =>
                                  window.open(
                                    `/assets/upload/products/productCertificate/${product.certificate_link}`,
                                    "_blank"
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <img
                                  src={`/assets/images/pdf-icon.webp`}
                                  width="100%"
                                  alt="product"
                                  className="tabel_data_image"
                                />
                              </div>
                            </td>
                          </td>
                        )}
                        {editingCertificateId === product.prod_certi_id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="certificate_title"
                              onChange={handlePerCertificateData}
                              value={editCertificate.certificate_title}
                            />
                          </td>
                        ) : (
                          <td>{product.certificate_title}</td>
                        )}
                        {editingCertificateId === product.prod_certi_id ? (
                          <td className="edit-row">
                            <div>
                              <button
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  padding: "5px",
                                }}
                                onClick={() =>
                                  handleUpdateCertiClick(product.prod_certi_id)
                                }
                              >
                                <i className="fa-solid fa-floppy-disk"></i>
                              </button>
                              <button
                                className="cancel"
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  padding: "5px",
                                }}
                                onClick={() => setEditingCertificateId(null)}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </div>
                          </td>
                        ) : (
                          <td>
                            <button
                              className="editbutton"
                              onClick={() =>
                                handleEditCertificateClick(
                                  product.prod_certi_id,
                                  product
                                )
                              }
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                              className="data_delete_btn"
                              onClick={() =>
                                openDeleteModal(
                                  product.prod_certi_id,
                                  "certificate"
                                )
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        )}
                        <td>
                          {product.status === 1 ? (
                            <img
                              src="/assets/images/activeStatus.png"
                              alt="active"
                              className="status_btn"
                              onClick={() =>
                                productCertificateStatusChange(
                                  product.prod_certi_id,
                                  1
                                )
                              }
                            />
                          ) : (
                            <img
                              src="/assets/images/inActiveStatus.png"
                              alt="inActive"
                              className="status_btn"
                              onClick={() =>
                                productCertificateStatusChange(
                                  product.prod_certi_id,
                                  0
                                )
                              }
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" align="center">
                        data is not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            id="drawing"
            className={`tab-content add_data_form ${
              activeTab === "drawing" ? "active" : ""
            }`}
          >
            <form method="post" onSubmit={saveMultipleDrawing}>
              <div className="mb-3">
                <label htmlFor="product_images" className="modal_label">
                  Product Drawing:-
                </label>
                <input
                  type="file"
                  id="product_images"
                  name="product_images"
                  className="modal_input"
                  accept=".pdf,.png"
                  onChange={handleAddMultipleDrawingChange}
                  multiple
                />
              </div>
              <div
                className="mb-3"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {addMultiDrawing.product_drawing &&
                addMultiDrawing.product_drawing.length > 0 ? (
                  <table className="multi-images-table">
                    <thead>
                      <tr>
                        <th width="25%">Title</th>
                        <th width="15%">Image</th>
                        <th width="10%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addMultiDrawing.product_drawing.map((image, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              id={`drawing_title-${index}`}
                              name="drawing_title"
                              placeholder="Certificate Title"
                              onChange={(e) =>
                                handleDrawingDetailsChange(
                                  index,
                                  "drawing_title",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <img
                              src={"/assets/images/pdf-icon.webp"}
                              alt={`Selected productimg ${index + 1}`}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="remove_multi_img_btn"
                              onClick={() => removeMultiDrawing(index)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No images selected</p>
                )}
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
                <Link href="/admin/products">
                  <button type="button" className="success_btn cancel_btn">
                    CANCEL
                  </button>
                </Link>
              </div>
            </form>
            <hr style={{ marginTop: "30px", marginBottom: "20px" }} />
            <div className="admin_category_table">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th style={{ width: "25%" }}>PDF</th>
                    <th style={{ width: "25%" }}>TITLE</th>
                    <th style={{ width: "10%" }}>ACTION</th>
                    <th style={{ width: "10%" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {allProductDrawing.length > 0 ? (
                    allProductDrawing.map((product, index) => (
                      <tr key={product.id}>
                        <td>{index + 1}</td>

                        {editingDrawingId === product.id ? (
                          <td className="edit-row">
                            <input
                              type="file"
                              name="pdf_link"
                              onChange={handlePerDrewingFileData}
                            />
                            <img
                              src={`/assets/images/pdf-icon.webp`}
                              width="100%"
                              alt="product"
                              className="tabel_data_image"
                            />
                          </td>
                        ) : (
                          <td>
                            <div
                              onClick={() =>
                                window.open(
                                  `/assets/upload/products/productDrawing/${product.pdf_link}`,
                                  "_blank"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={`/assets/images/pdf-icon.webp`}
                                width="100%"
                                alt="product"
                                className="tabel_data_image"
                              />
                            </div>
                          </td>
                        )}
                        {editingDrawingId === product.id ? (
                          <td className="edit-row">
                            <input
                              type="text"
                              name="pdf_title"
                              onChange={handlePerDrawingData}
                              value={editDrawing.pdf_title}
                            />
                          </td>
                        ) : (
                          <td>{product.pdf_title}</td>
                        )}

                        {editingDrawingId === product.id ? (
                          <td className="edit-row">
                            <div>
                              <div>
                                <button
                                  style={{
                                    height: "30px",
                                    width: "30px",
                                    padding: "5px",
                                  }}
                                  onClick={() =>
                                    handleUpdateDrawingClick(product.id)
                                  }
                                >
                                  <i className="fa-solid fa-floppy-disk"></i>
                                </button>
                                <button
                                  className="cancel"
                                  style={{
                                    height: "30px",
                                    width: "30px",
                                    padding: "5px",
                                  }}
                                  onClick={() => setEditingDrawingId(null)}
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                        ) : (
                          <td>
                            <div>
                              <button
                                className="editbutton"
                                onClick={() =>
                                  handleEditDrawingClick(product.id, product)
                                }
                              >
                                <i className="fa-regular fa-pen-to-square"></i>
                              </button>
                              <button
                                className="data_delete_btn"
                                onClick={() =>
                                  openDeleteModal(product.id, "drawing")
                                }
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        )}
                        <td>
                          {product.status === 1 ? (
                            <img
                              src="/assets/images/activeStatus.png"
                              alt="active"
                              className="status_btn"
                              onClick={() =>
                                productDrawingStatusChange(product.id, 1)
                              }
                            />
                          ) : (
                            <img
                              src="/assets/images/inActiveStatus.png"
                              alt="inActive"
                              className="status_btn"
                              onClick={() =>
                                productDrawingStatusChange(product.id, 0)
                              }
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" align="center">
                        Data is not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={deleteCategory}
        />
        <Toast />
      </section>
      <style jsx global>{`
        .image-container {
          position: relative;
          cursor: pointer;
        }

        .image-container img {
          width: 100px;
          height: 100px;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .overlay:hover {
          opacity: 1;
        }

        .overlay i {
          font-size: 24px;
        }
      `}</style>
    </>
  );
};

export default EditProduct;
