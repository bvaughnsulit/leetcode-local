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
exports.getQuestion = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getQuestion = async (slug) => {
    const body = `{
    question(titleSlug: "${slug}") {
      codeSnippets {
        lang
        langSlug
        code
        __typename
      }
      content
      difficulty
      envInfo
      exampleTestcases
      sampleTestCase
      questionId
      solution {
        id
        canSeeDetail
        paidOnly
        hasVideoSolution
        paidOnlyVideo
        __typename
      }
      status
      title
      titleSlug
    }
  }`;
    try {
        console.log('requesting question');
        const response = await (0, node_fetch_1.default)('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com/',
                'Cookie': process.env['COOKIE'] ?? '',
                'x-csrf-token': process.env['X-CSRF_TOKEN'] ?? ''
            },
            body: JSON.stringify({
                query: body,
                variables: {}
            })
        });
        if (response.status === 200) {
            const data = await response.json();
            return data.data.question;
        }
        else {
            const data = await response.text();
            console.log(data);
            throw `${response.status}`;
        }
    }
    catch (e) {
        console.log(e);
        throw 'request failed';
    }
};
exports.getQuestion = getQuestion;
