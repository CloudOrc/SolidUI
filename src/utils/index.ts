export const PREFIX = "scena-";

export function prefixNames(prefix: string, ...classNames: string[]) {
	return classNames
		.map((className) =>
			className
				.split(" ")
				.map((name) => (name ? `${prefix}${name}` : ""))
				.join(" ")
		)
		.join(" ");
}

export function prefix(...classNames: string[]) {
	return prefixNames(PREFIX, ...classNames);
}

export function checkInput(target: HTMLElement | SVGElement) {
	const tagName = target.tagName.toLowerCase();

	return (
		(target as HTMLElement).isContentEditable ||
		tagName === "input" ||
		tagName === "textarea"
	);
}
