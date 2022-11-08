# leetcode-local

## features:
- download specified problems from leetcode to a local repository
- submit problems via the command line

## installation:
```
npm i leetcode-local
```

add the following scripts to your `package.json`:
```
// package.json
"scripts": {
  "create": "leetcode-local --create",
  "submit": "leetcode-local --submit"
},
...
```

## usage
```
// download problem to your local repository
npm run create two-sum

// submit your solution to leetcode
npm run submit two-sum
```
