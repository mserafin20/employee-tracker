const inquirer = require('inquirer');
const showTable = require('./utility/table');
const mysql = require('mysql2/promise');

let db;
mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'MovieSequelsUsuallySuck420',
    database: 'employee_db'
  }
)
.then((connection) => {
  db = connection;
  console.log(`Connected to the employee_db database.`)
});

function mainMenu () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit"

      ]
    },
  ])

  .then(answer => {
    if (answer.choice === 'View all departments') {
      viewAllDepartments();
    }
    if (answer.choice === 'View all roles') {
      viewAllRoles();
    }
    if (answer.choice === 'View all employees') {
      viewAllEmployees();
    }
    if (answer.choice === 'Add a department') {
      addDepartment();
    }
    if (answer.choice === 'Add a role') {
      addRole();
    }
    if (answer.choice === 'Add an employee') {
      addEmployee();
    }
    if (answer.choice === 'Update an employee role') {
      updateEmployee();
    }
    if (answer.choice === 'Exit') {
      process.exit();
    }
  })
}

// const dbData = [
//   { id: 1, name: "Anthony"},
//   { id: 2, name: "Myself"},
//   { id: 3, name: "Turtle"},
// ];

const addCourse = async function() {
  //TODO complete adding a course by asking for instructor and course info
  console.log("Test");

  const results = await db.query("SELECT * FROM department");
  const dbData = results[0];
  const choiceData = dbData.map( (row) => ({
    name: row.first_name + " " + row.last_name,
    value: row
  }))
  choiceData.push({
    name: "No Instructor",
    value: {id: null}
  })
  await showTable([{JSON: JSON.stringify(dbData)}]);
  await showTable(dbData);
  
  const firstAnswer = await inquirer.prompt([
    {
      message: "Which instructor will teach this course?",
      type: 'list',
      choices: choiceData,
      name: "instructor"
    }
  ]);
  // console.log(firstAnswer);
  // console.log(firstAnswer.instructor.id);

  const otherData = await inquirer.prompt([
    {
      message: "What is the course title?",
      type: 'input',
      name: "course_title"
    },
    {
      message: "What is the course description?",
      type: 'input',
      name: "course_description"
    },
    {
      message: "Is course active?",
      type: 'choice',
      choices: [0, 1],
      name: "active"
    },
  ]);
  otherData.date_added = "2023-06-06";
  otherData.instructor_id = firstAnswer.instructor.id;
  await showTable([otherData]);
  // console.log(otherData);
  await db.query("INSERT INTO courses SET ?", otherData);
  await menu();
};

const menu = async function () {
  // console.log("Do stuff after!");

  const answers = await inquirer.prompt([
    {
      message: "What do you want...",
      type: 'list',
      name: 'option',
      choices: [
        "Add a course"
      ]
    }
  ])
  if(answers.option === "Add a course"){
    addCourse();
  }
}

const init = async function(){
  // show table is an async function which will look like a promise in console
  // if we print
  await showTable();
  await menu();
}

init();

