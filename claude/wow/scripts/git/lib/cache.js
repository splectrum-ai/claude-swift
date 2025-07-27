import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const ISSUE_CACHE_PATH = path.join(PROJECT_ROOT, 'claude/project/cache/issues.json');
const MILESTONE_CACHE_PATH = path.join(PROJECT_ROOT, 'claude/project/cache/milestones.json');

// In-memory cache for lazy loading
const memoryCache = {
    issues: null,
    milestones: null,
    lastLoad: {}
};

/**
 * Load issue cache with lazy loading support
 */
export async function loadIssueCache(forceReload = false) {
    if (!forceReload && memoryCache.issues) {
        return memoryCache.issues;
    }
    
    try {
        const content = await fs.readFile(ISSUE_CACHE_PATH, 'utf8');
        memoryCache.issues = JSON.parse(content);
        memoryCache.lastLoad.issues = Date.now();
        return memoryCache.issues;
    } catch (error) {
        // File doesn't exist or is invalid
        memoryCache.issues = {};
        return {};
    }
}

/**
 * Get a single issue from cache (lazy load)
 */
export async function getIssue(issueNumber) {
    const cache = await loadIssueCache();
    return cache[issueNumber] || null;
}

/**
 * Update issue in cache
 */
export async function updateIssue(issueNumber, data) {
    const cache = await loadIssueCache();
    
    cache[issueNumber] = {
        ...data,
        number: issueNumber,
        cached_at: new Date().toISOString()
    };
    
    memoryCache.issues = cache;
    await saveIssueCache(cache);
    return cache[issueNumber];
}

/**
 * Batch update issues
 */
export async function updateIssuesBatch(updates) {
    const cache = await loadIssueCache();
    const timestamp = new Date().toISOString();
    
    for (const [issueNumber, data] of Object.entries(updates)) {
        cache[issueNumber] = {
            ...data,
            number: issueNumber,
            cached_at: timestamp
        };
    }
    
    memoryCache.issues = cache;
    await saveIssueCache(cache);
    return { updated: Object.keys(updates).length };
}

/**
 * Remove issue from cache
 */
export async function removeIssue(issueNumber) {
    const cache = await loadIssueCache();
    delete cache[issueNumber];
    memoryCache.issues = cache;
    await saveIssueCache(cache);
    return true;
}

/**
 * Save issue cache to disk
 */
async function saveIssueCache(cache) {
    await fs.mkdir(path.dirname(ISSUE_CACHE_PATH), { recursive: true });
    await fs.writeFile(ISSUE_CACHE_PATH, JSON.stringify(cache, null, 2));
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
    const issueCache = await loadIssueCache();
    const issues = Object.values(issueCache);
    
    return {
        totalIssues: issues.length,
        openIssues: issues.filter(i => i.state === 'open').length,
        closedIssues: issues.filter(i => i.state === 'closed').length,
        oldestCached: issues.reduce((oldest, i) => 
            (!oldest || i.cached_at < oldest) ? i.cached_at : oldest, null
        ),
        memoryLoaded: memoryCache.lastLoad.issues ? 
            new Date(memoryCache.lastLoad.issues).toISOString() : null
    };
}

/**
 * Clear memory cache (force reload on next access)
 */
export function clearMemoryCache() {
    memoryCache.issues = null;
    memoryCache.milestones = null;
    memoryCache.lastLoad = {};
}