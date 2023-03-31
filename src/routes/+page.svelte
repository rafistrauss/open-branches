<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { version } from "../../package.json";

	import { getOpenBranches } from '$lib/util.js';

	let branchesByRepo;
	let tokenInputValue = '';
	let repoNamesInputValue = [''];
	let showingHelp = false;
	let helpSection = null;

	onMount(async () => {
		const githubToken = localStorage.getItem('githubToken');
		tokenInputValue = githubToken;
		const repoNamesString = localStorage.getItem('repoNames');
		const repoNames = JSON.parse(repoNamesString);
		repoNamesInputValue = repoNames ?? [];

		if (githubToken && repoNames?.length) {
			branchesByRepo = await getOpenBranches(githubToken, repoNames);
		}
	});
	async function handleSubmit() {
		const cleanedToken = tokenInputValue?.trim() ?? '';
		const cleanedRepoNames = repoNamesInputValue.map((name) => name.trim()).filter(Boolean);

		localStorage.setItem('githubToken', cleanedToken);
		localStorage.setItem('repoNames', JSON.stringify(cleanedRepoNames));
		dispatch('setupComplete');
		location.reload();
	}

	function addRepoName() {
		console.log("TCL ~ file: +page.svelte:36 ~ addRepoName ~ addRepoName:", repoNamesInputValue)
		repoNamesInputValue = [...repoNamesInputValue, ''];
	}

	/**
	 * @param {number} index
	 */
	function removeRepoName(index) {
		repoNamesInputValue = repoNamesInputValue.filter((_, i) => i !== index);
	}

	function showTokenHelp() {
		showingHelp = true;
		helpSection = 'token';
	}

	function showRepoNamesHelp() {
		showingHelp = true;
		helpSection = 'repoNames';
	}

	/**
	 * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} event
	 */
	function hideHelp(event) {
		showingHelp = false;
	}
</script>


<svelte:head>
	<title>v{version}</title>
</svelte:head>


<main>
	<h1>Open Branches</h1>

	<section>
		<details>
			<summary style="cursor: pointer;"> Setup </summary>
			<form on:submit|preventDefault={handleSubmit}>
				<label>
					GitHub Token:
					<input type="text" bind:value={tokenInputValue} />
					<button type="button" on:click={showTokenHelp}>?</button>
				</label>
				<br />
				<label>
					Repo Names:
					{#if repoNamesInputValue?.length}
						 <!-- content here -->
						{#each repoNamesInputValue as name, i}
						<div>
							<input type="text" bind:value={repoNamesInputValue[i]} />
							<button type="button" on:click={() => removeRepoName(i)}>Remove</button>
						</div>
						{/each}
					{/if}
					<div>
						<button type="button" on:click={addRepoName}>Add Repo</button>
						<button type="button" on:click={showRepoNamesHelp}>?</button>
					</div>
				</label>
				<button type="submit">Save</button>
			</form>
		</details>
	</section>
	{#if branchesByRepo}
		{#each Object.entries(branchesByRepo) as [repoName, branches]}
			<section>
				<h2>
					<a href={`https://www.github.com/${repoName}/branches`}>
						{repoName} 
					</a> ({branches.length} open branches)
				</h2>
				<ul>
					{#each branches as branch}
						<li>{branch}</li>
					{/each}
				</ul>
			</section>
		{/each}
		<!-- {:else}
		<p>Loading...</p> -->
	{/if}
</main>

{#if showingHelp}
	<!-- content here -->
	<div class="help">
		{#if helpSection === 'token'}
			<h2>GitHub API Token</h2>
			<p>
				To use this app, you'll need to generate a personal access token in your GitHub account
				settings. Here's how:
			</p>
			<ol>
				<li>Go to your GitHub settings</li>
				<li>Click on "Developer settings"</li>
				<li>Click on "Personal access tokens"</li>
				<li>Click "Generate new token"</li>
				<li>Give the token a name and select the appropriate scopes</li>
				<li>Click "Generate token"</li>
				<li>Copy the token and paste it into the "GitHub Token" field above</li>
			</ol>
		{:else}
			<h2>Repo Names</h2>
			<p>
				To use this app, you'll need to enter the names of the repositories you want to check for
				open branches. Here's how to format them:
			</p>
			<ul>
				<li>
					Each name should be the full name of the repository, in the format "username/repo-name"
				</li>
				<li>Here's an example: <code>facebook/react</code></li>
			</ul>
		{/if}
		<button type="button" on:click={hideHelp}>Close</button>
	</div>
{/if}
