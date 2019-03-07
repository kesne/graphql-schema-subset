#!/usr/bin/env node
import yargs from 'yargs';
import path from 'path';
import fs, { writeFileSync } from 'fs';
import { promisify } from 'util';
import schemaSubset from './schemaSubset';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const { argv } = yargs
  .option('schema', {
    alias: 's',
    describe: 'provide a path to the schema file',
    type: 'string',
  })
  .option('output-file', {
    alias: 'o',
    describe: 'provide a path to the output schema file',
    type: 'string',
  })
  .option('remove-deprecated', {
    alias: 'd',
    describe: 'remove any deprecated fields from the schema',
    type: 'boolean',
  })
  .option('keep-queries', {
    alias: 'q',
    describe: 'keep the provided queries by name',
    type: 'string',
  })
  .option('keep-mutations', {
    alias: 'm',
    describe: 'keep the provided mutations by name',
    type: 'string',
  })
  .option('keep-subscriptions', {
    alias: 'u',
    describe: 'keep the provided subscriptions by name',
    type: 'string',
  })
  .array('keep-queries')
  .array('keep-mutations')
  .array('keep-subscriptions')
  .coerce(['schema', 'output-file'], path.resolve)
  .demandOption(['schema', 'output-file'])
  .help();

async function main() {
  const schemaText = await readFileAsync(argv.schema, 'utf8');
  const schemaSubsetText = schemaSubset(schemaText, {
    removeDeprecated: argv["remove-deprecated"],
    keepQueries: argv["keep-queries"],
    keepMutations: argv["keep-mutations"],
    keepSubscriptions: argv["keep-subscriptions"]
  });
  await writeFileSync(argv["output-file"], schemaSubsetText);
  console.log('✨  Schema subset generated.')
}

main();
