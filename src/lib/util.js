/**
 * Retrieves a list of open branches for each specified repository.
 * @param {string} githubToken - A GitHub personal access token with read access to the repositories.
 * @param {string[]} repoNames - An array of repository names in the format `owner/repo`.
 * @returns {Promise<{ [repoName: string]: string[] }>} - An object mapping repository names to arrays of open branch names.
 */
export async function getOpenBranches(githubToken, repoNames) {
	const headers = {
		Authorization: `Bearer ${githubToken}`,
		Accept: 'application/vnd.github.v3+json'
	};

	const openBranches = {};

	for (const repoName of repoNames) {
		const url = `https://api.github.com/repos/${repoName}/branches`;
		const response = await fetch(url, { headers });

		if (!response.ok) {
			console.error(
				`Failed to fetch branches for ${repoName}: ${response.status} ${response.statusText}`
			);
			continue;
		}

		const branches = await response.json();
		const openBranchNames = branches
			.filter((branch) => branch.protected === false)
			.map((branch) => branch.name);
		openBranches[repoName] = openBranchNames;
	}

    console.log(openBranches);

	return openBranches;
}
