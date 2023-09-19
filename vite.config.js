import webfontDownload from "vite-plugin-webfont-dl";

export default {
    base: "/bell-tracker/",
    plugins: [
        webfontDownload(),
    ],
};