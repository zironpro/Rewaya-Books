import Image from "next/image";

interface LogoProps {
	isDark?: boolean;
}

export const Logo = ({ isDark = false }: LogoProps) => {
	if (isDark)
		return (
			<Image
				alt="Al Rewaya Logo"
				className="h-8 w-auto object-contain md:h-9"
				height={44}
				loading="eager"
				src="/logo/rewaya-logo-dark.svg"
				width={176}
			/>
		);

	return (
		<Image
			alt="Al Rewaya Logo"
			className="h-8 w-auto object-contain md:h-9"
			height={44}
			loading="eager"
			src="/logo/rewaya-logo.svg"
			width={176}
		/>
	);
};
