import {Project, Task} from "@/lib/types";
import TaskIcon from "@/components/Icons/TaskIcon";
import Header from "@/components/Text/Header";
import MoreIcon from "@/components/Icons/MoreIcon";
import Description from "@/components/Text/Description";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditIcon from "@/components/Icons/EditIcon";
import React, {RefObject, useCallback, useRef, useState} from "react";
import {removeProject} from "@/lib/projects";
import ProjectIcon from "@/components/Icons/ProjectIcon";
import Popover, {PopoverModalHandle} from "@/components/Input/Modals/Popover";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import EditProjectDialog from "@/components/App/Dialogs/EditProjectDialog";
import {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {useUser} from "@/lib/hooks";

type ProjectItemProps = {
	project: Project,
	confirmationDialog?: RefObject<ConfirmationDialogHandle>,
	className?: string,
	editable?: boolean,

	onClick?: () => void,
	onChange?: () => void
}

export default function ProjectItem({ project, confirmationDialog, className, editable = true, onClick, onChange } : ProjectItemProps) {
	const popoverRef = useRef<PopoverModalHandle>(null);
	
	const editDialogRef = useRef<DialogModalHandle>(null);
	
	const { user } = useUser();
	const isOwner = useCallback(() => project.owner.userId == user?.id, [project, user])

	async function deleteProject() {
		confirmationDialog?.current?.show(
			"Remove project",
			"Are you sure you want to remove the given project indefinitely?",
			async () => {
				await removeProject(project.id)
				if (onChange) await onChange()
			}
		)
	}

	return (
		<>
			<div className={`flex flex-row items-center gap-[12px] bg-zinc-700 rounded-xl ${className}`}>
				<button onClick={onClick} className={"flex flex-row p-[16px] flex-grow items-center gap-[12px] rounded-xl focus:outline-none focus:ring-2 focus:ring-main-500"}>
					<div>
						<ProjectIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
					</div>
					<div className={"flex flex-col flex-grow text-left"}>
						<Header>
							{project.name}
						</Header>
						<Description>
							{project.description}
						</Description>
					</div>
				</button>
	
				{editable && (
					<Popover>
						<button className={"mr-[16px] focus:outline-none focus:rounded-md focus:ring-2 focus:ring-main-500"} onClick={() => popoverRef.current?.toggle()}>
							<MoreIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
						</button>
						<Popover.Modal ref={popoverRef}>
							<Popover.Container>
								{isOwner() && (
									<Popover.Button focus onClick={async () => await deleteProject()}>
										<Header>
											Remove
										</Header>
										<DeleteIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
									</Popover.Button>
								)}
	
								<Popover.Button onClick={() => editDialogRef.current?.show()}>
									<Header>
										Edit
									</Header>
									<EditIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
								</Popover.Button>
							</Popover.Container>
						</Popover.Modal>
					</Popover>
					)}
			</div>
		
			<EditProjectDialog
				dialog={editDialogRef}
				project={project}
				
				onUpdate={() => onChange && onChange()}
			/>
		</>
	)
}