import type React from "react";

import { SpinnerIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

export function Spinner({
	className,
	...props
}: React.ComponentProps<typeof SpinnerIcon>): React.ReactElement {
	return (
		<SpinnerIcon
			aria-label="Loading"
			className={cn("animate-spin", className)}
			role="status"
			{...props}
		/>
	);
}
