import { Google_Sans, Instrument_Serif } from "next/font/google";

export const instrumentSerifHeading = Instrument_Serif({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-display",
});

export const google = Google_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
	fallback: [
		"Inter",
		"Segoe UI",
		"Roboto",
		"Helvetica Neue",
		"Arial",
		"sans-serif",
	],
});
