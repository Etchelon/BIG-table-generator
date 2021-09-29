import {
	chain,
	every,
	filter,
	flatMap,
	groupBy,
	isEqual,
	map,
	some,
	sortBy,
} from "lodash";
import { Table } from "../src/types";

export function noTablesWithMoreThan1PlayerPerTeam(tables: Table[]) {
	const tablesWithMoreThan1PlayerPerTeam = filter(tables, t => {
		const byTeam = groupBy(t.players, p => p.team);
		return some(byTeam, players => players.length > 1);
	});
	return tablesWithMoreThan1PlayerPerTeam.length === 0;
}

export function allPlayersAreSorted(tables: Table[]) {
	const teams = chain(tables)
		.flatMap(t => map(t.players, p => p.team))
		.uniq()
		.value();
	return every(teams, team => {
		const teamPlayers = flatMap(tables, t =>
			filter(t.players, p => p.team === team)
		);
		const rankings = map(teamPlayers, p => p.ranking);
		return isEqual(rankings, sortBy(rankings));
	});
}
