import { Font } from "@react-pdf/renderer";

export function registerPdfFonts(): void {
  Font.register({
    family: "NotoSans",
    fonts: [
      { src: "/fonts/NotoSans-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/NotoSans-Bold.ttf", fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
}
