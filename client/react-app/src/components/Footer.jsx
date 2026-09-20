import { useState } from "react";
import logo from "../assets/logo.png";

function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-1">Contact Us</h2>
          <p className="text-gray-300 mb-6">Send us a message</p>

          <div className="flex flex-col gap-4 max-w-md">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white text-black px-4 py-3 rounded-md outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white text-black px-4 py-3 rounded-md outline-none"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="bg-white text-black px-4 py-3 rounded-md outline-none resize-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-white  text-black font-semibold px-4 py-2 rounded-md w-fit hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 md:text-right">
          <div className="flex items-center gap-2">
            <a
              href="https://nsti.ac.ke"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={logo}
                alt="NSTI logo"
                className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain"
              />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <i className="fa-solid fa-phone"></i>
            <span>+254 723 766635</span>
          </div>

          <div className="flex items-center gap-2">
            <i className="fa-solid fa-envelope"></i>
            <span>nairobisouthtraininginstitute@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="bg-maroon-dark border-t border-gold/20 text-center text-sm py-3">
        @Copyright 2026 All Rights Reserved Nairobi South Training Institute
      </div>
    </footer>
  );
}

export default Footer;
