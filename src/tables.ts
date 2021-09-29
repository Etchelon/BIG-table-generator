import {
	chain,
	each,
	filter,
	find,
	includes,
	keys,
	range,
	reject,
} from "lodash";
import { Player, Table } from "./types";
import { runIfDevelopment } from "./utils";

export function makeTables(players: Player[], tableSize: number): Table[] {
	const nTables = Math.ceil(players.length / tableSize);
	const byTeam = chain(players)
		.sortBy(p => p.ranking)
		.groupBy(p => p.team)
		.value();

	runIfDevelopment(() => {
		each(byTeam, (players, team) => {
			console.log(team, { players });
		});
	});

	const playersWithTable: string[] = [];

	const teams = keys(byTeam);

	return range(0, nTables).map(n => {
		const tableNumber = n + 1;
		const nTablesAfterThis = nTables - tableNumber;
		const teamsWithPriority = filter(teams, t => {
			const teamPlayers = byTeam[t];
			const nPlayersWithNoTable = filter(
				teamPlayers,
				p => !includes(playersWithTable, p.id)
			).length;
			return nPlayersWithNoTable > nTablesAfterThis;
		});

		runIfDevelopment(() => {
			console.log(
				`Making table n. ${tableNumber}, tables after this: ${nTablesAfterThis}, teams with priority: ${teamsWithPriority.join(
					", "
				)}`
			);
		});

		const topPlayersFromDifferentTeams = chain(byTeam)
			.map(players =>
				find(players, p => !includes(playersWithTable, p.id))
			)
			.compact()
			.orderBy(
				[
					p => {
						const hasPriority = includes(teamsWithPriority, p.team);
						return hasPriority;
					},
					p => p.ranking,
				],
				["desc", "asc"]
			)
			.take(tableSize)
			.each(player => playersWithTable.push(player.id))
			.value();

		return {
			id: `Table ${tableNumber}`,
			players: topPlayersFromDifferentTeams,
		};
	});
}

export function getPlayersWithoutTable(
	allPlayers: Player[],
	tables: Table[]
): Player[] {
	const playersFromTables = chain(tables)
		.flatMap(t => t.players)
		.map(p => p.id)
		.value();
	const playersWithoutTable = reject(allPlayers, p =>
		includes(playersFromTables, p.id)
	);

	return playersWithoutTable;
}
