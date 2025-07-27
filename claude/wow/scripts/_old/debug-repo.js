import { GitHubAPI } from './lib/github-api.js';

try {
    const api = new GitHubAPI();
    console.log('Owner:', api.owner);
    console.log('Repo:', api.repo);
} catch (error) {
    console.error('Error:', error.message);
}