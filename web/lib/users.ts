import client from "@/apollo-client";
import {gql} from "@apollo/client";

export const GET_USER_QUERY = gql`
	query User($id: ID!) {
		user(user: $id) {
			id
			username
			email
		}
	}
`;

export const GET_PROJECT_INVITES_QUERY = gql`
	query ProjectInvites($id: ID!) {
		projectInvites(user: $id) {
			id
			name
			description
		}
	}
`;

export const GET_TEAM_INVITES_QUERY = gql`
	query TeamInvites($id: ID!) {
		teamInvites(user: $id) {
			id
			name
		}
	}
`;

export const PROJECT_INVITES_SUBSCRIPTION = gql`
	subscription ProjectInvitesSubscription($userId: ID!) {
		userProjectInvites(user: $userId) {
			type,
			projectInvite {
				id,
				name,
				description
			}
		}
	}
`;

export const TEAM_INVITES_SUBSCRIPTION = gql`
	subscription TeamInvitesSubscription($userId: ID!) {
		userTeamInvites(user: $userId) {
			type,
			teamInvite {
				id,
				name
			}
		}
	}
`;

export async function registerUser(
	username: string,
	email: string,
	password: string
) {
	return client.mutate({
		mutation: gql`
        mutation RegisterPasswordUser($username: String!, $email: String!, $password: String!) {
			registerPasswordUser(input: { username: $username, email: $email, password: $password }) {
				uuid
				errors {
					... on UserRegisterError {
						message
					}
				}
			}
		}
      `,
		variables: {
			username,
			email,
			password
		}
	});
}

export async function loginPasswordUser(
	email: string,
	password: string
) {
	return client.mutate({
		mutation: gql`
        mutation LoginPasswordUser($email: String!, $password: String!) {
			loginPasswordUser(input: { email: $email, password: $password }) {
				userLoginResult {
					jwt
				}
				errors {
					... on UserLoginError {
						message
					}
					... on ItemNotFoundError {
						message
					}
				}
			}
		}
      `,
		variables: {
			email,
			password
		}
	});
}

export async function removeUser(
	id: string,
) {
	await client.mutate({
		mutation: gql`
        mutation RemoveUser($id: ID!) {
			removeUser(input: {user: $id}) {
				result {
					success
				}
				errors {
					... on ItemNotFoundError {
						message
					}
				}
			}
		}
      `,
		variables: {
			id,
		}
	});
}