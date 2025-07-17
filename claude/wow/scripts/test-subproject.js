#!/usr/bin/env node

/**
 * Test script to verify git scripts work in subprojects
 */

import { execSync } from 'child_process';
import path from 'path';

// Test in different directories
const testDirs = [
    '/home/herma/sesameh/claude-swift',
    '/home/herma/sesameh/claude-swift/projects/infometish/InfoMetis'
];

for (const testDir of testDirs) {
    console.log(`\n🔍 Testing in: ${testDir}`);
    console.log('═'.repeat(60));
    
    try {
        // Test basic git commands in this directory
        const gitRoot = execSync('git rev-parse --show-toplevel', { 
            cwd: testDir, 
            encoding: 'utf8' 
        }).trim();
        
        const repoName = path.basename(gitRoot);
        const currentBranch = execSync('git branch --show-current', { 
            cwd: testDir, 
            encoding: 'utf8' 
        }).trim();
        
        const remoteUrl = execSync('git remote get-url origin', { 
            cwd: testDir, 
            encoding: 'utf8' 
        }).trim();
        
        console.log(`📁 Repository: ${repoName}`);
        console.log(`🌿 Branch: ${currentBranch}`);
        console.log(`🔗 Remote: ${remoteUrl}`);
        console.log(`📍 Git Root: ${gitRoot}`);
        
        // Test if scripts are accessible
        const scriptPath = path.join(testDir, 'claude/wow/scripts/git-info');
        try {
            execSync(`ls -la "${scriptPath}"`, { stdio: 'ignore' });
            console.log(`✅ Scripts accessible at: ${scriptPath}`);
        } catch {
            console.log(`❌ Scripts not accessible at: ${scriptPath}`);
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}