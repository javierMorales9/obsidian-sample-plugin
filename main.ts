import { Plugin, App, Notice, PluginManifest } from 'obsidian';
//import { CreationModal, FileData } from 'src/CreationModal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createContext } from 'react';
import { Root, createRoot } from "react-dom/client";
import { ReactView } from 'src/ReactView';

export const AppContext = createContext<App | undefined>(undefined);
export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};

export default class FuzzySearcher extends Plugin {
	//private modal: CreationModal | null;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		//this.modal = null;
	}

	async onload() {
		this.addCommand({
			id: 'open-file-creator',
			name: 'Open the creator',
			callback: () => {
				const containerEl = document.body;

				const element = containerEl.createEl('div');
				element.className = 'modalalalalal';
				element.style.position = 'absolute';
				element.style.top = '50%';
				element.style.left = '50%';
				element.style.display = 'flex';
				element.style.justifyContent = 'center';
				element.style.alignItems = 'center';

				ReactDOM.render(
					React.createElement(
						AppContext.Provider,
						{ value: this.app },
						React.createElement(ReactView, {})
					),
					element
				);
			},
		});
	}

	onunload() {
		//TODO.
	}
}
