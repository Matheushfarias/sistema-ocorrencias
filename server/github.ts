import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function getGitHubUser() {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.users.getAuthenticated();
  return data;
}

export async function listRepositories() {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100
  });
  return data;
}

export async function createRepository(name: string, description?: string, isPrivate: boolean = false) {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name,
    description: description || '',
    private: isPrivate,
    auto_init: false
  });
  return data;
}

export async function pushToRepository(owner: string, repo: string, files: { path: string; content: string }[], message: string, branch: string = 'main') {
  const octokit = await getUncachableGitHubClient();
  
  let isEmptyRepo = false;
  
  try {
    await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`
    });
  } catch (error: any) {
    if (error.status === 404 || error.status === 409) {
      isEmptyRepo = true;
    } else {
      throw error;
    }
  }

  if (isEmptyRepo) {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'README.md',
      message: 'Initial commit',
      content: Buffer.from('# ' + repo + '\n\nSistema de Ocorrências').toString('base64'),
      branch
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`
  });
  const latestCommitSha = refData.object.sha;

  const { data: latestCommit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha
  });
  const baseTreeSha = latestCommit.tree.sha;

  const blobs = await Promise.all(
    files.map(async (file) => {
      const { data } = await octokit.git.createBlob({
        owner,
        repo,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64'
      });
      return { path: file.path, sha: data.sha, mode: '100644' as const, type: 'blob' as const };
    })
  );

  const { data: treeData } = await octokit.git.createTree({
    owner,
    repo,
    tree: blobs,
    base_tree: baseTreeSha
  });

  const { data: commitData } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: treeData.sha,
    parents: [latestCommitSha]
  });

  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commitData.sha
  });

  return commitData;
}
