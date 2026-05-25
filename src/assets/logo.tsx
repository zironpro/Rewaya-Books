import Image from "next/image";

export const Logo = () => {
	return (
		<Image
			alt="Al Rewaya Logo"
			className="h-8 w-auto object-contain md:h-10"
			height={44}
			loading="eager"
			src="/logo/rewaya-logo.svg"
			width={176}
		/>
	);
};
