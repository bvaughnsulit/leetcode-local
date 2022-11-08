import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()

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
  
  try {
    console.log('requesting question')
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
    }
    else {
      const data = await response.text()
      console.log(data)
      throw `${response.status}`
    }
  }
  catch (e) {
    console.log(e)
    throw 'request failed'
  }
}

export { Question, getQuestion }
