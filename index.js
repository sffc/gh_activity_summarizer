const commandLineArgs = require("command-line-args");
const { summarize } = require("./src/summarize");

require("dotenv").config();

async function main(username, startDate) {
	const activityByRepo = await summarize(username, startDate);
	for (const [repo, activityByType] of Object.entries(activityByRepo)) {
		console.log(`### ${repo}`);
		console.log();
		for (let [id, activities] of Object.entries(activityByType)) {
			// When does `id` get converted to a string?
			if (id === "null") {
				continue;
			}
			console.log(`- ${id}`);
			for (const activity of activities) {
				console.log(`    - ${activity}`);
			}
			console.log();
		}
		if (activityByType[null]) {
			console.log(`- Other Activity:`);
			for (const activity of activityByType[null]) {
				console.log(`    - ${activity}`);
			}
			console.log();
		}
		console.log();
	}
}

const optionDefinitions = [
  { name: "username", alias: "u", type: String },
  { name: "startDate", alias: "s", type: String, defaultValue: new Date() }
];

const options = commandLineArgs(optionDefinitions);

if (!options.username) {
	console.error("Error: Please provide \"-u username\"");
	process.exit(1);
}

console.error(options)

main(options.username, new Date(options.startDate));
