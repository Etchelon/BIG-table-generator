const isDevelopment = process.argv.includes("--dev");

export function runIfDevelopment(fn: (...args: any[]) => any): void {
	isDevelopment && fn();
}
