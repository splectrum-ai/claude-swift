# SPL Development Essentials

**MANDATORY READ** - SPL is fundamentally different from typical development patterns.

## SPL Execution Model

### Command Execution
```bash
# Development router - ALWAYS use this path
/[repo path]/spl_execute dev [options] <command>

# Pipeline chaining - commands share workspace data
command1 @@ command2 @@ command3

# Debug mode - shows full execution context and workspace
spl_execute [install] -d <command>

# Common options
-v    # Verbose mode
-t    # Test mode
```

### Development Locations
- **Development Work**: `spl-[install]/apps/{app}/modules/` or `spl-[install]/modules/`

## Critical SPL Patterns

### API Method Structure
```javascript
//  name        Method Description
//  URI         api/method/path
//  type        API Method
const spl = require("spl_lib"); // Node.js style require shortcuts via node_modules
///////////////////////////////////////////////////////////////////////////////

exports.default = function api_method_name(input) {
    // Extract parameters individually
    const param1 = spl.action(input, 'param1');
    const param2 = spl.action(input, 'param2');
    
    // Execute business logic (no error handling - SPL manages this)
    const result = processData(param1, param2);
    
    // Log progress
    spl.history(input, `method: completed operation`);
    
    // Mark completion
    spl.completed(input);
}
```

### Absolute SPL Rules
- **NO try/catch blocks** in API methods - SPL framework handles all errors
- **NO defensive programming** - trust inputs, assume success (happy path)
- **NO manual error setting** - never use `spl.rcSet` for error handling
- **Export as `.default`** - SPL expects `require(module).default(input)`
- **NO direct Node.js imports** in API methods - use auxiliary libraries

### Node.js Style Require Pattern
```javascript
// Using Node.js style require shortcuts via spl-dev/node_modules
const spl = require("spl_lib");
const gp_test = require("gp_test_lib");
const gp_fs = require("gp_fs_lib");
```

### Auxiliary Functions Pattern
```javascript
// Keep API methods clean - complex logic goes in auxiliary files
const fs = require('gp_fs_lib');  // Auxiliary library via node_modules

exports.default = function gp_fs_read(input) {
    const file = spl.action(input, 'file');
    const result = fs.readFileWithEncoding(file, input);  // Delegate to lib
    spl.completed(input);
}
```

## Testing Framework

### Complete Test Pipeline
```bash
# New unified test pipeline - single command for complete workflow
spl_execute [install] gp/test/full-run --modules=pattern

# Debug test execution
spl_execute [install] -d gp/test/full-run --modules=gp/fs/write

# Legacy pipeline (still works) - chained commands
spl_execute [install] gp/test/discover --modules=pattern @@ gp/test/plan @@ gp/test/run @@ gp/test/report
```

### Test Types Generated
1. **Instantiation**: Module loads without errors
2. **JSON Validation**: Argument schemas are valid
3. **Basic Test**: Real API execution with assertions

## SPL Debugging Approach

### Standard Debug Process
1. **Start with help**: `spl_execute dev api/method --help`
2. **Use debug mode**: `spl_execute dev -d api/method --params`
3. **Check execution trace**: Look for module loading and context flow
4. **Verify workspace**: Debug shows complete workspace state

### Common Error Patterns & Solutions
```javascript
// Error: "Cannot find module" 
// → Missing Node.js style require shortcut or missing .default export

// Error: "require(...).default is not a function"
// → Missing exports.default or wrong export pattern

// Error: "No discovery data found" in tests
// → Commands run separately, not chained with @@

// Error: "Module not found" in app context
// → App structure wrong or require path calculation off
```

## App vs Module Development Context

### App Module Development (Preferred)
```javascript
// Location: spl-[install]/apps/gp/modules/fs/read/index.js
// Require:  const spl = require("spl_lib"); (Node.js style)
// Benefits: Data isolation, app overlay testing, focused scope
```

### Core Module Development (Legacy)
```javascript
// Location: spl-[install]/modules/spl/execute/index.js  
// Require:  const spl = require("spl_lib"); (Node.js style)
// Use only: When app context not applicable
```

## Workspace API Record Pattern

### Proper Workspace Manipulation
```javascript
// STEP 1: Get existing API record
let apiRecord = spl.wsRef(input, "api/name");
if (!apiRecord) {
    apiRecord = {
        headers: { namespace: { api: { api: "api/name", timestamp: new Date().toISOString() } } },
        value: {}
    };
}

// STEP 2: Update within the record structure
apiRecord.value.newKey = newData;

// STEP 3: Save complete record back
spl.wsSet(input, "api/name", apiRecord);
```

## Development Quality Gates

- [ ] All development tests pass with debug mode
- [ ] Help commands work for all new methods
- [ ] App overlay precedence works correctly  
- [ ] No breaking changes to existing functionality
- [ ] Node.js style require shortcuts verified

---

**Key Principle**: SPL manages complexity at the framework level. API methods should be simple, focused, and trust the framework for error handling, validation, and execution flow.

*This document contains the essential knowledge needed to work effectively with SPL's unique execution model and development patterns.*