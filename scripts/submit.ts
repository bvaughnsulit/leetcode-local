// import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()

// const getQuestion = async (slug: string): Promise<Question> => {
//   
//   const body = `{
//     question(titleSlug: "${slug}") {
//       codeSnippets {
//         lang
//         langSlug
//         code
//         __typename
//       }
//       content
//       difficulty
//       envInfo
//       exampleTestcases
//       sampleTestCase
//       questionId
//       solution {
//         id
//         canSeeDetail
//         paidOnly
//         hasVideoSolution
//         paidOnlyVideo
//         __typename
//       }
//       status
//       title
//       titleSlug
//     }
//   }` 
//
//   const response = await fetch('https://leetcode.com/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Referer': 'https://leetcode.com/',
//       'Cookie': process.env['COOKIE'] ?? '',
//       'x-csrf-token': process.env['X-CSRF_TOKEN'] ??  ''
//     },
//     body: JSON.stringify({
//       query: body,
//       variables: {}
//     })
//   })
//   
//   if (response.status === 200) {
//     const data = await response.json()
//     return data.data.question
//   } else { throw `${response.status} ${response.statusText}` }
// }

;(async () => {
  const arg = process.argv[2] // skip system args
  if (arg !== undefined && arg.length > 0) { 
    const slug = arg.trim()
    const code = await import('../src/' + slug)
    console.log(code, slug)
    return
  }
  else {
    console.log('please provide url slug for problem')
    return
  }
})()
