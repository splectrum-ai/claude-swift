#!/usr/bin/env node

/**
 * GitHub Releases API - Release management operations
 * 
 * Implements release-related operations to replace GitHub CLI commands:
 * - gh release create → POST /repos/:owner/:repo/releases
 * - gh release list → GET /repos/:owner/:repo/releases
 * - gh release view → GET /repos/:owner/:repo/releases/:id
 * - gh release upload → POST /repos/:owner/:repo/releases/:id/assets
 * 
 * Maintains compatibility with RELEASE_PROCESS workflow
 */

import { GitHubAPI } from './github-api.js';
import { promises as fs } from 'fs';
import { createReadStream, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * GitHub Releases API extension
 */
export class GitHubReleases extends GitHubAPI {
    constructor(options = {}) {
        super(options);
    }

    /**
     * List releases - Replaces: gh release list
     * 
     * @param {Object} options - List options
     * @returns {Promise<Array>} Releases array
     */
    async listReleases(options = {}) {
        const params = new URLSearchParams();
        
        if (options.per_page) params.append('per_page', options.per_page);
        if (options.page) params.append('page', options.page);
        
        // Default to 30 per page
        if (!options.per_page) params.append('per_page', '30');
        
        const endpoint = `/repos/${this.owner}/${this.repo}/releases?${params.toString()}`;
        const releases = await this.request(endpoint);
        
        // Transform to match gh CLI output format
        return releases.map(release => ({
            id: release.id,
            name: release.name,
            tagName: release.tag_name,
            targetCommitish: release.target_commitish,
            draft: release.draft,
            prerelease: release.prerelease,
            createdAt: release.created_at,
            publishedAt: release.published_at,
            body: release.body,
            url: release.html_url,
            uploadUrl: release.upload_url,
            assets: release.assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                size: asset.size,
                downloadCount: asset.download_count,
                createdAt: asset.created_at,
                updatedAt: asset.updated_at,
                browserDownloadUrl: asset.browser_download_url
            }))
        }));
    }

    /**
     * Get single release - Replaces: gh release view
     * 
     * @param {string} tagName - Release tag name
     * @returns {Promise<Object>} Release object
     */
    async getRelease(tagName) {
        const endpoint = `/repos/${this.owner}/${this.repo}/releases/tags/${tagName}`;
        const release = await this.request(endpoint);
        
        // Transform to match gh CLI output format
        return {
            id: release.id,
            name: release.name,
            tagName: release.tag_name,
            targetCommitish: release.target_commitish,
            draft: release.draft,
            prerelease: release.prerelease,
            createdAt: release.created_at,
            publishedAt: release.published_at,
            body: release.body,
            url: release.html_url,
            uploadUrl: release.upload_url,
            assets: release.assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                size: asset.size,
                downloadCount: asset.download_count,
                createdAt: asset.created_at,
                updatedAt: asset.updated_at,
                browserDownloadUrl: asset.browser_download_url
            }))
        };
    }

    /**
     * Create release - Replaces: gh release create
     * 
     * @param {Object} releaseData - Release creation data
     * @returns {Promise<Object>} Created release
     */
    async createRelease(releaseData) {
        const endpoint = `/repos/${this.owner}/${this.repo}/releases`;
        
        const body = {
            tag_name: releaseData.tagName,
            target_commitish: releaseData.targetCommitish || 'main',
            name: releaseData.name || releaseData.tagName,
            body: releaseData.body || '',
            draft: releaseData.draft || false,
            prerelease: releaseData.prerelease || false,
            generate_release_notes: releaseData.generateReleaseNotes || false
        };
        
        const release = await this.request(endpoint, {
            method: 'POST',
            body: body
        });
        
        // Transform to match gh CLI output format
        return {
            id: release.id,
            name: release.name,
            tagName: release.tag_name,
            targetCommitish: release.target_commitish,
            draft: release.draft,
            prerelease: release.prerelease,
            createdAt: release.created_at,
            publishedAt: release.published_at,
            body: release.body,
            url: release.html_url,
            uploadUrl: release.upload_url,
            assets: []
        };
    }

    /**
     * Upload release asset - Replaces: gh release upload
     * 
     * @param {string} tagName - Release tag name
     * @param {string} filePath - Path to file to upload
     * @param {Object} options - Upload options
     * @returns {Promise<Object>} Uploaded asset
     */
    async uploadReleaseAsset(tagName, filePath, options = {}) {
        // Get release info to get upload URL
        const release = await this.getRelease(tagName);
        
        // Check if file exists
        const stats = statSync(filePath);
        if (!stats.isFile()) {
            throw new Error(`File not found or not a file: ${filePath}`);
        }
        
        const fileName = options.name || path.basename(filePath);
        const contentType = options.contentType || this.getContentType(fileName);
        
        // Remove template part from upload URL
        const uploadUrl = release.uploadUrl.replace(/\{.*\}/, '');
        const url = `${uploadUrl}?name=${encodeURIComponent(fileName)}`;
        
        // Read file content
        const fileContent = await fs.readFile(filePath);
        
        const asset = await this.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                'Content-Length': stats.size.toString()
            },
            body: fileContent
        });
        
        return {
            id: asset.id,
            name: asset.name,
            size: asset.size,
            downloadCount: asset.download_count,
            createdAt: asset.created_at,
            updatedAt: asset.updated_at,
            browserDownloadUrl: asset.browser_download_url
        };
    }

    /**
     * Get content type based on file extension
     * 
     * @param {string} fileName - File name
     * @returns {string} Content type
     */
    getContentType(fileName) {
        const ext = path.extname(fileName).toLowerCase();
        const contentTypes = {
            '.zip': 'application/zip',
            '.7z': 'application/x-7z-compressed',
            '.tar': 'application/x-tar',
            '.tar.gz': 'application/gzip',
            '.tgz': 'application/gzip',
            '.json': 'application/json',
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.pdf': 'application/pdf',
            '.exe': 'application/vnd.microsoft.portable-executable',
            '.deb': 'application/vnd.debian.binary-package',
            '.rpm': 'application/x-rpm',
            '.dmg': 'application/x-apple-diskimage'
        };
        
        return contentTypes[ext] || 'application/octet-stream';
    }

    /**
     * Delete release - For cleanup operations
     * 
     * @param {string} tagName - Release tag name
     * @returns {Promise<void>}
     */
    async deleteRelease(tagName) {
        const release = await this.getRelease(tagName);
        const endpoint = `/repos/${this.owner}/${this.repo}/releases/${release.id}`;
        
        await this.request(endpoint, {
            method: 'DELETE'
        });
    }

    /**
     * Update release - For updating release notes
     * 
     * @param {string} tagName - Release tag name
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>} Updated release
     */
    async updateRelease(tagName, updateData) {
        const release = await this.getRelease(tagName);
        const endpoint = `/repos/${this.owner}/${this.repo}/releases/${release.id}`;
        
        const body = {};
        if (updateData.name !== undefined) body.name = updateData.name;
        if (updateData.body !== undefined) body.body = updateData.body;
        if (updateData.draft !== undefined) body.draft = updateData.draft;
        if (updateData.prerelease !== undefined) body.prerelease = updateData.prerelease;
        if (updateData.targetCommitish !== undefined) body.target_commitish = updateData.targetCommitish;
        
        const updatedRelease = await this.request(endpoint, {
            method: 'PATCH',
            body: body
        });
        
        return {
            id: updatedRelease.id,
            name: updatedRelease.name,
            tagName: updatedRelease.tag_name,
            targetCommitish: updatedRelease.target_commitish,
            draft: updatedRelease.draft,
            prerelease: updatedRelease.prerelease,
            createdAt: updatedRelease.created_at,
            publishedAt: updatedRelease.published_at,
            body: updatedRelease.body,
            url: updatedRelease.html_url,
            uploadUrl: updatedRelease.upload_url,
            assets: updatedRelease.assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                size: asset.size,
                downloadCount: asset.download_count,
                createdAt: asset.created_at,
                updatedAt: asset.updated_at,
                browserDownloadUrl: asset.browser_download_url
            }))
        };
    }

    /**
     * Get latest release - Convenience method
     * 
     * @returns {Promise<Object>} Latest release
     */
    async getLatestRelease() {
        const endpoint = `/repos/${this.owner}/${this.repo}/releases/latest`;
        const release = await this.request(endpoint);
        
        return {
            id: release.id,
            name: release.name,
            tagName: release.tag_name,
            targetCommitish: release.target_commitish,
            draft: release.draft,
            prerelease: release.prerelease,
            createdAt: release.created_at,
            publishedAt: release.published_at,
            body: release.body,
            url: release.html_url,
            uploadUrl: release.upload_url,
            assets: release.assets.map(asset => ({
                id: asset.id,
                name: asset.name,
                size: asset.size,
                downloadCount: asset.download_count,
                createdAt: asset.created_at,
                updatedAt: asset.updated_at,
                browserDownloadUrl: asset.browser_download_url
            }))
        };
    }

    /**
     * Create release from notes file - Matches RELEASE_PROCESS workflow
     * 
     * @param {string} tagName - Release tag name
     * @param {string} title - Release title
     * @param {string} notesFile - Path to release notes file
     * @param {string[]} assets - Array of asset file paths
     * @returns {Promise<Object>} Created release with assets
     */
    async createReleaseFromNotesFile(tagName, title, notesFile, assets = []) {
        // Read release notes from file
        let releaseNotes = '';
        try {
            releaseNotes = await fs.readFile(notesFile, 'utf8');
        } catch (error) {
            console.warn(`Warning: Could not read release notes file ${notesFile}: ${error.message}`);
            releaseNotes = `Release ${tagName}`;
        }
        
        // Create release
        const release = await this.createRelease({
            tagName: tagName,
            name: title,
            body: releaseNotes,
            draft: false,
            prerelease: false
        });
        
        // Upload assets if provided
        const uploadedAssets = [];
        for (const assetPath of assets) {
            try {
                const asset = await this.uploadReleaseAsset(tagName, assetPath);
                uploadedAssets.push(asset);
                console.log(`✓ Uploaded asset: ${asset.name}`);
            } catch (error) {
                console.warn(`Warning: Failed to upload asset ${assetPath}: ${error.message}`);
            }
        }
        
        return {
            ...release,
            assets: uploadedAssets
        };
    }
}

/**
 * Create GitHub Releases API client
 * 
 * @param {Object} options - Configuration options
 * @returns {GitHubReleases} Releases API client
 */
export function createGitHubReleases(options = {}) {
    return new GitHubReleases(options);
}

/**
 * CLI interface for release operations
 */
export async function main(args) {
    try {
        const releases = createGitHubReleases();
        const command = args[0];
        
        switch (command) {
            case 'list':
                const releasesList = await releases.listReleases();
                console.log(JSON.stringify(releasesList, null, 2));
                break;
                
            case 'view':
                const tagName = args[1];
                if (!tagName) {
                    throw new Error('Tag name is required');
                }
                
                const release = await releases.getRelease(tagName);
                console.log(JSON.stringify(release, null, 2));
                break;
                
            case 'create':
                const tagIndex = args.indexOf('--tag');
                const titleIndex = args.indexOf('--title');
                const notesIndex = args.indexOf('--notes');
                const notesFileIndex = args.indexOf('--notes-file');
                const draftIndex = args.indexOf('--draft');
                const prereleaseIndex = args.indexOf('--prerelease');
                
                if (tagIndex === -1 || tagIndex + 1 >= args.length) {
                    throw new Error('--tag is required');
                }
                
                const createData = {
                    tagName: args[tagIndex + 1],
                    name: titleIndex !== -1 ? args[titleIndex + 1] : args[tagIndex + 1],
                    draft: draftIndex !== -1,
                    prerelease: prereleaseIndex !== -1
                };
                
                if (notesIndex !== -1) {
                    createData.body = args[notesIndex + 1];
                } else if (notesFileIndex !== -1) {
                    createData.body = await fs.readFile(args[notesFileIndex + 1], 'utf8');
                }
                
                const newRelease = await releases.createRelease(createData);
                console.log(newRelease.url);
                break;
                
            case 'upload':
                const uploadTagIndex = args.indexOf('--tag');
                const fileIndex = args.indexOf('--file');
                
                if (uploadTagIndex === -1 || uploadTagIndex + 1 >= args.length) {
                    throw new Error('--tag is required');
                }
                
                if (fileIndex === -1 || fileIndex + 1 >= args.length) {
                    throw new Error('--file is required');
                }
                
                const uploadTag = args[uploadTagIndex + 1];
                const filePath = args[fileIndex + 1];
                
                const asset = await releases.uploadReleaseAsset(uploadTag, filePath);
                console.log(`✓ Uploaded: ${asset.name} (${asset.size} bytes)`);
                break;
                
            case 'latest':
                const latestRelease = await releases.getLatestRelease();
                console.log(JSON.stringify(latestRelease, null, 2));
                break;
                
            case 'test':
                const testResult = await releases.testConnection();
                if (testResult.success) {
                    console.log(`✓ Connected to GitHub as ${testResult.user}`);
                    const repoInfo = await releases.getRepository();
                    console.log(`Repository: ${repoInfo.full_name}`);
                    console.log(`Rate limit: ${testResult.rateLimit.remaining} requests remaining`);
                } else {
                    console.error(`✗ Connection failed: ${testResult.error}`);
                    process.exit(1);
                }
                break;
                
            default:
                console.log('GitHub Releases API - Available commands:');
                console.log('  list');
                console.log('  view <tag-name>');
                console.log('  create --tag <tag> [--title <title>] [--notes <notes>] [--notes-file <file>] [--draft] [--prerelease]');
                console.log('  upload --tag <tag> --file <file>');
                console.log('  latest');
                console.log('  test');
                console.log('');
                console.log('Environment variables:');
                console.log('  GITHUB_TOKEN - GitHub personal access token (required)');
                break;
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run CLI if called directly
if (process.argv[1] && process.argv[1].endsWith('lib-github-releases.js')) {
    main(process.argv.slice(2));
}