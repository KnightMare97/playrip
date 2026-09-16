/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Dispatches a music acquisition job to GitHub Actions repository_dispatch
 * Repository: KnightMare97/playrip
 */
export async function triggerGitHubActionsJob(jobId?: string): Promise<{ success: boolean; message: string }> {
  const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'KnightMare97/playrip';
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || localStorage.getItem('playrip_gh_token') || '';

  if (!GITHUB_TOKEN) {
    return {
      success: false,
      message: 'GitHub token not configured. Set VITE_GITHUB_TOKEN or add in Settings.',
    };
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PlayRip-Music-App',
      },
      body: JSON.stringify({
        event_type: 'process_music_job',
        client_payload: {
          job_id: jobId || `job_${Date.now()}`,
          triggered_at: new Date().toISOString(),
        },
      }),
    });

    if (response.status === 204 || response.ok) {
      return {
        success: true,
        message: 'Successfully triggered GitHub Actions runner!',
      };
    } else {
      const errText = await response.text();
      return {
        success: false,
        message: `GitHub API returned ${response.status}: ${errText}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown network error triggering GitHub Action',
    };
  }
}
