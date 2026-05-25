import { Instrument_Serif, Public_Sans } from "next/font/google";

export const instrumentSerifHeading = Instrument_Serif({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-display",
});

export const publicSans = Public_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
});
