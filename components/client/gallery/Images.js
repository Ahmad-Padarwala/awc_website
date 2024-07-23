import axios from "axios";
import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const Images = ({ selectedCategory }) => {
  const [loading, setLoading] = useState(true);
  const [galleryPhoto, setGalleryPhoto] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/gallery/categoryimage/${selectedCategory}`
      );
      setGalleryPhoto(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getImages();
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  useEffect(() => {
    fetchData();

    // Add scroll event listener
    const handleScroll = () => {
      const images = document.querySelectorAll(".gallery-inner-images");

      images.forEach((image) => {
        const imageOffset = image.offsetTop;
        const scrollY = window.scrollY;

        // Adjust the class based on scroll position
        if (scrollY > imageOffset - window.innerHeight / 2) {
          image.classList.add("on-scroll-effect");
        } else {
          image.classList.remove("on-scroll-effect");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedCategory]);

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      const galleryImages = document.querySelectorAll(
        ".gallery-inner-images img"
      );

      function checkScroll() {
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const scrollPosition =
          window.scrollY || document.documentElement.scrollTop;

        galleryImages.forEach((image) => {
          const rect = image.getBoundingClientRect();

          if (rect.top <= windowHeight * 0.8) {
            image.style.transform = "scale(1.1)";
          } else {
            image.style.transform = "scale(1)";
          }
        });
      }

      window.addEventListener("scroll", checkScroll);
      checkScroll(); // Check on initial load
    });
  }, []);

  return (
    <>
      <section className="gallery-image-sec">
        <div className="gallery-image-container">
          {loading ? (
            <div className="gallery-image-main-inner">
              <div className="grid">
                <div
                  role="status"
                  className="xl-4 lg-4 md-4 sm-6 space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                  id="gallery-main-images"
                >
                  <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                </div>
                <div
                  role="status"
                  className="xl-4 lg-4 md-4 sm-6 space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                  id="gallery-main-images"
                >
                  <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                </div>
                <div
                  role="status"
                  className="xl-4 lg-4 md-4 sm-6 space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                  id="gallery-main-images"
                >
                  <div className="flex items-center justify-center h-56 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                    <svg
                      className="w-10 h-10 text-gray-200 dark:text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Masonry
                breakpointCols={{ default: 3, 1100: 3, 700: 2, 500: 1 }}
                className="gallery-image-main-inner"
                columnClassName="grid-column"
              >
                {galleryPhoto.map((image, index) => (
                  <div
                    key={index}
                    className="gallery-inner-images"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={`/assets/upload/gallery/${image?.gallery_image}`}
                      alt={image?.gallery_title}
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </Masonry>
              {lightboxOpen && (
                <Lightbox
                  mainSrc={`/assets/upload/gallery/${galleryPhoto[lightboxIndex]?.gallery_image}`}
                  nextSrc={
                    galleryPhoto[(lightboxIndex + 1) % galleryPhoto.length]
                      ?.gallery_image
                  }
                  prevSrc={
                    galleryPhoto[
                      (lightboxIndex + galleryPhoto.length - 1) %
                        galleryPhoto.length
                    ]?.gallery_image
                  }
                  onCloseRequest={closeLightbox}
                  onMovePrevRequest={() =>
                    setLightboxIndex(
                      (lightboxIndex + galleryPhoto.length - 1) %
                        galleryPhoto.length
                    )
                  }
                  onMoveNextRequest={() =>
                    setLightboxIndex((lightboxIndex + 1) % galleryPhoto.length)
                  }
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Images;
