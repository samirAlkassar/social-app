// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.pinimg.com", "res.cloudinary.com"], // 👈 add this line
  },
};

export default nextConfig;
