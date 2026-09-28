import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // As fotos vêm do TSE; usamos <img> comum para não depender de domínios configurados.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
