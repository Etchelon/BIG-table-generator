export interface Player {
	id: string;
	team: string;
	ranking: number;
}

export interface Table {
	id: string;
	players: Player[];
}
