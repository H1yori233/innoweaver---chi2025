/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // API_URL: 'http://120.55.193.195:5000',
        API_URL: 'http://localhost:5000',
    },
    images: {
        domains: ['s2.loli.net'],
    },
};
export default nextConfig;
