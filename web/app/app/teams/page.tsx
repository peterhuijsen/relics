"use client";

import LoadScreen from "@/components/Login/LoadScreen";
import AppHeader from "@/components/App/AppHeader";
import React, {useEffect, useRef, useState} from "react";
import TeamIcon from "@/components/Icons/TeamIcon";
import {useUser} from "@/lib/hooks";
import {Team, TeamInvite} from "@/lib/types";
import {ReceivedInviteItem} from "@/components/App/Items/InviteItem";
import Button from "@/components/Input/Button";
import AddIcon from "@/components/Icons/AddIcon";
import {DialogModalHandle} from "@/components/Input/Modals/Dialog";
import CreateTeamDialog from "@/components/App/Dialogs/Teams/CreateTeamDialog";
import {acceptTeamInvite, declineTeamInvite} from "@/lib/teams";
import TeamItem from "@/components/App/Items/TeamItem";
import ConfirmationDialog, {ConfirmationDialogHandle} from "@/components/App/Dialogs/ConfirmationDialog";
import {useTeamInvitesQuery, useTeamsQuery} from "@/hooks/queryHooks";
import {updateNotificationEvent, useTeamInvitesSubscription, useTeamsSubscription} from "@/hooks/subscriptionHooks";

export default function Teams() {
	const [teams, setTeams] = useState<Team[]>([]);
	const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);

	const confirmationDialogRef = useRef<ConfirmationDialogHandle>(null);
	const createDialogRef = useRef<DialogModalHandle>(null);

	const { user } = useUser();

	const { data: userTeams } = useTeamsSubscription(user);
	const { data: userTeamInvites } = useTeamInvitesSubscription(user);

	const { data: getTeams, loading: getTeamsLoading } = useTeamsQuery(user);
	const { data: getTeamInvites, loading: getTeamInvitesLoading } = useTeamInvitesQuery(user);

	async function acceptTeam(team: TeamInvite) {
		if (!user || !team)
			return;

		await acceptTeamInvite(team.id, user?.id);
	}

	async function declineTeam(team: TeamInvite) {
		if (!user || !team)
			return;

		await declineTeamInvite(team.id, user.id);
	}

	useEffect(() => updateNotificationEvent(
		userTeams?.userTeams.type,
		userTeams?.userTeams.team,
		setTeams
	), [userTeams]);

	useEffect(() => updateNotificationEvent(
		userTeamInvites?.userTeamInvites.type,
		userTeamInvites?.userTeamInvites.teamInvite,
		setTeamInvites
	), [userTeamInvites]);

	useEffect(() => {
		const data = getTeams?.teams;
		if (!data) return;

		setTeams(data);
	}, [getTeams]);

	useEffect(() => {
		const data = getTeamInvites?.teamInvites;
		if (!data) return;

		setTeamInvites(data);
	}, [getTeamInvites]);

	return (
		<>
			<LoadScreen isShown={getTeamsLoading || getTeamInvitesLoading} />
			<div className={"flex flex-col w-full h-fit gap-[36px] py-gutter"}>
				<div className={"flex flex-col gap-[12px] md:gap-[24px]"}>
					<AppHeader
						title={"Teams"}
						description={`Manage the invites you have to other projects and teams.`}
						icon={<TeamIcon />}
					/>

					<div className={"flex flex-row px-gutter"}>
						<Button onClick={() => createDialogRef.current?.show()} type={"rounded"} usage={"form"}
								intent={"primary"}>
							<AddIcon className={"small-icon"}/>
							Create team
						</Button>
					</div>
				</div>

				<div className={"flex flex-col gap-[12px]"}>
					<h3 className={"px-gutter"}>
						Teams
					</h3>

					<div className={"flex flex-col gap-[12px] h-full px-gutter"}>
						{teams.length > 0
							? teams.map((team: Team) => (
								<TeamItem team={team} />
							)) : (
								<p>
									You aren't in any teams yet.
								</p>
							)
						}
					</div>
				</div>

				<div className={"flex flex-col gap-[12px]"}>
					<h3 className={"px-gutter"}>
						Invites
					</h3>

					<div className={"flex flex-col gap-[12px] h-full px-gutter"}>
						{teamInvites.length > 0
							? teamInvites.map((i: TeamInvite) => (
								<ReceivedInviteItem
									key={i.id}
									onAccept={() => acceptTeam(i)}
									onDecline={() => declineTeam(i)}

									content={
										<>
											<div>
												<TeamIcon className={"w-[24px] h-[24px] text-zinc-200"}/>
											</div>
											<div className={"flex flex-col flex-grow text-left"}>
												<h4>
													{i.name}
												</h4>
											</div>
										</>
									}
								/>
							)) : (
								<p>
									You haven't received any invites to other teams yet.
								</p>
							)
						}
					</div>
				</div>
			</div>

			<ConfirmationDialog ref={confirmationDialogRef}/>

			<CreateTeamDialog
				dialog={createDialogRef}
				user={user}
			/>
		</>
	);
}