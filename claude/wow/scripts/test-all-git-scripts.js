#!/usr/bin/env node

/**
 * Test all git scripts in subproject
 */

import { execSync } from 'child_process';

const subprojectDir = '/home/herma/sesameh/claude-swift/projects/infometish/InfoMetis';

const scripts = [
    'git-info',
    'git-status --short', 
    'git-sync --dry-run'
];

console.log('🔍 Testing git scripts in InfoMetis subproject');
console.log('═'.repeat(60));

for (const script of scripts) {
    console.log(`\n📋 Testing: ${script}`);
    console.log('─'.repeat(40));
    
    try {
        const result = execSync(`node claude/wow/scripts/${script}`, {
            cwd: subprojectDir,
            encoding: 'utf8',
            timeout: 10000
        });
        
        console.log('✅ Success:');
        console.log(result.split('\n').slice(0, 5).join('\n')); // First 5 lines
        
    } catch (error) {
        console.log('❌ Failed:');
        console.log(error.message);
        if (error.stdout) {
            console.log('Stdout:', error.stdout.toString().split('\n').slice(0, 3).join('\n'));
        }
    }
}