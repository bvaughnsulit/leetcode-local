#!/usr/bin/env node
import { createProblem } from '../dist/create-problem'
import { submit } from '../dist/submit'

const problem = process.argv[3]
if (!problem) { console.log('problem is required') }

if (process.argv[2] === '--create') { createProblem(problem) }
else if (process.argv[2] === '--submit') { submit(problem) }
else { console.log('--create or --submit argument is required') }
