#!/usr/bin/env node
import { auditLog, auditLogBatch, AuditCollector, readRecentEntries } from '../lib/audit.js';

async function testAudit() {
    console.log('Testing Claude Workflow Scripts - Audit Module\n');
    
    // Test 1: Single audit log
    console.log('1. Testing single audit log entry:');
    const result1 = await auditLog('TEST', 'step', 'testing', '', 'Testing single audit log');
    console.log('Result:', result1);
    
    // Test 2: Batch audit log
    console.log('\n2. Testing batch audit log:');
    const batchEntries = [
        { workflow: 'TEST', stepType: 'step', context: 'batch1', filePath: '', description: 'Batch entry 1' },
        { workflow: 'TEST', stepType: 'step', context: 'batch2', filePath: '', description: 'Batch entry 2' },
        { workflow: 'TEST', stepType: 'complete', context: 'batch3', filePath: '', description: 'Batch complete' }
    ];
    const result2 = await auditLogBatch(batchEntries);
    console.log('Result:', result2);
    
    // Test 3: Audit collector
    console.log('\n3. Testing audit collector:');
    const collector = new AuditCollector();
    collector
        .add('WORKFLOW1', 'start', 'init', '', 'Starting workflow 1')
        .add('WORKFLOW1', 'step', 'process', 'file.txt', 'Processing file')
        .add('WORKFLOW1', 'complete', 'done', '', 'Workflow complete');
    
    console.log(`Pending entries: ${collector.pending}`);
    const result3 = await collector.flush();
    console.log('Flush result:', result3);
    console.log(`Pending after flush: ${collector.pending}`);
    
    // Test 4: Read recent entries
    console.log('\n4. Reading recent audit log entries:');
    const recent = await readRecentEntries(5);
    recent.forEach(entry => console.log(entry));
    
    console.log('\n✅ Audit module tests complete!');
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testAudit().catch(console.error);
}