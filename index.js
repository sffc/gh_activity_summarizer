const commandLineArgs = require("command-line-args");
const { summarize } = require("./src/summarize");

require("dotenv").config();

async function main(username, startDate) {
	const activityByRepo = await summarize(username, startDate);
	for (const [repo, activities] of Object.entries(activityByRepo)) {
		console.log(`### ${repo}`);
		console.log();
  	for (const activity of activities) {
  		console.log(`- ${activity}`);
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
