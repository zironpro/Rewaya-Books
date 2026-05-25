"use client";
import { useSearchParams } from "next/navigation";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import { Form } from "@/components/ui/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchForm() {
	const searchParams = useSearchParams();

	return (
		<Form
			action="/search"
			className="relative w-full max-w-[550px] lg:w-80 xl:w-full"
		>
			<InputGroup className="bg-muted">
				<InputGroupInput
					aria-label="Type your search query"
					autoComplete="off"
					defaultValue={searchParams?.get("q") || ""}
					key={searchParams?.get("q")}
					name="q"
					placeholder="What are you looking for?"
					size="lg"
					type="text"
				/>
				<InputGroupAddon className="text-muted-foreground">
					<MagnifyingGlassIcon aria-hidden="true" className="size-4" />
				</InputGroupAddon>
			</InputGroup>
		</Form>
	);
}

export function SearchSkeleton() {
	return (
		<form className="relative w-full max-w-[550px] lg:w-80 xl:w-full">
			<InputGroup>
				<InputGroupInput
					aria-label="Type your search query"
					autoComplete="off"
					placeholder="What are you looking for?"
					size="lg"
					type="text"
				/>
				<InputGroupAddon>
					<MagnifyingGlassIcon aria-hidden="true" className="size-4" />
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}
