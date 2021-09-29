import { each } from "lodash";
import { generatePlayers, generateTeams, rankPlayers } from "./generation";
import { getPlayersWithoutTable, makeTables } from "./tables";
import { runIfDevelopment } from "./utils";

const N_TEAMS = 6;
const TABLE_SIZE = 4;

const teams = generateTeams(N_TEAMS);
const players = rankPlayers(generatePlayers(teams));
const tables = makeTables(players, TABLE_SIZE);

runIfDevelopment(() => {
	each(tables, t => {
		console.log(t.id);
		each(t.players, p =>
			console.log(`${p.id} (${p.team}) - ranking: ${p.ranking}`)
		);
	});
});

const playersWithoutTable = getPlayersWithoutTable(players, tables);

runIfDevelopment(() => {
	console.log({ playersWithoutTable });
});
