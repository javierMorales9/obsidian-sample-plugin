import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useApp } from "src/AppContext";
import { FileTree } from "src/FileTree";
import { z } from 'zod';

const State = {
	NAME: "name",
	PATH: "path",
	TAGS: "tags",
};

const FileInfo = z.object({
	name: z.string(),
	path: z.string(),
	tags: z.array(z.string()).optional(),
});

type FileInfoType = z.infer<typeof FileInfo>;

export const ReactView = ({ close }: { close: () => void }) => {
	const { tree } = useApp();
	const [state, setState] = useState(State.NAME);

	const form = useForm<FileInfoType>({
		defaultValues: {
			name: "",
			path: "",
			tags: [],
		},
	});


	function Name({ next }: { next: () => void }) {
		useEffect(() => {
			form.setFocus('name');
		}, []);

		return (
			<div className="w-full flex flex-col gap-y-6">
				<h1 className="text-2xl font-semibold">Name</h1>
				<div className="flex flex-col gap-y-4 items-end">
					<input
						{...form.register("name")}
						className="h-8 border border-1 border-white w-full prompt-input placeholder:text-gray-500"
						placeholder="Enter the file name..."
					/>
					<div onClick={next} className="inline-flex cursor-pointer p-2 bg-[#242424]">Alt Enter</div>
				</div>
			</div>
		);
	}

	function Path({ next }: { next: () => void }) {
		const [selected, setSelected] = useState<number>(0);

		function File({ file, selected }: { file: string, selected: boolean }) {
			return <div className={`${selected ? 'text-orange-800' : ''}`}>{file}</div>;
		}

		function Dir({ tree, selected }: { tree: FileTree, selected: boolean }) {
			return <div className={`${selected ? 'text-orange-800' : ''}`}>{'>'}{tree.name}</div>;
		}

		return (
			<div>
				{tree && tree.children.map((child, id) => {
					return (
						<div className="">
							{child.children.length === 0
								? <File key={id} file={child.name} selected={selected === id} />
								: <Dir key={id} tree={child} selected={selected === id} />}
						</div>
					);
				})}
				<button onClick={next}>Next</button>
			</div>
		);
	}

	function Tags({ next }: { next: () => void }) {
		return (
			<div>
				<input {...form.register("tags")} />
				<button onClick={next}>Next</button>
			</div>
		);
	}

	function submit() {
		const result = FileInfo.parse(form.getValues());
		console.log(result);
	}

	return (
		<FormProvider {...form}>
			<div className="py-6 px-4 absolute top-1/4 right-1/2 translate-x-1/2 flex flex-col items-start gap-4 border border-1 border-[#555555] bg-[#1e1e1e] rounded-lg min-w-[40%]">
				<span onClick={close} className="absolute top-4 right-6 text-xl cursor-pointer">X</span>
				{state === State.NAME && <Name next={() => setState(State.PATH)} />}
				{state === State.PATH && <Path next={submit} />}
			</div>
		</FormProvider>
	);
};
