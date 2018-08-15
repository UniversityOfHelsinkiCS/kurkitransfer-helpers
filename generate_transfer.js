const fs = require('fs')
const students = fs.readFileSync('student_numbers.txt', 'latin1').split('\n')

if (process.argv.length < 3) {
  console.log('give date as parameted in form 31.7.2018')
  process.exit(1)
}

const date =  process.argv[2] 

const rows = []

students.forEach(number => {
  if (number.length>0) {
    const row = `${number}#         #6#AYTKT21018#The Elements of AI#${date}#0#Hyv.#106##200475-095J#1#H930#####2,0`
    console.log(row)
    rows.push(row)
  }
})

const fileDate = date.replace('.2018', '.18')

const fileName = `AYTKT21018%${fileDate}-K2-V2018.dat`

fs.writeFileSync(fileName, rows.join('\n'), 'utf8')