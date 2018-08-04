const fs = require('fs')

if (process.argv.length < 3) {
  console.log('give csv file name as parameted')
  process.exit(1)
}

const toGrade = process.argv[2] 

const studentsPassed = require('./suorittajat-2-8-18.json').map(s => s.email.toLowerCase())

const registeredLines = fs.readFileSync(toGrade, 'latin1').split('\n')

registeredLines.shift()

const registeredStudents = registeredLines.map(line => {
  const parts = line.split(';')

  return {
    name: parts[0],
    number: `0${parts[1]}`,
    email: parts[2].replace('\r', '').toLowerCase()
  }
})

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

const filename = `graded/${toGrade.replace('.csv', '.txt')}`

if (fs.existsSync(filename)) {
  console.log('transfer file already created?')
} else {
  const numbers = registeredPassedNotGraded.map(s => s.number).join('\n')
  fs.writeFileSync(filename, numbers, 'utf8')
  fs.writeFileSync('student_numbers.txt', numbers, 'utf8')
}