import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()

const submitCode = async (
  slug: string,
  code: string,
  id?: string
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


;(async () => {
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
    const id = '121'
    console.log(code)
    const submissionId = await submitCode(slug, code, id)
    console.log(submissionId)
    return
  }
  else {
    console.log('please provide url slug for problem')
    return
  }
})()
