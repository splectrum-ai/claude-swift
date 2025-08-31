//  name        Git API (Repository Context Management)
//  URI         tools/git
//  type        API Module
//  description Set repository path context for all subsequent git operations
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib")
const git = require("tools_git_lib")
///////////////////////////////////////////////////////////////////////////////
exports.default = function tools_git(input) {
    // Parameter extraction - repo takes precedence over path
    const repo = spl.action(input, 'repo');
    const pathArg = spl.action(input, 'path');
    const create = spl.action(input, 'create');
    
    // Repository path resolution - repo takes precedence over path, default to "."
    const repoParam = repo || pathArg || ".";
    const appDataRoot = spl.context(input, 'appDataRoot');
    const cwd = spl.context(input, 'cwd');
    const repoPath = git.getAppRelativeRepoPath(".", cwd, appDataRoot);
    const repoPath2 = git.getAppRelativeRepoPath(repoParam, cwd, appDataRoot);
    
    // Build git command arguments to validate and set repository context
    const args = ['-c', repoPath2];
    
    // Execute git command to validate repository and set context
    const output = git.executeGit(args, repoPath);
    
    // Output repository context information
    console.log('Git Repository Context Set:');
    console.log('===========================');
    console.log(`Repository Path: ${repoPath}`);
    
    console.log('Repository Status:');
    if (output.trim()) {
        console.log(output);
    } else {
        console.log('Working directory clean');
    }
    
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////