#!/usr/bin/env node
import { auditLogBatch } from '../lib/audit.js';

// Parse command line arguments for batch entries
const entries = process.argv.slice(2).map(entry => {
    const [workflow, stepType, context, filePath, description] = entry.split('|');
    return { workflow, stepType, context, filePath, description };
});

if (entries.length === 0) {
    console.error('Usage: batch-audit.js "workflow|stepType|context|filePath|description" ...');
    process.exit(1);
}

try {
    const result = await auditLogBatch(entries);
    if (result.success) {
        // Silent success for bash compatibility
        process.exit(0);
    } else {
        console.error(`Batch audit failed: ${result.error}`);
        process.exit(1);
    }
} catch (error) {
    console.error(`Batch audit error: ${error.message}`);
    process.exit(1);
}