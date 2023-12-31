import React, {Dispatch, RefObject, SetStateAction, useEffect, useRef, useState} from "react";
import {Category, Project, User} from "@/lib/types";
import {addTask} from "@/lib/tasks";
import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import ChoiceDialog from "@/components/App/Dialogs/ChoiceDialog";
import Toggle from "@/components/Input/Toggle";

type TaskDialogProps = {
	dialog: RefObject<DialogModalHandle>,
	user: User | undefined | null,
	project: Project | undefined | null,
	category?: Category | undefined |null,

	onUpdate: () => void,
}

export default function CreateTaskDialog({ dialog, user, project, category, onUpdate } : TaskDialogProps) {
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(category ?? null)

	const choiceDialogRef = useRef<DialogModalHandle>(null);

	async function createTask(event: any) {
		event.preventDefault()
		
		if (!user || !project)
			return;
		
		let data = {
			name: String(event.currentTarget.Name.value),
			description: String(event.currentTarget.Description.value),
			isFinished: Boolean(event.currentTarget.Finished.checked),
		}

		await addTask(
			data.name,
			data.description,
			data.isFinished,
			user.id,
			project.id,
			selectedCategory?.id
		);

		await onUpdate()

		dialog.current?.hide();
		event.target.reset();
	}

	useEffect(() => {
		if (!project?.categories.find(c => c.id == selectedCategory?.id))
			setSelectedCategory(null);
	}, [project])

	useEffect(() => {
		setSelectedCategory(category ?? null)
	}, [category])

	return (
		<>
			<Dialog.Modal ref={dialog}>
				<Dialog.Container>
					<Dialog.Column>
						<Title context={"dialog"}>
							Create task
						</Title>

						<Description>
							Add a task to create a reminder for yourself.
						</Description>
					</Dialog.Column>

					<Dialog.Form onSubmit={createTask}>
						<Dialog.Column>
							<InputField
								focus
								maximum={20}
								type={"form"}
								title={"Name"}
								placeholder={"Default task"}
								required={true}
							/>

							<InputField
								type={"form"}
								title={"Description"}
								placeholder={"This is a default task."}
								required={true}
							/>

							<Button
								onClick={() => choiceDialogRef.current?.show()}
								type={"square"}
								usage={"other"}
								intent={"tertiary"}
								disabled={!project?.categories || project.categories.length <= 0}
								className={"justify-between"}
							>
								{selectedCategory ? selectedCategory.name : "Category"}
								<RightArrowIcon className={"w-[16px] h-[16px]"}/>
							</Button>
							
							<Toggle>
								<Toggle.Option id={"Finished"} />
								Is finished
							</Toggle>
						</Dialog.Column>

						<Dialog.Row>
							<Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"form"} intent={"secondary"}>
								<RemoveIcon className={"w-[16px] h-[16px]"}/>
								Cancel
							</Button>
							<Button className={"w-full justify-center"} type={"rounded"} usage={"form"} intent={"primary"}>
								<ConfirmIcon className={"w-[16px] h-[16px]"}/>
								Confirm
							</Button>
						</Dialog.Row>
					</Dialog.Form>
				</Dialog.Container>
			</Dialog.Modal>
			<ChoiceDialog
				dialog={choiceDialogRef}
				options={project?.categories.map(c => ({ id: c.id, name: c.name })) ?? []}

				onSelectOption={id => setSelectedCategory(project?.categories.find(c => c.id == id) ?? null)}
				onResetOption={() => setSelectedCategory(null)}
			/>
		</>
	)
}