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
	return `"${json.payload.issue.title}" ([#${json.payload.issue.number}](${json.payload.issue.url}))`;
}

function prToStr(json) {
	return `"${json.payload.pull_request.title}" ([#${json.payload.pull_request.number}](${json.payload.pull_request.url}))`
}

function prStatsToStr(json) {
	return `${json.payload.pull_request.commits} commits, ${json.payload.pull_request.additions} additions, ${json.payload.pull_request.deletions} deletions, ${json.payload.pull_request.changed_files} changed files`;
}

function IssuesEvent(json) {
	return [`${json.payload.action} issue ${issueToStr(json)} - ${getDateStr(json)}`];
}

function IssueCommentEvent(json) {
	return [`${json.payload.action} a ${json.payload.comment.body.length}-character comment on ${issueToStr(json)} - ${getDateStr(json)}`]
}

function PushEvent(json) {
	const retval = [];
	for (const commit of json.payload.commits) {
		const branch = /^refs\/heads\/(.*)$/.exec(json.payload.ref)[1];
		const messageFirstLine = commit.message.split("\n")[0];
		retval.push(`pushed commit to branch "${branch}": "${messageFirstLine}" (${commit.author.email}) - ${getDateStr(json)}`)
	}
	return retval;
}

function PullRequestEvent(json) {
	const action = (json.payload.pull_request.merged) ? "merged" : json.payload.action;
	return [`${action} ${json.payload.pull_request.user.login}'s PR ${prToStr(json)} (${prStatsToStr(json)}) - ${getDateStr(json)}`];
}

// These events are duplicated in the activity stream
const seenReviewEvents = new Set();
function PullRequestReviewEvent(json) {
	if (seenReviewEvents.has(json.payload.review.id)) {
		return [];
	}
	seenReviewEvents.add(json.payload.review.id);
	return [`${json.payload.action} review (${json.payload.review.state}) for ${json.payload.pull_request.user.login}'s PR ${prToStr(json)} - ${getDateStr(json)}`];
}

function PullRequestReviewCommentEvent(json) {
	// Too much detail; ignore
	return [];
}

function CreateEvent(json) {
	return [`created branch ${json.payload.ref} - ${getDateStr(json)}`];
}

function DeleteEvent(json) {
	return [`deleted branch ${json.payload.ref} - ${getDateStr(json)}`];
}

function MemberEvent(json) {
	return [`${json.payload.action} ${json.payload.member.login}`]
}

module.exports = {
	IssuesEvent,
	IssueCommentEvent,
	PushEvent,
	PullRequestEvent,
	PullRequestReviewEvent,
	PullRequestReviewCommentEvent,
	CreateEvent,
	DeleteEvent,
	MemberEvent,
}
