import { Plugin, App, PluginManifest } from 'obsidian';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { ReactView } from 'src/components/ReactView';
import { AppProvider } from 'src/AppContext';

export default class FuzzySearcher extends Plugin {
	root: Root | null = null;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
	}

	async onload() {
		this.addCommand({
			id: 'open-file-creator',
			name: 'Open the creator',
			callback: () => {
				const containerEl = document.body;

				const element = containerEl.createEl('div');
				this.root = createRoot(element);

				this.root.render(
					React.createElement(AppProvider, {
						app: this.app,
						children: React.createElement(ReactView, {
							close: () => this.root?.unmount(),
						}),
					})
				);
			},
		});

		this.addCommand({
			id: 'move-down',
			name: 'Move down in the tree',
			callback: () => {
				this.app.workspace.trigger('file-tree:move-down');
			},
		});

		this.addCommand({
			id: 'move-up',
			name: 'Move up in the tree',
			callback: () => {
				this.app.workspace.trigger('file-tree:move-up');
			},
		});
	}

	onunload() {}
}
