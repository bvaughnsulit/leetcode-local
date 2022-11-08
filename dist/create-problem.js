"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProblem = exports.getQuestion = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const html_to_text_1 = require("html-to-text");
const leetcode_api_1 = require("./leetcode-api");
Object.defineProperty(exports, "getQuestion", { enumerable: true, get: function () { return leetcode_api_1.getQuestion; } });
const rootDir = process.cwd() || '';
const dir = path_1.default.resolve(rootDir, './src');
const createQuestionFile = (question, dir) => {
    // assuming that we're always creating typescript files
    let snippet = question.codeSnippets.find(e => e.lang === "TypeScript");
    const formatOptions = {
        selectors: [
            { selector: 'p', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
            { selector: 'pre', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } }
        ]
    };
    const fileContents = `/**
${question.questionId}. ${question.title}
https://leetcode.com/problems/${question.titleSlug}

${(0, html_to_text_1.convert)(question.content, formatOptions)}

**/

${snippet ? snippet.code : ''}

export {}
`;
    fs_1.default.writeFileSync(path_1.default.join(dir, question.titleSlug + '.ts'), fileContents, { flag: 'wx' });
};
const createQuestionTestFile = (question, dir) => {
    const fileContents = `import {} from './${question.titleSlug}'

test('', () => {
  
})

`;
    fs_1.default.writeFileSync(path_1.default.join(dir, question.titleSlug + '.test.ts'), fileContents, { flag: 'wx' });
};
const createProblem = async (problem) => {
    if (problem.length > 0) {
        const slug = problem.trim();
        const question = await (0, leetcode_api_1.getQuestion)(slug);
        createQuestionFile(question, dir);
        createQuestionTestFile(question, dir);
        console.log('new files created successfully');
        return;
    }
    else {
        console.log('please provide url slug for problem');
        return;
    }
};
exports.createProblem = createProblem;
