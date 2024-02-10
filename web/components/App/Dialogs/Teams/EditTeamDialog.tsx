import Dialog, {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import {FormEvent, RefObject} from "react";
import {Team} from "@/lib/types";
import Title from "@/components/Text/Title";
import Description from "@/components/Text/Description";
import InputField from "@/components/Input/InputField";
import Button from "@/components/Input/Button";
import RemoveIcon from "@/components/Icons/RemoveIcon";
import ConfirmIcon from "@/components/Icons/ConfirmIcon";
import {editTeam} from "@/lib/teams";

type EditTeamDialogProps = {
	dialog: RefObject<DialogModalHandle>,
	team: Team | undefined

	onUpdate: () => void,
}

export default function EditTeamDialog({ dialog, team, onUpdate } : EditTeamDialogProps) {
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!team)
			return;

		const data = {
			name: String(event.currentTarget.Name.value)
		};

		dialog.current?.hide();
		event.currentTarget?.reset();

		await editTeam(team.id, data.name);
		onUpdate();
	}

	return (
		<Dialog.Modal ref={dialog}>
			<Dialog.Container>
				<Dialog.Column>
					<Title context={"dialog"}>
						Edit team
					</Title>

					<Description>
						Change the properties of a team to better match your idea of the team.
					</Description>
				</Dialog.Column>

				<Dialog.Form onSubmit={submit}>
					<Dialog.Column>
						<InputField
							focus
							type={"form"}
							title={"Name"}
							placeholder={"Default team"}
							value={team?.name}
							maximum={20}
							required
						/>
					</Dialog.Column>

					<Dialog.Row>
						<Button onClick={() => dialog.current?.hide()} type={"rounded"} usage={"other"} intent={"secondary"}>
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
	);
}