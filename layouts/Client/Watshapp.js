import Link from "next/link";
import React, { useState, useEffect } from "react";

import axios from "axios";

const Watshapp = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const getSocialLinksData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/social-links/router`
      );
      setSocialLinks(response.data[0]);
      console.log(response.data[0]);
      console.log("object");
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
            <i class="fa-brands fa-whatsapp"></i>
          </Link>
        ) : (
          <Link
            href="https://wa.me/918686862475?text"
            target="blank"
            aria-label="whatsapp"
          >
            <i class="fa-brands fa-whatsapp"></i>
          </Link>
        )}
      </div>
    </>
  );
};

export default Watshapp;
