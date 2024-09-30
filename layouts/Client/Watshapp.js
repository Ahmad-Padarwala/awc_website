import Link from "next/link";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/utils/axiosInstance";

const Watshapp = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const getSocialLinksData = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/social-links/router`
      );
      setSocialLinks(response.data[0]);
    } catch (error) {}
  };

  useEffect(() => {
    getSocialLinksData();
  }, []);
  return (
    <>
      <div className="watsapp-icon">
        {socialLinks && socialLinks.whatsapp_link ? (
          <Link
            href={socialLinks.whatsapp_link}
            target="blank"
            aria-label="whatsapp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </Link>
        ) : (
          <Link
            href="https://wa.me/918686862475?text"
            target="blank"
            aria-label="whatsapp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </Link>
        )}
      </div>
    </>
  );
};

export default Watshapp;
