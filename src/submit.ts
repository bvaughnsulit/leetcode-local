import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import { setTimeout } from 'timers/promises'
import { Question, getQuestion } from './leetcodeApi'
import fs from 'fs'
import path from 'path'

dotenv.config()

const rootDir = process.cwd() || ''
const dir = path.resolve(rootDir, './src/')

type Submission = {
  state: string
}

const submitCode = async (
  slug: string,
  id: string,
  code: string,
): Promise<string> => {

  const url = `https://leetcode.com/problems/${slug}/submit/`
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com/',
      'cookie': process.env['COOKIE'] ?? '',
      'x-csrftoken': process.env['CSRF_TOKEN'] ??  ''
    },
    body: JSON.stringify({
      question_id: id || '',
      lang: "typescript",
      typed_code: code,
    })
  }

  try {
    const response = await fetch(url, request)
    if (response.status === 200) {
      const data = await response.json()
      return data.submission_id
    } else {
      const data = await response.text()
      console.log(request, data)
      throw `${response.status}`
    }
  }
  catch (e) {
    console.log(e)
    throw 'request failed'
  }
}

const checkSubmission = async (submissionId: string): Promise<Submission> => {

  const url = `https://leetcode.com/submissions/detail/${submissionId}/check/`
  const request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com/',
      'cookie': process.env['COOKIE'] ?? '',
      'x-csrftoken': process.env['CSRF_TOKEN'] ??  ''
    }
  }

  try {
    const response = await fetch(url, request)
    if (response.status === 200) {
      const data = await response.json()
      return data
    }
    else {
      const data = await response.text()
      console.log(request, data)
      throw `${response.status}`
    }
  }
  catch (e) {
    console.log(e)
    throw 'request failed'
  }
}


const getSubmissionResult = async (submissionId: string): Promise<Submission> => {
  return new Promise(async (resolve, reject) => {
    let attempts = 0
    let results: Submission = { state: '' }
    const maxAttempts = 20
    while (attempts < maxAttempts && results.state !== 'SUCCESS'){
      results = await checkSubmission(submissionId)
      console.log('...')
      await setTimeout(500)
      attempts++
    }

    if (results.state === 'SUCCESS'){
      resolve(results)
    } else {
      console.log(`submission ${submissionId} not succesful`)
      reject(results)
    }

    if (results.state !== 'SUCCESS'){
      console.log(`error retrieving results for submission ${submissionId}`)
    }
  })
}

const getFile = (filePath: string) => {
  let text = fs.readFileSync(filePath).toString()

  // remove exports by matching 'export' preceded by a newline, and removing
  // that and all following text
  text = text.replace(/\s*import .*\n/,'')

  // remove imports
  text = text.replace(/\s*export .*/,'')
  return text
}

const displayResults = (submissionDetails: Submission): void => {
  console.log(submissionDetails)
}

const submit = async (problem: string) => {
  console.log('starting script...')

  if (problem.length > 0) { 
    const slug = problem.trim()

    const code = getFile(`${dir}/${slug}.ts`)

    const question: Question = await getQuestion(slug)
    const submissionId = await submitCode(slug, question.questionId, code)
    const submissionDetails = await getSubmissionResult(submissionId)
    displayResults(submissionDetails)
    return
  }
  else {
    console.log('please provide url slug for problem')
    return
  }
}

export { submit }
