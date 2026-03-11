import type { MetadataRoute } from "next";
import { getSiteUrl, siteDescription, siteName } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    id: getSiteUrl(),
  };
}
