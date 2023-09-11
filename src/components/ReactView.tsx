import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useApp } from "src/AppContext";
import { FileTree } from "src/FileTree";
import { z } from 'zod';
import Fuse from 'fuse.js';

const FileInfo = z.object({
	path: z.string(),
	searchText: z.string(),
});

type FileInfoType = z.infer<typeof FileInfo>;

export const ReactView = ({ close }: { close: () => void }) => {
	const root = useApp().tree!;

	const form = useForm<FileInfoType>({
		defaultValues: {
			path: "",
			searchText: "",
		},
	});

	function Path({ next }: { next: () => void }) {
		const [openTrees, setOpenTress] = useState<FileTree[]>([root]);
		const list = useMemo(() => {
			const list: { tree: FileTree, padding: number }[] = [];

			function add(tree: FileTree, padding: number) {
				list.push({ tree, padding });

				if (openTrees.includes(tree)) {
					for (const child of tree.children) {
						add(child, padding + 1);
					}
				}
			}

			add(root, 0);

			// Remove the root
			list.shift();

			return list;
		}, [openTrees]);

		const toShow = useMemo(() => {
			if (form.getValues('searchText') === "")
				return;

			const searcher = new Fuse(list, {
				keys: ['tree.name', 'tree.path'],
			});

			return searcher.search(form.getValues('searchText'));

		}, [list]);
		console.log('to show', toShow);

		const [selected, setSelected] = useState<number>(0);

		useEffect(() => {
			form.setFocus('path');
		}, []);

		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'k' && e.altKey && selected > 0) {
					setSelected(selected - 1);
				} else if (e.key === 'j' && e.altKey && selected < list.length - 1) {
					setSelected(selected + 1);
				}
			};

			window.addEventListener('keydown', handleKeyDown);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		}, [selected]);


		function List() {
			return (
				<div>
					{list.map(({ tree, padding }, i) => {
						return (
							<div>
								{
									tree.children.length > 0 ? (
										<div style={{ paddingLeft: padding * 6 + 'px' }}>
											<Dir tree={tree} selected={i === selected} />
										</div>
									) : (
										<div style={{ paddingLeft: padding * 6 + 'px' }}>
											<File file={tree.name} selected={i === selected} />
										</div>
									)
								}
							</div>
						);
					})}
				</div>
			)
		}

		function File({ file, selected }: { file: string, selected: boolean }) {
			return <div className={`${selected ? 'text-orange-800' : ''}`}>{file}</div>;
		}

		function Dir({ tree, selected }: { tree: FileTree, selected: boolean }) {
			useEffect(() => {
				if (!selected)
					return;

				const handleKeyDown = (e: KeyboardEvent) => {
					if (e.key === 'o' && e.altKey) {
						if (openTrees.includes(tree))
							setOpenTress(openTrees.filter((t) => t !== tree));
						else
							setOpenTress([...openTrees, tree]);
					}
				}

				window.addEventListener('keydown', handleKeyDown);
				return () => {
					window.removeEventListener('keydown', handleKeyDown);
				};
			}, [selected]);

			return (
				<div>
					<div className={`${selected ? 'text-orange-800' : ''}`}>{'>'}{tree.name}</div>
				</div>
			);
		}

		return (
			<div>
				<input className="" type="text" {...form.register('searchText')} />
				<List />
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
				<Path next={submit} />
			</div>
		</FormProvider>
	);
};

