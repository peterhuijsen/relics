"use client";

import AppHeader from "@/components/App/AppHeader";
import Button from "@/components/Input/Button";
import UserIcon from "@/components/Icons/UserIcon";
import SignOutIcon from "@/components/Icons/SignOutIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import {deleteCookie} from "cookies-next";
import {removeUser} from "@/lib/users";
import {useUser} from "@/lib/hooks";
import {useRouter} from "next/navigation";
import RightArrowIcon from "@/components/Icons/RightArrowIcon";

export default function User() {
	const { user } = useUser();
	const { push } = useRouter();

	async function signOut() {
		deleteCookie("token");
		push("/");
	}

	async function deleteUser() {
		const id = user!.id;

		await removeUser(id);
		push("/");

		await signOut();
	}

	return (
		<div className={"flex flex-col w-full h-fit gap-[36px] py-gutter"}>
			<AppHeader
				title={"User profile"}
				description={`Manage the different properties of your account.`}
				icon={<UserIcon />}
			/>

			<div className={"flex flex-col gap-[12px] px-gutter"}>
				<h3>
					Settings
				</h3>
				<Button onClick={async () => push(`/app/user/${user?.id}`)} className={"items-center justify-between"} type={"square"} usage={"form"} intent={"tertiary"}>
					<div className={"flex flex-row items-center gap-[8px] md:gap-[12px]"}>
						<UserIcon className={"small-icon"}/>
						Personal information
					</div>
					<RightArrowIcon className={"small-icon"}/>
				</Button>
			</div>

			<div className={"flex flex-col gap-[12px] px-gutter"}>
				<h3>
					Account
				</h3>
				<Button onClick={() => signOut()} type={"square"} usage={"form"} intent={"warn"}>
					<SignOutIcon className={"small-icon"}/>
				</Button>
				<Button onClick={() => deleteUser()} type={"square"} usage={"form"} intent={"warn"}>
					<DeleteIcon className={"small-icon"}/>
				</Button>
			</div>
		</div>
	);
}