import { context }  from "@actions/github";
import * as core from "@actions/core";

import isValidCommitMessage from "./isValidCommitMessage";
import extractCommits from "./extractCommits";

async function run() {
    core.info(
        `âšī¸ Checking if commit messages are following the Conventional Commits specification...`
    );

    const extractedCommits = await extractCommits(context);
    if (extractedCommits.length === 0) {
        core.info(`No commits to check, skipping...`);
        return;
    }

    let hasErrors;
    core.startGroup("Commit messages:");
    for (let i = 0; i < extractedCommits.length; i++) {
        let commit = extractedCommits[i];
        if (isValidCommitMessage(commit.message)) {
            core.info(`â ${commit.message}`);
        } else {
            core.info(`đŠ ${commit.message}`);
            hasErrors = true;
        }
    }
    core.endGroup();

    if (hasErrors) {
        core.setFailed(
            `đĢ According to the conventional-commits specification, some of the commit messages are not valid.`
        );
    } else {
        core.info("đ All commit messages are following the Conventional Commits specification.");
    }
}

run();
