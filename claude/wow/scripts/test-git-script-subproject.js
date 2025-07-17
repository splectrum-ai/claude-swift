#!/usr/bin/env node

/**
 * Test git-info script execution in subproject
 */

import { execSync } from 'child_process';

const subprojectDir = '/home/herma/sesameh/claude-swift/projects/infometish/InfoMetis';

console.log('🔍 Testing git-info script in InfoMetis subproject');
console.log('═'.repeat(50));

try {
    // Execute git-info script from within the subproject directory
    const result = execSync('node claude/wow/scripts/git-info', {
        cwd: subprojectDir,
        encoding: 'utf8'
    });
    
    console.log('✅ Script executed successfully:');
    console.log(result);
    
} catch (error) {
    console.log('❌ Script execution failed:');
    console.log(error.message);
    console.log('\nStderr:', error.stderr?.toString());
    console.log('Stdout:', error.stdout?.toString());
}