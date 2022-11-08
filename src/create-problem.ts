import path from 'path'
import fs from 'fs'
import { convert } from 'html-to-text'
import { Question, getQuestion } from './leetcode-api'

const rootDir = process.cwd() || ''
const dir = path.resolve(rootDir, './src')


const createQuestionFile = (question: Question, dir: string) => {
  // assuming that we're always creating typescript files
  let snippet = question.codeSnippets.find(e => e.lang === "TypeScript")
  const formatOptions = {
    selectors: [
      { selector: 'p', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
      { selector: 'pre', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } }
    ]
  }

  const fileContents =
`
import 'leetcode-local/globals'
/**
${question.questionId}. ${question.title}
https://leetcode.com/problems/${question.titleSlug}

${convert(question.content, formatOptions)}

**/

${snippet ? snippet.code : ''}

export {}
` 

  fs.writeFileSync(
    path.join(dir, question.titleSlug + '.ts'),
    fileContents,
    { flag: 'wx' }
  )
}


const createQuestionTestFile = (question: Question, dir: string) => {
  const fileContents =
`import 'leetcode-local/globals'
import {} from './${question.titleSlug}'

test('', () => {
  
})

` 

  fs.writeFileSync(
    path.join(dir, question.titleSlug + '.test.ts'), 
    fileContents,
    { flag: 'wx' }
  )
}

const createProblem = async (problem: string) => {
  if (problem.length > 0) { 
    const slug = problem.trim()
    const question: Question = await getQuestion(slug)
    createQuestionFile(question, dir)
    createQuestionTestFile(question, dir)
    console.log('new files created successfully')
    return
  }
  else {
    console.log('please provide url slug for problem')
    return
  }
}


export { Question, getQuestion, createProblem }
