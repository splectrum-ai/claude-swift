#!/usr/bin/env node
import { auditLog, AuditCollector } from '../lib/audit.js';
import { loadIssueCache, updateIssue, getCacheStats } from '../lib/cache.js';
import { emitEvent, EventTypes, EventCollector } from '../lib/events.js';
import { createTask, listTasks } from '../lib/tasks.js';

async function runAllTests() {
    console.log('🧪 Claude Workflow Scripts - Test Suite\n');
    
    const collector = new AuditCollector();
    const eventCollector = new EventCollector();
    
    try {
        // Test Audit Module
        console.log('📝 Testing Audit Module...');
        collector.add('TEST_SUITE', 'start', 'audit_test', '', 'Testing audit module');
        await testAuditModule();
        collector.add('TEST_SUITE', 'complete', 'audit_test', '', 'Audit module tests passed');
        
        // Test Cache Module  
        console.log('\n💾 Testing Cache Module...');
        collector.add('TEST_SUITE', 'start', 'cache_test', '', 'Testing cache module');
        await testCacheModule();
        collector.add('TEST_SUITE', 'complete', 'cache_test', '', 'Cache module tests passed');
        
        // Test Events Module
        console.log('\n📡 Testing Events Module...');
        collector.add('TEST_SUITE', 'start', 'events_test', '', 'Testing events module');
        await testEventsModule();
        collector.add('TEST_SUITE', 'complete', 'events_test', '', 'Events module tests passed');
        
        // Test Tasks Module
        console.log('\n📋 Testing Tasks Module...');
        collector.add('TEST_SUITE', 'start', 'tasks_test', '', 'Testing tasks module');
        await testTasksModule();
        collector.add('TEST_SUITE', 'complete', 'tasks_test', '', 'Tasks module tests passed');
        
        // Flush audit logs
        console.log('\n📊 Flushing batch logs...');
        const auditResult = await collector.flush();
        const eventResult = await eventCollector.flush();
        console.log(`Audit entries flushed: ${auditResult.count}`);
        console.log(`Event entries flushed: ${eventResult.count}`);
        
        console.log('\n✅ All tests passed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        collector.add('TEST_SUITE', 'error', 'test_failure', '', error.message);
        await collector.flush();
        process.exit(1);
    }
}

async function testAuditModule() {
    const result = await auditLog('TEST', 'item_complete', 'test', '', 'Audit module working');
    if (!result.success) throw new Error('Audit log failed');
    console.log('✓ Single audit log works');
    
    const collector = new AuditCollector();
    collector.add('TEST', 'step1', '', '', 'Step 1');
    collector.add('TEST', 'step2', '', '', 'Step 2');
    if (collector.pending !== 2) throw new Error('Collector count wrong');
    console.log('✓ Audit collector works');
}

async function testCacheModule() {
    const cache = await loadIssueCache();
    console.log(`✓ Loaded issue cache with ${Object.keys(cache).length} issues`);
    
    await updateIssue('9999', {
        title: 'Test Issue',
        state: 'open',
        body: 'Test issue for cache module'
    });
    console.log('✓ Updated test issue in cache');
    
    const stats = await getCacheStats();
    console.log(`✓ Cache stats: ${stats.totalIssues} total, ${stats.openIssues} open`);
}

async function testEventsModule() {
    const result = await emitEvent(
        EventTypes.WORKFLOW_START,
        'test_workflow',
        'testing',
        { test: true }
    );
    if (!result.success) throw new Error('Event emission failed');
    console.log('✓ Event emission works');
    
    const collector = new EventCollector();
    collector.add(EventTypes.CACHE_UPDATED, 'test', 'cache', { updated: 5 });
    if (collector.pending !== 1) throw new Error('Event collector count wrong');
    console.log('✓ Event collector works');
}

async function testTasksModule() {
    const task = await createTask(
        'test-repo',
        'test-task',
        'Test Task Creation',
        'Testing the task creation functionality',
        {
            priority: 'LOW',
            effort: 'S',
            testCriteria: '- [ ] Task created\n- [ ] Task readable'
        }
    );
    console.log(`✓ Created test task: ${task.filename}`);
    
    const tasks = await listTasks();
    console.log(`✓ Listed ${tasks.length} tasks in outbox`);
}

// Run tests
runAllTests().catch(console.error);