//  name        Test Module Instantiation
//  URI         gp/test/test-instantiation
//  type        API Method
//  description Tests that modules can be required without errors
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib");
const testLib = require("gp_test_lib");
///////////////////////////////////////////////////////////////////////////////

// IMPLEMENTATION - Module Instantiation Testing (Blanket Coverage: All)
exports.default = function gp_test_test_instantiation(input) {
    const testApiRecord = spl.wsRef(input, "gp/test");
    
    // Process all request records (blanket coverage: all)
    for (const requestKey in testApiRecord.value) {
        const requestRecord = testApiRecord.value[requestKey];
        const workPackages = requestRecord.value.plan?.workPackages || [];
        const keyResults = [];
        
        // Process all instantiation work packages in this request
        for (const workPackage of workPackages) {
            if (workPackage.type === 'instantiation') {
                for (const filePath of workPackage.filePaths) {
                    const startTime = Date.now();
                    
                    // Use auxiliary function to require module with cache clearing (SPL happy path)
                    const module = testLib.requireModule(filePath);
                    
                    if (module === undefined || module === null) {
                        keyResults.push({
                            type: 'instantiation',
                            filePath: filePath,
                            status: 'FAIL',
                            message: 'Module failed to load (syntax error, missing exports, or require failure)',
                            duration: Date.now() - startTime,
                            timestamp: new Date().toISOString()
                        });
                    } else {
                        keyResults.push({
                            type: 'instantiation',
                            filePath: filePath,
                            status: 'PASS',
                            message: 'Module instantiated successfully',
                            duration: Date.now() - startTime,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }
        }
        
        // Store results in the request record using test type name
        if (keyResults.length > 0) {
            if (!requestRecord.value.results) {
                requestRecord.value.results = {};
            }
            requestRecord.value.results.instantiation = {
                results: keyResults,
                summary: {
                    total: keyResults.length,
                    passed: keyResults.filter(r => r.status === 'PASS').length,
                    failed: keyResults.filter(r => r.status === 'FAIL').length
                },
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // Save updated test API record
    spl.wsSet(input, "gp/test", testApiRecord);
    
    spl.history(input, `test-instantiation: Completed module instantiation validation`);
    spl.completed(input);
}
///////////////////////////////////////////////////////////////////////////////