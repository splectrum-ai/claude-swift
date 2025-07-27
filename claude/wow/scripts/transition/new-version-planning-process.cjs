#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Load version configuration
function loadVersionConfig() {
    const config = {};
    
    try {
        if (fs.existsSync('claude/project/version-config.md')) {
            const versionConfig = fs.readFileSync('claude/project/version-config.md', 'utf8');
            
            // Extract target version
            const versionMatch = versionConfig.match(/TARGET_VERSION.*:\s*(.+)/);
            if (versionMatch) config.targetVersion = versionMatch[1].trim();
            
            // Extract version strategy
            const strategyMatch = versionConfig.match(/VERSION_STRATEGY.*:\s*(.+)/);
            if (strategyMatch) config.versionStrategy = strategyMatch[1].trim();
        }
        
        // Load project name if available
        if (fs.existsSync('claude/project/project-info.md')) {
            const projectInfo = fs.readFileSync('claude/project/project-info.md', 'utf8');
            const nameMatch = projectInfo.match(/PROJECT_NAME.*:\s*(.+)/);
            if (nameMatch) config.projectName = nameMatch[1].trim();
        }
    } catch (error) {
        console.error('Error loading version configuration:', error.message);
    }
    
    return config;
}

// Execute step with logging
function executeStep(stepNumber, stepName, action) {
    const stepId = `step_${stepNumber}_${stepName.toLowerCase().replace(/\s+/g, '_')}`;
    
    try {
        console.log(`\n📋 Step ${stepNumber}: ${stepName}`);
        
        // Log step start
        execSync(`claude/wow/scripts/audit-manage log "NEW_VERSION_PLANNING" "step" "${stepId}" "" "Starting ${stepName}"`, { stdio: 'inherit' });
        
        // Execute the action
        const result = action();
        
        if (result) {
            console.log(`✓ ${stepName} completed`);
        } else {
            console.log(`⚠ ${stepName} completed with warnings`);
        }
        
        // Log step completion
        execSync(`claude/wow/scripts/audit-manage log "NEW_VERSION_PLANNING" "step" "${stepId}_complete" "" "Completed ${stepName}"`, { stdio: 'inherit' });
        
        return result;
    } catch (error) {
        console.error(`✗ ${stepName} failed:`, error.message);
        return false;
    }
}

// Step 1: Version Setup
function versionSetup(config) {
    console.log(`🔧 Target Version: ${config.targetVersion || 'not configured'}`);
    console.log(`📋 Version Strategy: ${config.versionStrategy || 'not specified'}`);
    console.log(`📂 Project: ${config.projectName || 'unknown'}`);
    
    if (!config.targetVersion) {
        console.log('⚠ No target version configured in claude/project/version-config.md');
        return false;
    }
    
    // Validate repository state
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
            console.log('⚠ Repository has uncommitted changes - planning can continue');
        }
        console.log('✓ Repository validation completed');
        return true;
    } catch (error) {
        console.log('⚠ Git status check failed - planning can continue');
        return true;
    }
}

// Step 2: Issue Selection
function issueSelection(config) {
    try {
        console.log('🔍 Analyzing issue backlog...');
        
        // Get all open issues
        const openIssues = execSync('claude/wow/scripts/gh-issue list --state open --json number,title,labels', { encoding: 'utf8' });
        const issues = JSON.parse(openIssues);
        
        console.log(`📊 Found ${issues.length} open issues in backlog`);
        
        // Filter issues without milestones (available for planning)
        const unplannedIssues = issues.filter(issue => 
            !issue.labels.some(label => label.name.startsWith('v'))
        );
        
        console.log(`📋 Available for planning: ${unplannedIssues.length} issues`);
        
        if (unplannedIssues.length === 0) {
            console.log('ℹ No unplanned issues available for version selection');
        }
        
        return true;
    } catch (error) {
        console.log('⚠ Issue analysis failed - planning can continue manually');
        console.log('  Use: claude/wow/scripts/gh-issue list to review issues');
        return true;
    }
}

// Step 3: Milestone Creation
function milestoneCreation(config) {
    const targetVersion = config.targetVersion;
    
    if (!targetVersion) {
        console.log('⚠ Cannot create milestone without target version');
        return false;
    }
    
    try {
        console.log(`🎯 Creating milestone: ${targetVersion}`);
        
        // Check if milestone already exists
        try {
            execSync(`claude/wow/scripts/gh-issue milestone view "${targetVersion}"`, { stdio: 'pipe' });
            console.log(`✓ Milestone ${targetVersion} already exists`);
        } catch (error) {
            // Milestone doesn't exist, create it
            const description = `Version ${targetVersion} development milestone`;
            execSync(`claude/wow/scripts/gh-issue milestone create "${targetVersion}" --description "${description}"`, { stdio: 'inherit' });
            console.log(`✓ Created milestone: ${targetVersion}`);
        }
        
        return true;
    } catch (error) {
        console.log(`⚠ Milestone creation failed: ${error.message}`);
        console.log('  Manual creation: gh issue milestone create');
        return false;
    }
}

// Step 4: Label Organization
function labelOrganization(config) {
    const targetVersion = config.targetVersion;
    
    if (!targetVersion) {
        console.log('⚠ Cannot create labels without target version');
        return false;
    }
    
    try {
        console.log(`🏷️ Setting up version label: ${targetVersion}`);
        
        // Create version label if it doesn't exist
        try {
            execSync(`claude/wow/scripts/gh-issue label view "${targetVersion}"`, { stdio: 'pipe' });
            console.log(`✓ Label ${targetVersion} already exists`);
        } catch (error) {
            // Label doesn't exist, create it
            const description = `Version ${targetVersion} issues`;
            execSync(`claude/wow/scripts/gh-issue label create "${targetVersion}" --description "${description}" --color "0366d6"`, { stdio: 'inherit' });
            console.log(`✓ Created label: ${targetVersion}`);
        }
        
        return true;
    } catch (error) {
        console.log(`⚠ Label creation failed: ${error.message}`);
        console.log('  Manual creation: gh issue label create');
        return false;
    }
}

// Step 5: Scope Validation
function scopeValidation(config) {
    console.log('🔍 Validating version scope...');
    
    const targetVersion = config.targetVersion;
    
    if (!targetVersion) {
        console.log('⚠ Cannot validate scope without target version');
        return false;
    }
    
    try {
        // Check milestone issues
        const milestoneIssues = execSync(`claude/wow/scripts/gh-issue list --milestone "${targetVersion}" --json number,title`, { encoding: 'utf8' });
        const issues = JSON.parse(milestoneIssues);
        
        console.log(`📊 Issues assigned to ${targetVersion}: ${issues.length}`);
        
        if (issues.length === 0) {
            console.log('⚠ No issues assigned to version milestone yet');
            console.log('  Use: claude/wow/scripts/gh-issue edit <number> --milestone "' + targetVersion + '"');
        } else {
            console.log('✓ Version has assigned issues for development');
            issues.forEach((issue, index) => {
                console.log(`  ${index + 1}. #${issue.number}: ${issue.title}`);
            });
        }
        
        return true;
    } catch (error) {
        console.log(`⚠ Scope validation failed: ${error.message}`);
        return false;
    }
}

// Main function
function main() {
    console.log('📋 NEW VERSION PLANNING: Starting comprehensive version planning process');
    
    // Load configuration
    const config = loadVersionConfig();
    
    let successCount = 0;
    const totalSteps = 5;
    
    // Execute 5-step planning sequence
    console.log('\n🚀 Executing 5-step planning sequence:');
    
    // Step 1: Version Setup
    if (executeStep(1, 'Version Setup', () => versionSetup(config))) {
        successCount++;
    }
    
    // Step 2: Issue Selection and Analysis
    if (executeStep(2, 'Issue Selection and Analysis', () => issueSelection(config))) {
        successCount++;
    }
    
    // Step 3: Milestone Creation
    if (executeStep(3, 'Milestone Creation', () => milestoneCreation(config))) {
        successCount++;
    }
    
    // Step 4: Label Organization
    if (executeStep(4, 'Label Organization', () => labelOrganization(config))) {
        successCount++;
    }
    
    // Step 5: Scope Validation
    if (executeStep(5, 'Scope Validation', () => scopeValidation(config))) {
        successCount++;
    }
    
    // Summary
    console.log('\n📊 NEW VERSION PLANNING SUMMARY');
    console.log(`✓ Completed: ${successCount}/${totalSteps} steps`);
    console.log(`🎯 Target Version: ${config.targetVersion || 'not configured'}`);
    console.log(`📂 Project: ${config.projectName || 'unknown'}`);
    
    if (successCount === totalSteps) {
        console.log('\n🎉 NEW VERSION PLANNING COMPLETE');
        console.log('✓ Version milestone and labels created');
        console.log('✓ Issue backlog analyzed and ready for assignment');
        console.log('✓ Version scope framework established');
        console.log('\nNext steps:');
        console.log('- Assign issues to version milestone');
        console.log('- Apply version labels to selected issues');
        console.log('- Begin development with clear version scope');
    } else {
        console.log('\n⚠ NEW VERSION PLANNING COMPLETED WITH ISSUES');
        console.log(`${totalSteps - successCount} steps failed or had warnings`);
        console.log('Check configuration and GitHub authentication');
        console.log('\nManual setup may be required for:');
        console.log('- Milestone creation: gh issue milestone create');
        console.log('- Label creation: gh issue label create');
        console.log('- Issue assignment: gh issue edit <number> --milestone');
    }
    
    // Exit with appropriate code
    process.exit(successCount >= 3 ? 0 : 1); // Success if at least 3/5 steps complete
}

// Run the script
if (require.main === module) {
    main();
}