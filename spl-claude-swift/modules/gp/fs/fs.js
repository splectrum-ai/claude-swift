//  name        FS API Auxiliary Functions
//  URI         gp/fs/fs
//  type        Auxiliary Library
//  description Contains common filesystem functions used by the fs API
//              All operations are constrained within app data boundaries.
///////////////////////////////////////////////////////////////////////////////
const path = require('path');
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////////

// Read file contents
exports.readFile = function(appDataRoot, filePath, encoding) {
    const resolvedPath = filePath ? path.resolve(appDataRoot, filePath) : appDataRoot;
    return fs.readFileSync(resolvedPath, encoding);
}

// Write file contents
exports.writeFile = function(appDataRoot, filePath, content, encoding) {
    const resolvedPath = filePath ? path.resolve(appDataRoot, filePath) : appDataRoot;
    
    // Ensure directory exists
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    if (Buffer.isBuffer(content)) {
        // Handle buffer content (for binary files)
        return fs.writeFileSync(resolvedPath, content);
    } else {
        return fs.writeFileSync(resolvedPath, content, encoding);
    }
}

// Copy file
exports.copyFile = function(appDataRoot, fromPath, toPath) {
    const resolvedFromPath = fromPath ? path.resolve(appDataRoot, fromPath) : appDataRoot;
    const resolvedToPath = toPath ? path.resolve(appDataRoot, toPath) : appDataRoot;
    return fs.copyFileSync(resolvedFromPath, resolvedToPath);
}

// Move/rename file
exports.moveFile = function(appDataRoot, fromPath, toPath) {
    const resolvedFromPath = fromPath ? path.resolve(appDataRoot, fromPath) : appDataRoot;
    const resolvedToPath = toPath ? path.resolve(appDataRoot, toPath) : appDataRoot;
    return fs.renameSync(resolvedFromPath, resolvedToPath);
}

// Delete file
exports.deleteFile = function(appDataRoot, filePath) {
    const resolvedPath = filePath ? path.resolve(appDataRoot, filePath) : appDataRoot;
    return fs.unlinkSync(resolvedPath);
}

// Check if file/directory exists
exports.exists = function(appDataRoot, filePath) {
    const resolvedPath = filePath ? path.resolve(appDataRoot, filePath) : appDataRoot;
    return fs.existsSync(resolvedPath);
}

// Get file/directory info
exports.info = function(appDataRoot, filePath) {
    const resolvedPath = filePath ? path.resolve(appDataRoot, filePath) : appDataRoot;
    const stats = fs.statSync(resolvedPath);
    
    return {
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime
    };
}

// Create directory
exports.mkdir = function(appDataRoot, dirPath, options) {
    const resolvedPath = dirPath ? path.resolve(appDataRoot, dirPath) : appDataRoot;
    return fs.mkdirSync(resolvedPath, options);
}

// Remove directory
exports.rmdir = function(appDataRoot, dirPath, options) {
    const resolvedPath = dirPath ? path.resolve(appDataRoot, dirPath) : appDataRoot;
    return fs.rmSync(resolvedPath, { recursive: options.recursive, force: options.force || false });
}

// List directory contents
exports.list = function(appDataRoot, dirPath, options = {}) {
    const resolvedPath = path.resolve(appDataRoot, dirPath);
    const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
    
    return entries.map(entry => ({
        name: entry.name,
        isFile: entry.isFile(),
        isDirectory: entry.isDirectory(),
        path: path.join(dirPath, entry.name)
    }));
}

// Create standardized file record structure following gp/fs API schema
exports.createFileRecord = function(appRoot, filePath, content) {
    const safePath = path.resolve(appRoot, filePath);
    const stats = fs.statSync(safePath);
    const fileMode = stats.mode;
    
    // Determine encoding based on content or file type
    const isText = this.isTextFile(filePath);
    const encoding = isText ? 'utf8' : 'binary';
    const valueEncoding = isText ? 'utf8' : (content ? 'base64' : 'utf8');
    
    // Build the standardized record
    const record = {
        headers: {
            gp: {
                fs: {
                    path: filePath,
                    type: stats.isDirectory() ? 'directory' : 'file',
                    encoding: encoding,
                    valueEncoding: valueEncoding,
                    size: stats.size,
                    created: stats.birthtime.toISOString(),
                    modified: stats.mtime.toISOString(),
                    accessed: stats.atime.toISOString(),
                    permissions: {
                        readable: !!(fileMode & parseInt('400', 8)),
                        writable: !!(fileMode & parseInt('200', 8)),
                        executable: !!(fileMode & parseInt('100', 8)),
                        mode: '0' + (fileMode & parseInt('777', 8)).toString(8)
                    }
                }
            }
        },
        value: content
    };
    
    return record;
}

// Helper function to determine if file is likely text-based
exports.isTextFile = function(filePath) {
    const textExtensions = ['.txt', '.md', '.js', '.json', '.html', '.css', '.xml', '.csv', '.log', '.yml', '.yaml'];
    const binaryExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.exe', '.bin'];
    
    const ext = path.extname(filePath).toLowerCase();
    
    if (textExtensions.includes(ext)) return true;
    if (binaryExtensions.includes(ext)) return false;
    
    // Default to text for unknown extensions (safer for most development files)
    return true;
}

// Find files/directories with glob pattern support and filters
exports.find = function(appDataRoot, options = {}) {
    const safePath = options.path ? path.resolve(appDataRoot, options.path) : appDataRoot;
    const results = [];
    
    // Simple glob pattern matching (basic implementation)
    const matchPattern = (fileName, pattern) => {
        if (!pattern || typeof pattern !== 'string') return true;
        if (!fileName || typeof fileName !== 'string') return false;
        
        try {
            // Convert glob pattern to regex
            const regexPattern = pattern
                .replace(/\*\*/g, '.*')  // ** matches any number of directories
                .replace(/\*/g, '[^/]*') // * matches anything except /
                .replace(/\?/g, '.')     // ? matches single character
                .replace(/\{([^}]+)\}/g, '($1)') // {a,b,c} becomes (a|b|c)
                .replace(/,/g, '|');     // Convert commas to OR
            
            const regex = new RegExp(`^${regexPattern}$`, 'i');
            return regex.test(fileName);
        } catch (e) {
            // If regex fails, fall back to simple string matching
            return fileName.includes(pattern);
        }
    };
    
    // Recursive directory traversal
    const traverse = (currentPath, relativePath = '', depth = 0) => {
        if (options.maxDepth && depth > options.maxDepth) return;
        
        try {
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                const relativeEntryPath = path.join(relativePath, entry.name);
                
                // Apply pattern filter
                if (options.pattern && !matchPattern(relativeEntryPath, options.pattern)) {
                    if (entry.isDirectory() && options.recursive !== false) {
                        // Continue traversing directories even if they don't match
                        traverse(fullPath, relativeEntryPath, depth + 1);
                    }
                    continue;
                }
                
                // Apply type filter
                if (options.type === 'file' && !entry.isFile()) continue;
                if (options.type === 'directory' && !entry.isDirectory()) continue;
                
                // Get file stats for additional filters
                const stats = fs.statSync(fullPath);
                
                // Apply size filter
                if (options.size && typeof options.size === 'string') {
                    try {
                        const sizeMatch = options.size.match(/^([<>]=?|=)?(\d+)(k|m|g)?$/i);
                        if (sizeMatch && Array.isArray(sizeMatch) && sizeMatch.length >= 3) {
                            const [, op = '=', num, unit = ''] = sizeMatch;
                            const multiplier = { k: 1024, m: 1024*1024, g: 1024*1024*1024 }[unit.toLowerCase()] || 1;
                            const targetSize = parseInt(num) * multiplier;
                            
                            if (!isNaN(targetSize)) {
                                const passes = op === '>' ? stats.size > targetSize :
                                             op === '>=' ? stats.size >= targetSize :
                                             op === '<' ? stats.size < targetSize :
                                             op === '<=' ? stats.size <= targetSize :
                                             stats.size === targetSize;
                                
                                if (!passes) continue;
                            }
                        }
                    } catch (e) {
                        // Skip size filter if parsing fails
                    }
                }
                
                // Apply empty filter
                if (options.empty) {
                    const isEmpty = entry.isFile() ? stats.size === 0 : 
                                   entry.isDirectory() ? (() => {
                                       try {
                                           const dirEntries = fs.readdirSync(fullPath);
                                           return Array.isArray(dirEntries) ? dirEntries.length === 0 : false;
                                       } catch (e) {
                                           return false; // Can't read directory, assume not empty
                                       }
                                   })() : false;
                    if (!isEmpty) continue;
                }
                
                // Add to results
                results.push({
                    name: entry.name,
                    path: relativeEntryPath,
                    fullPath: fullPath,
                    isFile: entry.isFile(),
                    isDirectory: entry.isDirectory(),
                    size: stats.size,
                    modified: stats.mtime,
                    created: stats.birthtime
                });
                
                // Recurse into directories
                if (entry.isDirectory() && options.recursive !== false) {
                    traverse(fullPath, relativeEntryPath, depth + 1);
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    };
    
    traverse(safePath);
    return results;
}

// Compare files or directories for differences
exports.diff = function(appDataRoot, fromPath, toPath, options = {}) {
    const safeFromPath = fromPath ? path.resolve(appDataRoot, fromPath) : appDataRoot;
    const safeToPath = toPath ? path.resolve(appDataRoot, toPath) : appDataRoot;
    
    const fromStats = fs.existsSync(safeFromPath) ? fs.statSync(safeFromPath) : null;
    const toStats = fs.existsSync(safeToPath) ? fs.statSync(safeToPath) : null;
    
    const diff = {
        from: fromPath,
        to: toPath,
        differences: []
    };
    
    // Check existence
    if (!fromStats && !toStats) {
        diff.differences.push({ type: 'both_missing', message: 'Both paths do not exist' });
        return diff;
    }
    if (!fromStats) {
        diff.differences.push({ type: 'from_missing', message: 'Source path does not exist' });
        return diff;
    }
    if (!toStats) {
        diff.differences.push({ type: 'to_missing', message: 'Target path does not exist' });
        return diff;
    }
    
    // Check type difference
    if (fromStats.isFile() !== toStats.isFile()) {
        diff.differences.push({
            type: 'type_mismatch',
            message: `Type mismatch: ${fromStats.isFile() ? 'file' : 'directory'} vs ${toStats.isFile() ? 'file' : 'directory'}`
        });
    }
    
    // File comparison
    if (fromStats.isFile() && toStats.isFile()) {
        // Size comparison
        if (fromStats.size !== toStats.size) {
            diff.differences.push({
                type: 'size_difference',
                from_size: fromStats.size,
                to_size: toStats.size,
                message: `Size difference: ${fromStats.size} vs ${toStats.size} bytes`
            });
        }
        
        // Content comparison (for small text files)
        if (options.content && fromStats.size < 1024 * 1024 && this.isTextFile(fromPath)) {
            try {
                const fromContent = fs.readFileSync(safeFromPath, 'utf8');
                const toContent = fs.readFileSync(safeToPath, 'utf8');
                
                if (fromContent !== toContent) {
                    diff.differences.push({
                        type: 'content_difference',
                        message: 'File contents differ'
                    });
                }
            } catch (error) {
                diff.differences.push({
                    type: 'content_read_error',
                    message: `Could not compare content: ${error.message}`
                });
            }
        }
    }
    
    // Modified time comparison
    if (Math.abs(fromStats.mtime.getTime() - toStats.mtime.getTime()) > 1000) {
        diff.differences.push({
            type: 'mtime_difference',
            from_mtime: fromStats.mtime.toISOString(),
            to_mtime: toStats.mtime.toISOString(),
            message: `Modified time difference`
        });
    }
    
    return diff;
}

// Search file contents for patterns
exports.grep = function(appDataRoot, pattern, options = {}) {
    const searchPath = options.path ? path.resolve(appDataRoot, options.path) : appDataRoot;
    const results = [];
    
    // Simple pattern matching - can be regex or string
    const createMatcher = (pattern, flags = 'gi') => {
        try {
            return new RegExp(pattern, flags);
        } catch (e) {
            // If pattern is not valid regex, treat as literal string
            return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
        }
    };
    
    const matcher = createMatcher(pattern, options.caseSensitive ? 'g' : 'gi');
    
    // Recursive file search
    const searchInFile = (filePath, relativePath) => {
        try {
            if (!this.isTextFile(filePath)) return; // Skip binary files
            
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            const matches = [];
            
            lines.forEach((line, index) => {
                const lineMatches = [...line.matchAll(matcher)];
                if (lineMatches.length > 0) {
                    matches.push({
                        line: index + 1,
                        content: line.trim(),
                        matches: lineMatches.map(match => ({
                            text: match[0],
                            index: match.index
                        }))
                    });
                }
            });
            
            if (matches.length > 0) {
                results.push({
                    file: relativePath,
                    fullPath: filePath,
                    matchCount: matches.reduce((sum, m) => sum + m.matches.length, 0),
                    lines: matches
                });
            }
        } catch (error) {
            // Skip files we can't read
        }
    };
    
    const traverse = (currentPath, relativePath = '') => {
        try {
            const stats = fs.statSync(currentPath);
            
            if (stats.isFile()) {
                searchInFile(currentPath, relativePath);
            } else if (stats.isDirectory() && options.recursive !== false) {
                const entries = fs.readdirSync(currentPath);
                for (const entry of entries) {
                    const fullPath = path.join(currentPath, entry);
                    const relativeEntryPath = path.join(relativePath, entry);
                    traverse(fullPath, relativeEntryPath);
                }
            }
        } catch (error) {
            // Skip paths we can't access
        }
    };
    
    traverse(searchPath, path.basename(options.path || '.'));
    return results;
}