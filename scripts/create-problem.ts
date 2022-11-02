import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

const dir = path.resolve(__dirname, '../src')


type Question = {
  codeSnippets: { "lang": string, "code": string }[],
  content: string,
  exampleTestcases: string,
  sampleTestCase: string,
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


const createQuestionFile = async (question: Question, dir: string) => {
  // assuming that we're always creating typescript files
  let snippet = question.codeSnippets.find(e => e.lang === "TypeScript")
  fs.writeFileSync(
    path.join(dir, question.titleSlug + '.ts'),
    snippet ? snippet.code : ''
  )
}


(async () => {
  const slug = '3sum-closest';

  const question = await getQuestion(slug)
  createQuestionFile(question, dir)
  // createQuestionTestFile(question, dir)
})()
