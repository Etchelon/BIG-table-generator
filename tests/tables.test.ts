import { chain, each, filter, flatMap } from "lodash";
import { generatePlayers, generateTeams } from "../src/generation";
import { getPlayersWithoutTable, makeTables } from "../src/tables";
import {
	allPlayersAreSorted,
	noTablesWithMoreThan1PlayerPerTeam,
} from "./helpers";

describe("N Teams ranked in order", () => {
	each([4, 5, 6, 7, 8], nTeams => {
		const TEAM_SIZE = 4;
		const TABLE_SIZE = 4;

		test(`${nTeams} teams`, () => {
			const teams = generateTeams(nTeams);
			const allPlayers = generatePlayers(teams);
			const players = flatMap(teams, (team, teamNumber) => {
				const teamPlayers = chain(allPlayers)
					.filter(p => p.team === team)
					.each(
						(p, n) => (p.ranking = teamNumber * TEAM_SIZE + (n + 1))
					)
					.value();
				return teamPlayers;
			});
			const tables = makeTables(players, TABLE_SIZE);
			each(tables, t => {
				let log = `\n${t.id}`;
				each(
					t.players,
					p =>
						(log += `\n\t${p.id} (${p.team}) - ranking: ${p.ranking}`)
				);
				console.log(log);
			});

			console.log(
				"With table size equal to team size, we must have as many tables as there are teams"
			);
			expect(tables.length).toBe(teams.length);

			console.log("Each table has only 1 player per team");
			expect(noTablesWithMoreThan1PlayerPerTeam(tables)).toBe(true);

			console.log(
				"Players of each team are placed in tables in order according to their rankings"
			);
			expect(allPlayersAreSorted(tables)).toBe(true);

			const tablesWithNotExactly4Players = filter(
				tables,
				t => t.players.length !== 4
			);
			expect(tablesWithNotExactly4Players).toHaveLength(0);

			const playersWithoutTable = getPlayersWithoutTable(players, tables);
			expect(playersWithoutTable).toHaveLength(0);
		});
	});
});
