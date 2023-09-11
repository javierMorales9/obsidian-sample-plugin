import { App } from "obsidian";
import { createContext, useContext, useMemo } from "react";
import { FileTree } from "./FileTree";

export type ContextType = { app: App | undefined, tree: FileTree | undefined };

export const AppContext = createContext<ContextType>({
	app: undefined,
	tree: undefined,
});

export function AppProvider({ children, app }: { children: React.ReactNode, app: App }) {
	const tree = useMemo(() => {
		const files = app.vault.getFiles().map((file) => file.path);
		const tree = new FileTree('/');
		for (const file of files) {
			tree.addChild(file);
		}
		return tree;
	}, [app.vault.getFiles()]);

	return <AppContext.Provider
		value={{
			app,
			tree,
		}}
	>
		{children}
	</AppContext.Provider>
}

export const useApp = (): ContextType => {
	return useContext(AppContext);
};
