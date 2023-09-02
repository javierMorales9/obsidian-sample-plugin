import {  App, Modal, Notice, Setting } from 'obsidian';

export class CreationModal extends Modal {
	result: string;
	step: number;
	onSubmit: (result: string) => void;

	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.step = 1;
	}

	onOpen() {
		this.setStep();
	}

	onClose() {
		this.cleanModal();
	}



	public goNextStep() {
		new Notice("In the go next step");
		this.step += 1;
		this.setStep();
	}

	private setStep() {
		this.cleanModal();
		switch(this.step) {
			case 1:
				this.setUpNameInput();
				break;
			case 2:
				this.setUpTagInput();
				break;
			default:
				new Notice("In the switch");
		}
	}

	private cleanModal() {
		let { contentEl } = this;
		contentEl.empty();
	}

	private setUpNameInput() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "What's your name?" });

		new Setting(contentEl)
			.setName("Name")
			.addText((text) =>
				text.onChange((value) => {
					this.result = value
				}));
	}

	private setUpTagInput() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "What's your age?" });

		new Setting(contentEl)
			.setName("Name")
			.addText((text) =>
				text.onChange((value) => {
					this.result = value
				}));
	}
}
