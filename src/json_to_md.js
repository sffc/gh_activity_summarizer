function getDateStr(json) {
	return new Date(json.created_at).toLocaleString("en", {
		timeZone: "America/Los_Angeles",
		month: "short",
		day: "numeric",
		year: "numeric",
		weekday: "short",
	});
}

function issueToStr(json) {
	return `Issue [#${json.payload.issue.number}](${json.payload.issue.html_url}): "${json.payload.issue.title}"`;
}

function prToStr(json) {
	return `PR [#${json.payload.pull_request.number}](${json.payload.pull_request.url}) by ${json.payload.pull_request.user.login}: "${json.payload.pull_request.title}"`
}

function prStatsToStr(json) {
	return `${json.payload.pull_request.commits} commits, ${json.payload.pull_request.additions} additions, ${json.payload.pull_request.deletions} deletions, ${json.payload.pull_request.changed_files} changed files`;
}

function IssuesEvent(json) {
	return {
		id: issueToStr(json),
		items: [`${json.payload.action} - ${getDateStr(json)}`],
	};
}

function IssueCommentEvent(json) {
	return {
		id: issueToStr(json),
		items: [`${json.payload.action} a ${json.payload.comment.body.length}-character comment - ${getDateStr(json)}`],
	};
}

function PushEvent(json) {
	const items = [];
	for (const commit of json.payload.commits) {
		const branch = /^refs\/heads\/(.*)$/.exec(json.payload.ref)[1];
		const messageFirstLine = commit.message.split("\n")[0];
		items.push(`pushed commit to branch "${branch}": "${messageFirstLine}" (${commit.author.email}) - ${getDateStr(json)}`);
	}
	return {
		id: null,
		items,
	};
}

function PullRequestEvent(json) {
	const action = (json.payload.pull_request.merged) ? "merged" : json.payload.action;
	return {
		id: prToStr(json),
		items: [`${action}: ${prStatsToStr(json)} - ${getDateStr(json)}`],
	};
}

// These events are duplicated in the activity stream
const seenReviewEvents = new Set();
function PullRequestReviewEvent(json) {
	if (seenReviewEvents.has(json.payload.review.id)) {
		return null;
	}
	seenReviewEvents.add(json.payload.review.id);
	return {
		id: prToStr(json),
		items: [`${json.payload.action} review (${json.payload.review.state}) - ${getDateStr(json)}`],
	};
}

function PullRequestReviewCommentEvent(json) {
	// Too much detail; ignore
	return null;
}

function CommitCommentEvent(json) {
	// Too much detail; ignore
	return null;
}

function CreateEvent(json) {
	return {
		id: null,
		items: [`created branch ${json.payload.ref} - ${getDateStr(json)}`],
	};
}

function DeleteEvent(json) {
	return {
		id: null,
		items: [`deleted branch ${json.payload.ref} - ${getDateStr(json)}`],
	};
}

function MemberEvent(json) {
	return {
		id: null,
		items: [`${json.payload.action} ${json.payload.member.login}`],
	};
}

module.exports = {
	IssuesEvent,
	IssueCommentEvent,
	PushEvent,
	PullRequestEvent,
	PullRequestReviewEvent,
	PullRequestReviewCommentEvent,
	CommitCommentEvent,
	CreateEvent,
	DeleteEvent,
	MemberEvent,
}
