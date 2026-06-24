/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permite cargar escudos/fotos desde cualquier origen remoto que configures.
  // Como la app es local y privada, dejamos las imágenes sin optimizar para
  // evitar dependencias de red en el servidor.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
