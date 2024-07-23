// components/ViewModal.js
import React from "react";
import YouTube from "react-youtube";

const ViewModal = ({ isOpen, onClose, data, getProductData }) => {
  if (!isOpen || !data) {
    return null;
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|y\/|\/v\/|\/e\/|watch\?.*v=)([^"&?\/\s]{11})/
    );

    return videoIdMatch ? videoIdMatch[1] : null;
  };

  //generate star
  const generateStars = () => {
    const rating = data.rating || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starStyle = {
        color: i <= Math.floor(rating) ? "#f8d64e" : "#ddd",
        display: "inline-block",
        fontSize: "24px",
        cursor: "pointer",
        marginRight: "5px",
      };

      // If the decimal part is greater than 0.2 and less than 0.8, show a half star
      if (
        i === Math.floor(rating) + 1 &&
        rating % 1 > 0.2 &&
        rating % 1 < 0.8
      ) {
        starStyle.background =
          "linear-gradient(to right, yellow 50%, black 50%)";
        starStyle.WebkitBackgroundClip = "text";
        starStyle.color = "transparent";
      }

      stars.push(
        <span key={i} style={starStyle} onClick={() => handleStarClick(i)}>
          &#9733;
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="overlay">
      <div className="popup">
        {/* Modal content goes here */}
        <div>
          <img
            src={`/assets/upload/testimonial/${data.testimonial_image}`}
            width="100px"
            height="100px"
            alt="testimonial"
            className="tabel_data_image"
            style={{
              borderRadius: "100%",
            }}
          />
          <h2>{data.testimonial_title}</h2>
        </div>
        <a className="close" href="#" onClick={onClose}>
          &times;
        </a>
        <div className="content">
          <div>
            <span style={{ fontWeight: "bold" }}>Product-Title :</span>
            <span>
              {getProductData.map(
                (product) =>
                  product.product_id === data.product_id && (
                    <span key={product.product_id}>
                      {product.product_title}
                    </span>
                  )
              )}
            </span>
          </div>

          <div style={{ paddingTop: "5px" }}>
            <span style={{ fontWeight: "bold" }}>Description :</span>
            <span
              dangerouslySetInnerHTML={{
                __html: data.testimonial_desc,
              }}
            ></span>
          </div>

          <div style={{ paddingTop: "20px" }}>
            {data.testimonial_video && (
              <YouTube
                videoId={getYouTubeVideoId(data.testimonial_video)}
                opts={{
                  width: "100%",
                  height: "300",
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />
            )}
          </div>

          <div style={{ paddingTop: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Star Rating :</span>
            <span>
              <p style={{ paddingLeft: "10px" }}>{generateStars()}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
