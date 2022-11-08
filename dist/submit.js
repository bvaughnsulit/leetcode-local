"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submit = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv = __importStar(require("dotenv"));
const promises_1 = require("timers/promises");
const leetcodeApi_1 = require("./leetcodeApi");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv.config();
const rootDir = process.cwd() || '';
const dir = path_1.default.resolve(rootDir, './src/');
const submitCode = async (slug, id, code) => {
    const url = `https://leetcode.com/problems/${slug}/submit/`;
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com/',
            'cookie': process.env['COOKIE'] ?? '',
            'x-csrftoken': process.env['CSRF_TOKEN'] ?? ''
        },
        body: JSON.stringify({
            question_id: id || '',
            lang: "typescript",
            typed_code: code,
        })
    };
    try {
        const response = await (0, node_fetch_1.default)(url, request);
        if (response.status === 200) {
            const data = await response.json();
            return data.submission_id;
        }
        else {
            const data = await response.text();
            console.log(request, data);
            throw `${response.status}`;
        }
    }
    catch (e) {
        console.log(e);
        throw 'request failed';
    }
};
const checkSubmission = async (submissionId) => {
    const url = `https://leetcode.com/submissions/detail/${submissionId}/check/`;
    const request = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com/',
            'cookie': process.env['COOKIE'] ?? '',
            'x-csrftoken': process.env['CSRF_TOKEN'] ?? ''
        }
    };
    try {
        const response = await (0, node_fetch_1.default)(url, request);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        else {
            const data = await response.text();
            console.log(request, data);
            throw `${response.status}`;
        }
    }
    catch (e) {
        console.log(e);
        throw 'request failed';
    }
};
const getSubmissionResult = async (submissionId) => {
    return new Promise(async (resolve, reject) => {
        let attempts = 0;
        let results = { state: '' };
        const maxAttempts = 20;
        while (attempts < maxAttempts && results.state !== 'SUCCESS') {
            results = await checkSubmission(submissionId);
            console.log('...');
            await (0, promises_1.setTimeout)(500);
            attempts++;
        }
        if (results.state === 'SUCCESS') {
            resolve(results);
        }
        else {
            console.log(`submission ${submissionId} not succesful`);
            reject(results);
        }
        if (results.state !== 'SUCCESS') {
            console.log(`error retrieving results for submission ${submissionId}`);
        }
    });
};
const getFile = (filePath) => {
    let text = fs_1.default.readFileSync(filePath).toString();
    // remove exports by matching 'export' preceded by a newline, and removing
    // that and all following text
    text = text.replace(/\s*import .*\n/, '');
    // remove imports
    text = text.replace(/\s*export .*/, '');
    return text;
};
const displayResults = (submissionDetails) => {
    console.log(submissionDetails);
};
const submit = async (problem) => {
    console.log('starting script...');
    if (problem.length > 0) {
        const slug = problem.trim();
        const code = getFile(`${dir}/${slug}.ts`);
        const question = await (0, leetcodeApi_1.getQuestion)(slug);
        const submissionId = await submitCode(slug, question.questionId, code);
        const submissionDetails = await getSubmissionResult(submissionId);
        displayResults(submissionDetails);
        return;
    }
    else {
        console.log('please provide url slug for problem');
        return;
    }
};
exports.submit = submit;
