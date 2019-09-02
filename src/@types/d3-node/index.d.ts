declare module 'd3-node' {

	interface D3SVG {
		append(name: string): D3SVG;

		attr(name: string, value: any): D3SVG;

		datum(value: any): D3SVG;
	}

	class D3Node {
		createSVG(width: number | null, height: number | null, attrs: { [name: string]: string }): D3SVG;

		svgString(): string;
	}

	export = D3Node;
}
