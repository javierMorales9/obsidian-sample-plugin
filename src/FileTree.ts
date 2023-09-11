export class FileTree {
	name: string;
	children: FileTree[] = [];

	constructor(name: string) {
		this.name = name;
	}

	addChild(path: string) {
		const pathParts = path.split('/');
		const childName = pathParts[0];

		let child = this.children.find((child) => child.name === childName);
		if (!child) {
			child = new FileTree(childName);
			this.children.push(child);
		}
		if (pathParts.length > 1) {
			child.addChild(pathParts.slice(1).join('/'));
		}
	}

	getChildren(path?: string): FileTree[] {
		if (!path || path === '') return this.children;
		const pathParts = path.split('/');
		const childName = pathParts[0];

		const child = this.children.find((child) => child.name === childName);
		if (!child) return [];
		if (pathParts.length > 1) {
			return child.getChildren(pathParts.slice(1).join('/'));
		}

		return [];
	}

	print() {
		console.log(this.generatePrintableObject());
	}

	private generatePrintableObject() {
		const printChildren = this.children.map((child) => {
			const children = child.children.length > 0 ? child.generatePrintableObject() : [];
			return { name: child.name, children };
		}) as any;

		return { name: this.name, children: printChildren };
	}
}
