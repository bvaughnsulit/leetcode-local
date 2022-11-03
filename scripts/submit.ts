import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import { setTimeout } from 'timers/promises'
import { Question, getQuestion } from './leetcodeApi'

dotenv.config()

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


const getSubmissionResult = async (submissionId: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let attempts = 0
    let results: Submission = { state: '' }

    while (attempts < 10 && results.state !== 'SUCCESS'){
      results = await checkSubmission(submissionId)
      console.log('...')
      await setTimeout(500)
      attempts++
    }

    if (results.state === 'SUCCESS'){
      resolve(results)
    } else {
      reject(results)
    }
  })
}


;(async () => {
  console.log('starting script...')
  const arg = process.argv[2] // skip system args
  if (arg !== undefined && arg.length > 0) { 
    const slug = arg.trim()
    const module = await import('../src/' + slug)
    type ModuleType = typeof module
    const exports: ModuleType = module

    let code = ''
    for (const element of Object.values(exports)) {
      if (typeof element === 'function') {
        code += element.toString()
      }
    }
    const question: Question = await getQuestion(slug)
    const submissionId = await submitCode(slug, question.questionId, code)
    const submissionDetails = await getSubmissionResult(submissionId)
    console.log(submissionDetails)
    return
  }
  else {
    console.log('please provide url slug for problem')
    return
  }
})()
