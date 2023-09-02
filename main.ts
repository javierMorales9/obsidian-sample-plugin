import { Plugin, App, Notice, PluginManifest } from 'obsidian';
import {CreationModal} from 'src/CreationModal';

export default class FuzzySearcher extends Plugin {
	private modal: CreationModal | null;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.modal = null;
	}

	async onload() {
		this.addCommand({
			id: 'open-file-creator',
			name: 'Open the creator',
			callback: () => {
				this.modal = 
					this.modal ||
					new CreationModal(
						this.app,
						(text: string) => new Notice('The text: ' + text)
					);

				this.modal.open();
			}
		});

		this.addCommand({
			id: 'go-next-step',
			name: 'Go next step in the creation',
			hotkeys: [{modifiers: ["Ctrl", "Shift"], key: 'b'}],
			callback: () => {
				new Notice("A ver si reacciona");
				this.modal?.goNextStep();
			}
		});
	}

	onunload() {
		//TODO.
	}
}

