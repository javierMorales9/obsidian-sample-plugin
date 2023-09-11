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

export const TreeSearcher = ({ close }: { close: () => void }) => {
	const root = useApp().tree!;

	const form = useForm<FileInfoType>({
		defaultValues: {
			path: "",
			searchText: "",
		},
	});

	function Path() {
		const [openTrees, setOpenTress] = useState<FileTree[]>([root]);
		const [selected, setSelected] = useState<number>(0);

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
				return list;

			const searcher = new Fuse(list, {
				keys: ['tree.name'],
			});

			return searcher.search(form.getValues('searchText')).map(result => result.item);

		}, [list, form.watch('searchText')]);

		useEffect(() => {
			form.setFocus('searchText');
		}, []);

		useEffect(() => {
			const selectedEle = toShow[selected];
			const isDir = selectedEle.tree.children.length > 0;

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'k' && e.altKey && selected > 0) {
					setSelected(selected - 1);
				}
				else if (e.key === 'j' && e.altKey && selected < toShow.length - 1) {
					setSelected(selected + 1);
				}
				else if (e.key === 'o' && e.altKey) {
					if (isDir) {
						if (openTrees.includes(selectedEle.tree))
							setOpenTress(openTrees.filter((t) => t !== selectedEle.tree));
						else
							setOpenTress([...openTrees, selectedEle.tree]);
					}
					else { }
				}
				else if (e.key === 'Escape') {
					close();
				}
			};

			window.addEventListener('keydown', handleKeyDown);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		}, [selected, openTrees, toShow]);


		return (
			<div>
				<input className="" type="text" {...form.register('searchText')} />
				<div>
					{toShow.map(({ tree, padding }, i) => {
						return (
							<div key={tree.path}>
								{
									tree.children.length > 0 ? (
										<div style={{ paddingLeft: padding * 6 + 'px' }}>
											<div
												className={`${selected === i ? 'text-orange-800' : ''}`}>
												{'>'}{tree.name}
											</div>
										</div>
									) : (
										<div style={{ paddingLeft: padding * 6 + 'px' }}>
											<div
												className={`${selected === i ? 'text-orange-800' : ''}`}>
												{tree.name}
											</div>
										</div>
									)
								}
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	return (
		<FormProvider {...form}>
			<div className="py-6 px-4 absolute top-1/4 right-1/2 translate-x-1/2 flex flex-col items-start gap-4 border border-1 border-[#555555] bg-[#1e1e1e] rounded-lg min-w-[40%]">
				<span onClick={close} className="absolute top-4 right-6 text-xl cursor-pointer">X</span>
				<Path />
			</div>
		</FormProvider>
	);
};

