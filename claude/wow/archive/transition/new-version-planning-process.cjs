#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Load version configuration
function loadVersionConfig() {
    const config = {};
    
    try {
        if (fs.existsSync('claude/project/version-config.md')) {
            const versionConfig = fs.readFileSync('claude/project/version-config.md', 'utf8');
            
            // Extract current and target versions
            const currentMatch = versionConfig.match(/CURRENT_VERSION.*:\s*(.+)/);
            const targetMatch = versionConfig.match(/TARGET_VERSION.*:\s*(.+)/);
            
            if (currentMatch) config.currentVersion = currentMatch[1].trim();
            if (targetMatch) config.targetVersion = targetMatch[1].trim();
            
            // Auto-increment version after release: current becomes target, target becomes next version
            if (config.currentVersion && config.targetVersion) {
                console.log(`🔄 Post-release version transition: ${config.currentVersion} → ${config.targetVersion} → next`);
                
                // Parse target version and increment minor version for next target
                const versionParts = config.targetVersion.split('.');
                if (versionParts.length >= 2) {
                    const major = parseInt(versionParts[0]);
                    const minor = parseInt(versionParts[1]);
                    const nextVersion = `${major}.${minor + 1}.0`;
                    
                    console.log(`📈 Version transition: current=${config.targetVersion}, next target=${nextVersion}`);
                    
                    // Update both current and target versions
                    let updatedConfig = versionConfig.replace(
                        /\*\*CURRENT_VERSION\*\*:\s*(.+)/,
                        `**CURRENT_VERSION**: ${config.targetVersion}`
                    );
                    updatedConfig = updatedConfig.replace(
                        /\*\*TARGET_VERSION\*\*:\s*(.+)/,
                        `**TARGET_VERSION**: ${nextVersion}`
                    );
                    
                    fs.writeFileSync('claude/project/version-config.md', updatedConfig);
                    console.log(`✓ Updated version config: CURRENT_VERSION = ${config.targetVersion}, TARGET_VERSION = ${nextVersion}`);
                    
                    // Update config object for this run
                    config.currentVersion = config.targetVersion;
                    config.targetVersion = nextVersion;
                }
            }
            
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
        
        // Get all open issues using local issue management
        const openIssues = execSync('claude/wow/scripts/issue-manage list all', { encoding: 'utf8' });
        console.log('Issue backlog analysis completed');
        
        // Check for unassigned issues (available for planning)
        const fs = require('fs');
        const unassignedPath = 'claude/issues/unassigned';
        if (fs.existsSync(unassignedPath)) {
            const unassignedFiles = fs.readdirSync(unassignedPath).filter(f => f.endsWith('.md'));
            console.log(`📋 Available for planning: ${unassignedFiles.length} unassigned issues`);
            
            if (unassignedFiles.length === 0) {
                console.log('ℹ No unassigned issues available for version selection');
            }
        } else {
            console.log('📋 No unassigned issues directory found');
        }
        
        return true;
    } catch (error) {
        console.log('⚠ Issue analysis failed - planning can continue manually');
        console.log('  Use: claude/wow/scripts/issue-manage list to review issues');
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
        
        // Check if milestone directory already exists
        const fs = require('fs');
        const milestonePath = `claude/issues/${targetVersion}`;
        
        if (fs.existsSync(milestonePath)) {
            console.log(`✓ Milestone directory ${targetVersion} already exists`);
        } else {
            // Create milestone directory
            fs.mkdirSync(milestonePath, { recursive: true });
            console.log(`✓ Created milestone directory: ${targetVersion}`);
        }
        
        return true;
    } catch (error) {
        console.log(`⚠ Milestone creation failed: ${error.message}`);
        console.log('  Manual creation: mkdir claude/issues/' + targetVersion);
        return false;
    }
}

// Step 4: Label Organization
function labelOrganization(config) {
    const targetVersion = config.targetVersion;
    
    if (!targetVersion) {
        console.log('⚠ Cannot add labels without target version');
        return false;
    }
    
    try {
        console.log(`🏷️ Setting up version label for issues: ${targetVersion}`);
        
        const fs = require('fs');
        const path = require('path');
        const milestonePath = `claude/issues/${targetVersion}`;
        
        if (!fs.existsSync(milestonePath)) {
            console.log(`⚠ Milestone directory ${targetVersion} doesn't exist yet`);
            return true; // Not an error, just nothing to label yet
        }
        
        // Get all issue files in the milestone directory
        const issueFiles = fs.readdirSync(milestonePath)
            .filter(f => f.endsWith('.md'));
            
        if (issueFiles.length === 0) {
            console.log(`✓ No issues in ${targetVersion} to label yet`);
            return true;
        }
        
        let labeledCount = 0;
        
        // Add version label to each issue's frontmatter
        for (const file of issueFiles) {
            const filepath = path.join(milestonePath, file);
            const content = fs.readFileSync(filepath, 'utf8');
            
            // Extract current labels from frontmatter
            const labelsMatch = content.match(/labels:\s*"?(\[.*?\])"?/);
            let labels = [];
            
            if (labelsMatch) {
                try {
                    labels = JSON.parse(labelsMatch[1]);
                } catch (error) {
                    // Invalid JSON, start fresh
                    labels = [];
                }
            }
            
            // Add version label if not already present
            if (!labels.includes(targetVersion)) {
                labels.push(targetVersion);
                
                // Update frontmatter
                const updatedContent = updateFrontmatter(content, {
                    labels: JSON.stringify(labels)
                });
                
                fs.writeFileSync(filepath, updatedContent);
                labeledCount++;
            }
        }
        
        console.log(`✓ Added ${targetVersion} label to ${labeledCount} issues`);
        return true;
        
    } catch (error) {
        console.log(`⚠ Label organization failed: ${error.message}`);
        console.log('  Manual labeling: Edit issue frontmatter to add version label');
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
        // Check milestone directory for issues
        const fs = require('fs');
        const path = require('path');
        const milestonePath = `claude/issues/${targetVersion}`;
        
        if (!fs.existsSync(milestonePath)) {
            console.log(`⚠ No milestone directory ${targetVersion} found`);
            console.log('  Create directory: mkdir claude/issues/' + targetVersion);
            return false;
        }
        
        // Get all issue files in the milestone directory
        const issueFiles = fs.readdirSync(milestonePath)
            .filter(f => f.endsWith('.md'));
        
        console.log(`📊 Issues assigned to ${targetVersion}: ${issueFiles.length}`);
        
        if (issueFiles.length === 0) {
            console.log('⚠ No issues assigned to version milestone yet');
            console.log('  Move issues from unassigned: mv claude/issues/unassigned/xxx-*.md claude/issues/' + targetVersion + '/');
        } else {
            console.log('✓ Version has assigned issues for development');
            
            // Show issue titles
            issueFiles.forEach((file, index) => {
                const content = fs.readFileSync(path.join(milestonePath, file), 'utf8');
                const titleMatch = content.match(/title: "(.*)"/);
                const title = titleMatch ? titleMatch[1] : 'No title';
                const id = file.split('-')[0];
                
                console.log(`  ${index + 1}. ${id}: ${title}`);
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
        console.log('✓ Version milestone directory created');
        console.log('✓ Issue backlog analyzed and ready for organization');
        console.log('✓ Version scope framework established');
        console.log('\nNext steps:');
        console.log('- Move issues to version milestone directory: mv claude/issues/unassigned/xxx-*.md claude/issues/' + config.targetVersion + '/');
        console.log('- Version labels will be automatically added to issues in milestone directory');
        console.log('- Begin development with clear version scope');
    } else {
        console.log('\n⚠ NEW VERSION PLANNING COMPLETED WITH ISSUES');
        console.log(`${totalSteps - successCount} steps failed or had warnings`);
        console.log('Check configuration and GitHub authentication');
        console.log('\nManual setup may be required for:');
        console.log('- Milestone creation: mkdir claude/issues/' + (config.targetVersion || 'vX.X.X'));
        console.log('- Issue organization: mv claude/issues/unassigned/xxx-*.md claude/issues/' + (config.targetVersion || 'vX.X.X') + '/');
        console.log('- Label management: Edit issue frontmatter to add version labels');
    }
    
    // Exit with appropriate code
    process.exit(successCount >= 3 ? 0 : 1); // Success if at least 3/5 steps complete
}

// Run the script
if (require.main === module) {
    main();
}