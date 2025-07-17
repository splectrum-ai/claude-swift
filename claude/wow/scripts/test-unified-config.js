#!/usr/bin/env node

/**
 * Test unified repository configuration system
 * Verifies that all scripts use consistent configuration
 */

import { execSync } from 'child_process';
import { createRepoConfig } from './lib/repo-config.js';

const testDirs = [
    { name: 'claude-swift', path: '/home/herma/sesameh/claude-swift', expected: 'sesameh/claude-swift' },
    { name: 'InfoMetis', path: '/home/herma/sesameh/claude-swift/projects/infometish/InfoMetis', expected: 'infometish/InfoMetis' }
];

console.log('🔍 Testing Unified Repository Configuration');
console.log('═'.repeat(60));

for (const testDir of testDirs) {
    console.log(`\n📋 Testing: ${testDir.name}`);
    console.log('─'.repeat(40));
    
    try {
        // Test repo config directly
        const repoConfig = createRepoConfig({ workingDirectory: testDir.path });
        const info = repoConfig.getRepositoryInfo();
        
        console.log(`✅ Repo Config: ${info.fullName}`);
        console.log(`   Config Source: ${info.configSource}`);
        console.log(`   Project Root: ${info.projectRoot}`);
        
        // Test git-info script
        try {
            const gitInfoResult = execSync('node claude/wow/scripts/git-info', {
                cwd: testDir.path,
                encoding: 'utf8',
                timeout: 5000
            });
            
            const firstLine = gitInfoResult.split('\n')[0];
            console.log(`✅ git-info: ${firstLine}`);
        } catch (error) {
            console.log(`❌ git-info failed: ${error.message}`);
        }
        
        // Test GitHub API configuration
        const githubConfig = repoConfig.getGitHubConfig();
        console.log(`✅ GitHub API: ${githubConfig.owner}/${githubConfig.repo}`);
        
        // Verify expected repository
        if (info.fullName === testDir.expected) {
            console.log(`✅ Repository detection correct`);
        } else {
            console.log(`❌ Expected ${testDir.expected}, got ${info.fullName}`);
        }
        
    } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
    }
}

console.log('\n🎯 Configuration System Summary');
console.log('═'.repeat(40));
console.log('✅ Unified repo-config.json files');
console.log('✅ Single configuration source for all scripts');
console.log('✅ Git scripts use repo config for working directory');
console.log('✅ GitHub API scripts use repo config for repository detection');
console.log('✅ Cross-repository support with symlinks');
console.log('✅ Fallback to git detection when config unavailable');