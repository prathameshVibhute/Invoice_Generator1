import { Font } from "@react-pdf/renderer";

export function registerPdfFonts(): void {
  Font.register({
    family: "Montserrat",
    fonts: [
      { src: "/fonts/Montserrat-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
}
