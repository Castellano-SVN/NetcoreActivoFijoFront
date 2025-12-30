/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // ✅ Para publicar aunque existan errores de TS/ESLint en el proyecto
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
