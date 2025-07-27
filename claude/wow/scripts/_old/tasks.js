import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const OUTBOX_DIR = path.join(PROJECT_ROOT, 'claude/outbox');
const INBOX_DIR = path.join(PROJECT_ROOT, 'claude/inbox');

/**
 * Create a task file
 */
export async function createTask(target, name, title, description, metadata = {}) {
    const timestamp = new Date().toISOString()
        .replace(/:/g, '-')
        .replace(/\./g, '-');
    
    const filename = `${timestamp}Z_${target.replace('/', '_')}_${name}.md`;
    
    // Get source repository
    const source = await getCurrentRepo();
    
    const content = `---
source: ${source}
target: ${target}
created: ${new Date().toISOString()}
priority: ${metadata.priority || 'MEDIUM'}
effort: ${metadata.effort || 'M'}
type: ${metadata.type || 'enhancement'}
work_area: ${metadata.workArea || 'general'}
---

# ${title}

## Description
${description}

## Priority: ${metadata.priority || 'MEDIUM'}
**Justification:** ${metadata.priorityJustification || 'Standard priority for this type of task'}

## Dependencies
${metadata.blocks ? `**Blocks:** ${metadata.blocks}` : ''}
${metadata.blockedBy ? `**Blocked by:** ${metadata.blockedBy}` : ''}
${metadata.related ? `**Related:** ${metadata.related}` : ''}

## Effort: ${metadata.effort || 'M'}
**Estimate:** ${metadata.effortJustification || 'Standard effort estimate'}

## Test Criteria
**How to verify completion:**
${metadata.testCriteria || '- [ ] Task completed successfully\n- [ ] Tests pass\n- [ ] Documentation updated'}

## Work Area: ${metadata.workArea || 'general'}
**Context:** ${metadata.context || 'Task created via automated workflow'}

🤖 Generated with [Claude Code](https://claude.ai/code)`;

    await fs.mkdir(OUTBOX_DIR, { recursive: true });
    await fs.writeFile(path.join(OUTBOX_DIR, filename), content);
    
    return {
        filename,
        path: path.join(OUTBOX_DIR, filename),
        target,
        title
    };
}

/**
 * List tasks in a directory
 */
export async function listTasks(directory = OUTBOX_DIR) {
    try {
        const files = await fs.readdir(directory);
        const taskFiles = files.filter(f => f.match(/^\d{4}-\d{2}-\d{2}T.*\.md$/));
        
        const tasks = await Promise.all(taskFiles.map(async file => {
            const content = await fs.readFile(path.join(directory, file), 'utf8');
            const metadata = parseTaskMetadata(content);
            return {
                filename: file,
                ...metadata
            };
        }));
        
        return tasks.sort((a, b) => a.created < b.created ? -1 : 1);
    } catch (error) {
        return [];
    }
}

/**
 * Move task from outbox to inbox
 */
export async function moveTaskToInbox(filename) {
    const sourcePath = path.join(OUTBOX_DIR, filename);
    const targetPath = path.join(INBOX_DIR, filename);
    
    await fs.mkdir(INBOX_DIR, { recursive: true });
    await fs.rename(sourcePath, targetPath);
    
    return {
        moved: true,
        from: sourcePath,
        to: targetPath
    };
}

/**
 * Process self-targeted tasks
 */
export async function processSelfTargetedTasks() {
    const currentRepo = await getCurrentRepo();
    const tasks = await listTasks(OUTBOX_DIR);
    const selfTargeted = tasks.filter(t => 
        t.target === currentRepo || 
        t.target === path.basename(process.cwd()) ||
        t.target === '.'
    );
    
    const results = [];
    for (const task of selfTargeted) {
        const result = await moveTaskToInbox(task.filename);
        results.push({
            ...task,
            ...result
        });
    }
    
    return results;
}

/**
 * Parse task metadata from content
 */
function parseTaskMetadata(content) {
    const lines = content.split('\n');
    const metadata = {};
    let inFrontmatter = false;
    let title = '';
    
    for (const line of lines) {
        if (line === '---') {
            inFrontmatter = !inFrontmatter;
            continue;
        }
        
        if (inFrontmatter) {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key && value) {
                metadata[key] = value;
            }
        } else if (line.startsWith('# ')) {
            title = line.substring(2);
            break;
        }
    }
    
    return { ...metadata, title };
}

/**
 * Get current repository name
 */
async function getCurrentRepo() {
    try {
        const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
        const match = remote.match(/[/:]([\w-]+\/[\w-]+)(?:\.git)?$/);
        return match ? match[1] : path.basename(process.cwd());
    } catch {
        return path.basename(process.cwd());
    }
}