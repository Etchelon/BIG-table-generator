import { chain, flatMap, range, uniqueId } from "lodash";
import { MAX_N_PLAYERS_PER_TEAM } from "./constants";
import { Player } from "./types";

function getNPlayersPerTeam(maxNPlayersPerTeam: number, fixed = true): number {
	return fixed
		? maxNPlayersPerTeam
		: maxNPlayersPerTeam - (Math.random() > 0.8 ? 1 : 0);
}

export function generateTeams(nTeams: number): string[] {
	return chain(range(0, nTeams))
		.map(n => `Team ${n + 1}`)
		.value();
}

export function generatePlayers(
	teams: string[],
	nPlayersPerTeam = MAX_N_PLAYERS_PER_TEAM
): Player[] {
	const nPlayersInTeam = getNPlayersPerTeam(nPlayersPerTeam);
	return flatMap(teams, team => {
		return range(0, nPlayersInTeam).map<Player>(_ => ({
			id: uniqueId("Player_"),
			team,
			ranking: 0,
		}));
	});
}

export function rankPlayers(players: Player[]): Player[] {
	return chain(players)
		.shuffle()
		.each((p, index) => (p.ranking = index + 1))
		.value();
}
