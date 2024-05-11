#!/usr/bin/env node

const {Command} = require("commander");
const {handleToJSON} = require("./converter.js");

const pkgJSON = require("../package.json");

const program = new Command();

program
    .name(pkgJSON.name)
    .description(pkgJSON.description)
    .version(pkgJSON.version)

program.command('toJSON')
    .description("Converts a troy file to a JSON file.")
    .argument("<path>", "Path to the file to convert.")
    .action(handleToJSON);

program.parse();
