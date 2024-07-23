import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";

const Certificate = () => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [certificate, setCertificate] = useState([]);

  const getVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/videos/router`
      );
      setVideos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching video data:", error);
      setLoading(false);
    }
  };

  const getCertificates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/certificate/router`
      );
      setCertificate(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificate data:", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await getVideos();
    await getCertificates();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 576 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <section className="certificate-sec">
        {/* Certificate section */}
        <div className="container-certificate">
          <div className="certificate-inner">
            <h3>CERTIFICATES</h3>
            <p>Our Commitment to Quality, Environment, and Safety</p>
            <div className="certificate-main-inner">
              {certificate?.map((cert, index) => (
                <div key={cert.id}>
                  <div className="certificate-content">
                    <div className="certificate-image">
                      <img
                        src={`/assets/upload/about/certificates/${cert.thumbnail}`}
                        alt={`Certificate ${cert.id}`}
                      />
                    </div>
                    <div className="flex items-center justify-center pt-3">
                      <h6>{cert.title}</h6>
                      <div className="certificate-download">
                        <a
                          href={`/assets/upload/about/certificates/${cert.pdf}`}
                          download
                        >
                          <img
                            src={"./assets/images/client/download.png"}
                            alt="Download"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* YouTube Video Links */}
        <div className="container-youtube mt-5">
          <div className="youtube-inner">
            <div className="video-main-inner">
              {videos?.map((vid) => (
                <div className="youtube-content" key={vid.id}>
                  <iframe
                    width="380px"
                    height="315"
                    src={vid.link}
                    allowFullScreen
                  ></iframe>
                  <p>{vid.title}</p>
                </div>
              ))}
            </div>

            {/* Member */}
            <div className="container-member">
              <div className="member-inner">
                <div className="grid">
                  <div className="xl-6 lg-6 md-12 sm-12">
                    <h6>IGBC MEMBER</h6>
                    <p>
                      The Indian Green Building Council (IGBC) is a part of the
                      Confederation of Indian Industry (CII) since the year
                      2001. Its vision is "To enable a sustainable built
                      environment for all and facilitate India to be one of the
                      global leaders in the sustainable built environment by
                      2025".The prestigious IGBC membership provides AWC with
                      access to resources2C international best practices and the
                      latest in the field of Green building initiatives thus
                      giving us the crucial competitive advantage. AWC is proud
                      to be in the company of experts, professionals and
                      multi-industry organizations that are at the forefront of
                      creating the green building revolution in India.
                    </p>
                  </div>
                  <div className="xl-6 lg-6 md-12 sm-12">
                    <div className="member-image">
                      <img
                        src={"./assets/images/client/IGBC 2024_page-0001.jpg"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Certificate;
