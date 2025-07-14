#!/usr/bin/env node
import { auditLog, auditLogBatch } from '../lib/audit.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 5) {
    console.error('Usage: audit-log.js <workflow> <stepType> <context> <filePath> <description>');
    console.error('Example: audit-log.js "COMMIT" "step" "staging" "" "Files staged for commit"');
    process.exit(1);
}

const [workflow, stepType, context, filePath, description] = args;

try {
    const result = await auditLog(workflow, stepType, context, filePath, description);
    if (result.success) {
        // Silent success for bash compatibility
        process.exit(0);
    } else {
        console.error(`Audit log failed: ${result.error}`);
        process.exit(1);
    }
} catch (error) {
    console.error(`Audit log error: ${error.message}`);
    process.exit(1);
}