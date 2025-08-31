//  name        Generate
//  URI         spl/app/generate
//  type        API Method
//  description This action generates a command from a parsed pipeline.
//              Takes the pipeline created by the parser and creates a reusable command.
///////////////////////////////////////////////////////////////////////////////
const spl = require("spl_lib")
const splApp = require("spl_app_lib");
///////////////////////////////////////////////////////////////////////////////
exports.default = function spl_app_generate (input)
{
    // Get parameters from action configuration
    let actionName = spl.action ( input, "actionName" );
    const filePath = spl.action ( input, "filePath" );
    const appRoot = spl.action ( input, "appRoot" );
    
    // Get folder contents to check for name clashes
    if (!spl.wsExists(input, "spl/blob.usr-modules", "spl/blob/contents", {
        repo: appRoot, dir: "modules/usr", reference: ["spl/blob.usr-modules"]
    }, true)) return;
    
    const usrModules = spl.wsRef(input, "spl/blob.usr-modules");
    const existingFiles = usrModules ? usrModules.value || [] : [];
    
    // Check for name clashes and add number suffix if needed
    let counter = 1;
    let finalActionName = actionName;
    while (existingFiles.includes(`${finalActionName}.js`)) {
        finalActionName = `${actionName}${counter}`;
        counter++;
    }
    actionName = finalActionName;
    
    // Get the parsed pipeline from the workspace
    const splApp = spl.wsRef ( input, "spl/app" );
    const pipeline = splApp.pipeline;
    const globalOptions = splApp.global || {};
    
    // Get the set-pipeline structure from workspace
    const setPipelineData = spl.wsRef ( input, "spl/execute" );
    const setPipeline = setPipelineData.value["set-pipeline"];
    
    // Create the pipeline JSON string for the generated command using the parsed pipeline
    const pipelineJson = JSON.stringify(pipeline, null, 8);
    const globalJson = JSON.stringify(globalOptions, null, 8);
    
    // Create wrapped action that executes the pipeline
    const wrappedActionJs = splApp.generateBatchCommand(actionName, filePath, pipelineJson, globalJson);

    // Create arguments file
    const wrappedArgumentsJson = splApp.generateArgumentsJson(actionName, filePath);

    // Store and write files
    spl.wsSet(input, `spl/blob.${spl.fURI(appRoot, "modules/usr", `${actionName}.js`)}`, { headers: {}, value: wrappedActionJs });
    spl.wsSet(input, `spl/blob.${spl.fURI(appRoot, "modules/usr", `${actionName}_arguments.json`)}`, { headers: {}, value: wrappedArgumentsJson });

    console.log(`Successfully created command from batch ${filePath} as usr/${actionName}`);
    console.log(`Created: modules/usr/${actionName}.js`);
    console.log(`Created: modules/usr/${actionName}_arguments.json`);
    console.log(`Pipeline contains ${pipeline.length} command(s)`);

    spl.history(input, `app/generate: generated command usr/${actionName} with ${pipeline.length} pipeline steps`);
    spl.gotoExecute(input, "spl/blob/put", [
        { repo: appRoot, dir: "modules/usr", file: `${actionName}.js`, encoding: "text" },
        { repo: appRoot, dir: "modules/usr", file: `${actionName}_arguments.json`, encoding: "text" }
    ]);
}
///////////////////////////////////////////////////////////////////////////////