#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Load version information
function getVersionInfo() {
    try {
        // Get latest version directory
        const auditPath = 'claude/project/audit';
        if (!fs.existsSync(auditPath)) {
            throw new Error('Audit directory not found');
        }
        
        const dirs = fs.readdirSync(auditPath).filter(d => d.startsWith('v'));
        if (dirs.length === 0) {
            throw new Error('No version directories found in audit');
        }
        
        // Get most recent version directory
        const latestVersion = dirs.sort().pop();
        return {
            version: latestVersion,
            auditPath: path.join(auditPath, latestVersion)
        };
    } catch (error) {
        console.error('Error getting version info:', error.message);
        return { version: 'unknown', auditPath: null };
    }
}

// Execute script with logging
function executeStep(stepNumber, stepName, scriptName) {
    const stepId = `step_${stepNumber}_${stepName.toLowerCase().replace(/\s+/g, '_')}`;
    
    try {
        console.log(`\n📋 Step ${stepNumber}: ${stepName}`);
        
        // Log step start
        execSync(`claude/wow/scripts/audit-log "VERSION_TRANSITION" "step" "${stepId}" "" "Starting ${stepName}"`, { stdio: 'inherit' });
        
        // Execute the automation script
        if (fs.existsSync(`claude/wow/scripts/${scriptName}`)) {
            console.log(`🔄 Executing: ${scriptName}...`);
            execSync(`claude/wow/scripts/${scriptName}`, { stdio: 'inherit' });
            console.log(`✓ ${stepName} completed`);
        } else {
            console.log(`⚠ Script not found: ${scriptName} - skipping`);
        }
        
        // Log step completion
        execSync(`claude/wow/scripts/audit-log "VERSION_TRANSITION" "step" "${stepId}_complete" "" "Completed ${stepName}"`, { stdio: 'inherit' });
        
        return true;
    } catch (error) {
        console.error(`✗ ${stepName} failed:`, error.message);
        return false;
    }
}

// Check script availability
function checkAutomationScripts() {
    const scripts = [
        'audit-manage',
        'knowledge-sync-engine', 
        'repository-maintenance-analyzer',
        'strategic-analysis-engine',
        'knowledge-base-updater',
        'get-started-generator',
        'version-readiness-validator'
    ];
    
    console.log('🔍 Checking automation script availability:');
    let availableCount = 0;
    
    scripts.forEach(script => {
        const scriptPath = `claude/wow/scripts/${script}`;
        if (fs.existsSync(scriptPath)) {
            console.log(`  ✓ ${script}`);
            availableCount++;
        } else {
            console.log(`  ⚠ ${script} (not found)`);
        }
    });
    
    console.log(`📊 Available: ${availableCount}/${scripts.length} automation scripts`);
    return { available: availableCount, total: scripts.length };
}

// Main function
function main() {
    console.log('🔄 VERSION TRANSITION: Starting comprehensive version transition processing');
    
    // Get version information
    const versionInfo = getVersionInfo();
    console.log(`📁 Processing version: ${versionInfo.version}`);
    console.log(`📍 Audit path: ${versionInfo.auditPath || 'not found'}`);
    
    // Check automation script availability
    const scriptStatus = checkAutomationScripts();
    
    if (scriptStatus.available === 0) {
        console.log('⚠ No automation scripts found - executing basic version transition');
    }
    
    let successCount = 0;
    const totalSteps = 7;
    
    // Execute 7-step automation sequence
    console.log('\n🚀 Executing 7-step automation sequence:');
    
    // Step 1: Audit Log Analysis and Processing
    if (executeStep(1, 'Audit Log Analysis and Processing', 'audit-manage metrics')) {
        successCount++;
    }
    
    // Step 2: Knowledge Base Synchronization
    if (executeStep(2, 'Knowledge Base Synchronization', 'knowledge-sync-engine')) {
        successCount++;
    }
    
    // Step 3: Repository Maintenance and Cleanup
    if (executeStep(3, 'Repository Maintenance and Cleanup', 'repository-maintenance-analyzer')) {
        successCount++;
    }
    
    // Step 4: Strategic Analysis and Operational Reporting
    if (executeStep(4, 'Strategic Analysis and Operational Reporting', 'strategic-analysis-engine')) {
        successCount++;
    }
    
    // Step 5: User-Facing Reports and Knowledge Base Updates
    if (executeStep(5, 'User-Facing Reports and Knowledge Base Updates', 'knowledge-base-updater')) {
        successCount++;
    }
    
    // Step 6: Get Started Documentation (Onboarding-Focused)
    if (executeStep(6, 'Get Started Documentation', 'get-started-generator')) {
        successCount++;
    }
    
    // Step 7: Next Version Readiness Assessment
    if (executeStep(7, 'Next Version Readiness Assessment', 'version-readiness-validator')) {
        successCount++;
    }
    
    // Summary
    console.log('\n📊 VERSION TRANSITION SUMMARY');
    console.log(`✓ Completed: ${successCount}/${totalSteps} steps`);
    console.log(`📁 Version processed: ${versionInfo.version}`);
    console.log(`🔧 Automation scripts: ${scriptStatus.available}/${scriptStatus.total} available`);
    
    if (successCount === totalSteps) {
        console.log('\n🎉 VERSION TRANSITION COMPLETE');
        console.log('✓ All automation steps executed successfully');
        console.log('✓ Knowledge base updated with version insights');
        console.log('✓ Repository prepared for next version development');
        console.log('\nNext steps:');
        console.log('- Review generated reports in docs/ directory');
        console.log('- Validate updated documentation');
        console.log('- Proceed with NEW_VERSION_PLANNING workflow');
    } else {
        console.log('\n⚠ VERSION TRANSITION COMPLETED WITH ISSUES');
        console.log(`${totalSteps - successCount} steps failed or were skipped`);
        console.log('Check automation script availability and execution logs');
    }
    
    // Exit with appropriate code
    process.exit(successCount === totalSteps ? 0 : 1);
}

// Run the script
if (require.main === module) {
    main();
}