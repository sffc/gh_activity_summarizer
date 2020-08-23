GitHub Activity Summarizer
==========================

This tool exports your GitHub activity to a Markdown file.  It is intended to help build reports to your team about what you've been up to.

## Usage

Install the dependencies

```bash
$ npm install
```

Create a `.env` file with a GitHub access token (create one [here](https://github.com/settings/tokens)):

```
GH_ACCESS_TOKEN=xxxxxxxx
```

Run like this to export activity for user sffc from now back through 2020-08-15:

```bash
$ node index.js -u sffc -s 2020-08-15Z
```
