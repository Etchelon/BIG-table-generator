import _, {
	chain,
	each,
	find,
	flatMap,
	includes,
	range,
	reject,
	uniqueId,
} from "lodash";

interface Player {
	id: string;
	team: string;
	ranking: number;
}

interface Table {
	id: string;
	players: Player[];
}

const N_TEAMS = 6;
const MAX_N_PLAYERS_PER_TEAM = 4;
const MAX_N_PLAYERS_PER_TABLE = 4;

function getNPlayersPerTeam(maxNPlayersPerTeam: number, fixed = true): number {
	return fixed
		? maxNPlayersPerTeam
		: maxNPlayersPerTeam - (Math.random() > 0.8 ? 1 : 0);
}

function generateTeams(nTeams: number): string[] {
	return chain(range(0, nTeams))
		.map(n => `Team ${n + 1}`)
		.value();
}

function generatePlayers(
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

function rankPlayers(players: Player[]): Player[] {
	return chain(players)
		.shuffle()
		.each((p, index) => (p.ranking = index + 1))
		.value();
}

function makeTables(nTables: number, players: Player[]): Table[] {
	const byTeam = chain(players)
		.sortBy(p => p.ranking)
		.groupBy(p => p.team)
		.value();

	each(byTeam, (players, team) => {
		console.log(team, { players });
	});

	const playersWithTable: string[] = [];

	return range(0, nTables).map(n => {
		const topPlayersFromDifferentTeams = chain(byTeam)
			.map(players =>
				find(players, p => !includes(playersWithTable, p.id))
			)
			.compact()
			.sortBy(p => p.ranking)
			.take(MAX_N_PLAYERS_PER_TABLE)
			.each(player => playersWithTable.push(player.id))
			.value();
		return {
			id: `Table ${n + 1}`,
			players: topPlayersFromDifferentTeams,
		};
	});
}

const teams = generateTeams(N_TEAMS);
const players = rankPlayers(generatePlayers(teams));

const nTables = Math.ceil(players.length / MAX_N_PLAYERS_PER_TABLE);
const tables = makeTables(nTables, players);

each(tables, t => {
	console.log(t.id);
	each(t.players, p =>
		console.log(`${p.id} (${p.team}) - ranking: ${p.ranking}`)
	);
});

const playersFromTables = chain(tables)
	.flatMap(t => t.players)
	.map(p => p.id)
	.value();
const playersWithoutTable = reject(players, p =>
	includes(playersFromTables, p.id)
);
console.log({ playersWithoutTable });
