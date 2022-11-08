#!/usr/bin/env node
"use strict";
const createProblem = require('../create-problem').createProblem;
const submit = require('../submit').submit;
const problem = process.argv[3];
if (!problem) {
    console.log('problem is required');
}
if (process.argv[2] === '--create') {
    createProblem(problem);
}
else if (process.argv[2] === '--submit') {
    submit(problem);
}
else {
    console.log('--create or --submit argument is required');
}
