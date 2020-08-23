const { Octokit } = require("@octokit/rest");
const json_to_md = require("./json_to_md");

async function getActivity(username, oldestDate) {
	const octokit = process.env.GH_ACCESS_TOKEN ? new Octokit({
		auth: process.env.GH_ACCESS_TOKEN
	}) : new Octokit();
	const activity = [];
	let page = 1;
	do {
		console.error(`Fetching page ${page}`);
		try {
			const response = await octokit.activity.listEventsForAuthenticatedUser({
			  username,
			  page: page++,
			  per_page: 100,
			});
			activity.push(...response.data);
		} catch (err) {
			if (err.message.indexOf("pagination is limited for this resource") !== -1) {
				console.error("Warning: Reached pagination limit of data");
				break;
			} else {
				throw err;
			}
		}
	} while (oldestDate < new Date(activity[activity.length-1].created_at));
	return activity;
}

async function summarize(username, oldestDate) {
	const activity = await getActivity(username, oldestDate);

	const activityByRepo = {};
	for (let entry of activity) {
		if (json_to_md[entry.type]) {
			const items = json_to_md[entry.type](entry);
			if (!activityByRepo[entry.repo.name]) {
				activityByRepo[entry.repo.name] = [];
			}
			activityByRepo[entry.repo.name].push(...items);
		} else {
			console.error("Warning: Unknown type:", entry.type, entry);
		}
	}

	return activityByRepo;
}

module.exports = { summarize };
