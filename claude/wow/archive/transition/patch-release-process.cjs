#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Load project configuration
function loadProjectConfig() {
    const config = {};
    
    try {
        // Read version config
        if (fs.existsSync('claude/project/version-config.md')) {
            const versionConfig = fs.readFileSync('claude/project/version-config.md', 'utf8');
            const versionMatch = versionConfig.match(/CURRENT_VERSION.*:\s*(.+)/);
            if (versionMatch) config.version = versionMatch[1].trim();
        }
        
        // Read project info
        if (fs.existsSync('claude/project/project-info.md')) {
            const projectInfo = fs.readFileSync('claude/project/project-info.md', 'utf8');
            const nameMatch = projectInfo.match(/PROJECT_NAME.*:\s*(.+)/);
            if (nameMatch) config.projectName = nameMatch[1].trim();
        }
    } catch (error) {
        console.error('Error loading project configuration:', error.message);
    }
    
    return config;
}

// Execute script with logging
function executeWithLogging(description, command) {
    try {
        console.log(`🔄 ${description}...`);
        execSync(`claude/wow/scripts/audit-log "PATCH_RELEASE" "step" "${description.toLowerCase().replace(/\s+/g, '_')}" "" "${description}"`, { stdio: 'inherit' });
        
        const result = execSync(command, { stdio: 'inherit', encoding: 'utf8' });
        console.log(`✓ ${description} completed`);
        return true;
    } catch (error) {
        console.error(`✗ ${description} failed:`, error.message);
        return false;
    }
}

// Check repository state
function validateRepository() {
    try {
        // Check if repository is clean
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim()) {
            console.log('⚠ Repository has uncommitted changes:');
            console.log(status);
            console.log('Proceeding with patch release...');
        }
        
        // Verify we're on main branch
        const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
        if (branch !== 'main') {
            console.log(`⚠ Current branch: ${branch} (expected: main)`);
        }
        
        return true;
    } catch (error) {
        console.error('Error validating repository:', error.message);
        return false;
    }
}

// Execute project-specific patch release workflow
function executeProjectSpecificWorkflow() {
    const projectWorkflow = 'claude/project/workflows/patch-release.sh';
    
    if (fs.existsSync(projectWorkflow)) {
        console.log('📋 Executing project-specific patch release workflow...');
        return executeWithLogging('Project-specific patch release', projectWorkflow);
    } else {
        console.log('📋 No project-specific patch release workflow found');
        console.log('📋 Standard patch release (no artifacts) - proceeding to GitHub release');
        return true;
    }
}

// Create GitHub release
function createGitHubRelease(config) {
    const version = config.version || 'unknown';
    const projectName = config.projectName || 'Project';
    
    console.log(`🚀 Creating GitHub release for ${projectName} v${version}...`);
    
    // Create and push git tag
    if (!executeWithLogging('Create version tag', `claude/wow/scripts/git-manage release v${version}`)) {
        return false;
    }
    
    // Create GitHub release
    const releaseTitle = `${projectName} v${version}`;
    let releaseCommand = `claude/wow/scripts/gh-release create v${version} --title "${releaseTitle}"`;
    
    // Add release notes if they exist
    if (fs.existsSync('release_notes.md')) {
        releaseCommand += ' --notes-file release_notes.md';
    } else {
        releaseCommand += ` --notes "Patch release ${version}"`;
    }
    
    return executeWithLogging('Create GitHub release', releaseCommand);
}

// Main function
function main() {
    console.log('🔧 PATCH RELEASE: Starting patch release process');
    
    // Load configuration
    const config = loadProjectConfig();
    console.log(`Project: ${config.projectName || 'Unknown'}`);
    console.log(`Version: ${config.version || 'Unknown'}`);
    
    // Step 1: Pre-release validation
    console.log('\n📋 Step 1: Pre-release validation');
    if (!validateRepository()) {
        console.error('❌ Repository validation failed');
        process.exit(1);
    }
    console.log('✓ Repository validation passed');
    
    // Step 2: Commit preparation
    console.log('\n📋 Step 2: Commit preparation');
    const commitMessage = `Prepare for patch release v${config.version || 'unknown'}`;
    if (!executeWithLogging('Commit preparation', `claude/wow/scripts/git-manage commit --message "${commitMessage}"`)) {
        console.log('⚠ Commit preparation failed - continuing with release');
    }
    
    // Step 3: Project-specific release process
    console.log('\n📋 Step 3: Project-specific release process');
    if (!executeProjectSpecificWorkflow()) {
        console.error('❌ Project-specific workflow failed');
        process.exit(1);
    }
    
    // Step 4: GitHub release creation
    console.log('\n📋 Step 4: GitHub release creation');
    if (!createGitHubRelease(config)) {
        console.error('❌ GitHub release creation failed');
        process.exit(1);
    }
    
    // Success
    console.log('\n🎉 PATCH RELEASE COMPLETE');
    console.log(`✓ Patch release v${config.version} created successfully`);
    console.log(`✓ GitHub release published`);
    console.log('\nNext steps:');
    console.log('- Verify release on GitHub');
    console.log('- Update any external references to new version');
    console.log('- Continue with regular development');
}

// Run the script
if (require.main === module) {
    main();
}