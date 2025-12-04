/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.googleusercontent.com'
            },
            {
                protocol: 'https',
                hostname: '**.firebaseapp.com',
            },
            {
                protocol: 'https',
                hostname: '**.appspot.com', // ✅ Firebase Storage URLs use this
            },
        ]
    }
};

export default nextConfig;
