const fs = require('fs')

const toStudNr = (s) => {
  if (s.student_number.startsWith('01') && s.student_number.length === 9 ) {
    return s.student_number
  }

  if (s.login.startsWith('01') && s.login.length === 9) {
    s.login
  } 

  return null
}

const studentsPassed = require('./suorittajat-9-8-18.json')

const studentNumbersPassed = studentsPassed.filter(s => toStudNr(s) != null).map(toStudNr)

const files = fs.readdirSync('graded').filter(f => f !='.DS_Store')

const alreadyGraded = files.reduce((s, file) => 
  s.concat(fs.readFileSync(`graded/${file}`, 'latin1').split('\n'))
  , []
)

const passedNotGraded = studentNumbersPassed
  .filter(s => !alreadyGraded.includes(s))

console.log('passed', studentNumbersPassed.length)
console.log('passedNotGraded', passedNotGraded.length)


if (passedNotGraded.length === 0 ) {
  process.exit(1)
}

if (process.argv.length<3 ) {
  console.log('give date as ddmmyy')
  process.exit(1)
}

const filename = `graded/${process.argv[2]}`

if (fs.existsSync(filename)) {
  console.log('transfer file already created?')
} else {
  const numbers = passedNotGraded.join('\n')
  fs.writeFileSync(filename, numbers, 'utf8')
  fs.writeFileSync('student_numbers.txt', numbers, 'utf8')
  console.log('transfer file created')
}