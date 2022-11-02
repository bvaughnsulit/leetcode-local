import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { convert } from 'html-to-text'

dotenv.config()

const dir = path.resolve(__dirname, '../src')

type Question = {
  codeSnippets: { "lang": string, "code": string }[],
  content: string,
  questionId: string,
  status: string,
  title: string,
  titleSlug: string,
}


const getQuestion = async (slug: string): Promise<Question> => {
  
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
  }` 

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com/',
      'Cookie': process.env['COOKIE'] ?? '',
      'x-csrf-token': process.env['X-CSRF_TOKEN'] ??  ''
    },
    body: JSON.stringify({
      query: body,
      variables: {}
    })
  })
  
  if (response.status === 200) {
    const data = await response.json()
    return data.data.question
  } else { throw `${response.status} ${response.statusText}` }
}


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
`/**
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
`import {} from './${question.titleSlug}'

test('', () => {
  
})

` 

  fs.writeFileSync(
    path.join(dir, question.titleSlug + '.test.ts'), 
    fileContents,
    { flag: 'wx' }
  )
}

(async () => {
  const arg = process.argv[2] // skip system args
  if (arg !== undefined && arg.length > 0) { 
    const slug = arg.trim()
    const question = await getQuestion(slug)
    createQuestionFile(question, dir)
    createQuestionTestFile(question, dir)
    console.log('new files created successfully')
    return
  }
  else {
    console.log('please provide url slug for problem')
    return
  }
})()
