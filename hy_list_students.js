const fs = require('fs')

if (process.argv.length < 3) {
  console.log('give csv file name as parameted')
  process.exit(1)
}

const toGrade = process.argv[2] 

const studentsPassed = require('./suorittajat-9-8-18.json').map(s => s.email.toLowerCase())

const registeredLines = fs.readFileSync(toGrade, 'latin1').split('\n')

registeredLines.shift()

const registeredStudents = registeredLines.
  filter(line => line.split(';').length > 2).
  map(line => {
  const parts = line.split(';')

  if (parts[1].length<8) {
    console.log('WARNING: ', parts)
    return {}
  }

  return {
    name: parts[0],
    number: parts[1].startsWith('0') ? parts[1] : `0${parts[1]}`,
    email: parts[2].replace('\r', '').toLowerCase()
  }
  }).filter(s => s.number)

const files = fs.readdirSync('graded').filter(f => f !='.DS_Store')

const alreadyGraded = files.reduce((s, file) => 
  s.concat(fs.readFileSync(`graded/${file}`, 'latin1').split('\n'))
  , []
)

const registeredPassed = registeredStudents
  .filter(s => studentsPassed.includes(s.email))

const registeredPassedNotGraded = registeredPassed
  .filter(s => !alreadyGraded.includes(s.number))

console.log('registeredPassed', registeredPassed.length)
console.log('registeredPassedNotGraded', registeredPassedNotGraded.length)

if (process.argv.length === 4) {
  const registeredProblm = registeredStudents
    .filter(s => !studentsPassed.includes(s.email))
  console.log('registeredProblm', registeredProblm.length)
  console.log(registeredProblm.map(s => s.email).join('\n'))
  process.exit(0)
}

const filename = `graded/${toGrade.replace('.csv', '.txt')}`

if (fs.existsSync(filename)) {
  console.log('transfer file already created?')
} else {
  const numbers = registeredPassedNotGraded.map(s => s.number).join('\n')
  fs.writeFileSync(filename, numbers, 'utf8')
  fs.writeFileSync('student_numbers.txt', numbers, 'utf8')
}