const inquirer = require('inquirer');
const showTable = require('./utility/table');
const mysql = require('mysql2/promise');
const { table } = require('table');



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

const mainMenu = async function () {
  const choices = await inquirer.prompt([
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

    // if (choices.options === 'View all departments') {
    //   viewAllDepartments();
    //   await mainMenu();
    // } else if (choices.options === 'View all roles') {
    //   viewAllRoles();
    //   await mainMenu();
    // } else if (choices.options === 'View all employees') {
    //   viewAllEmployees();
    //   await mainMenu();
    // } else if (choices.options === 'Add a department') {
    //   addDepartment();
    //   await mainMenu();
    // } else if (choices.options === 'Add a role') {
    //   addRole();
    //   await mainMenu();
    // } else if (choices.options === 'Add an employee') {
    //   addEmployee();
    //   await mainMenu();
    // } else if (choices.options === 'Update an employee role') {
    //   updateEmployee();
    //   await mainMenu();
    // } else { 
    //   await process.exit();
    //   await mainMenu();
    // }
    if (choices.options === 'View all departments') {
      viewAllDepartments();
      await mainMenu();
    } else if (choices.options === 'View all roles') {
      viewAllRoles();
      await mainMenu();
    } else if (choices.options === 'View all employees') {
      viewAllEmployees();
      await mainMenu();
    } else if (choices.options === 'Add a department') {
      addDepartment();
      await mainMenu();
    } else if (choices.options === 'Add a role') {
      addRole();
      await mainMenu();
    } else if (choices.options === 'Add an employee') {
      addEmployee();
      await mainMenu();
    } else  {
      updateEmployee();
      await mainMenu();
    } 
  }




// function to view the data in the department table
const viewAllDepartments = async function () {
  const results = await db.query("SELECT * FROM department");
  const dbData = results[0];
  showTable(dbData);
};

// function to view data in the role table
const viewAllRoles = async function () {
  const results = await db.query("SELECT * FROM role");
  const dbData = results[0];
  showTable(dbData);
};

// function to view data in the employee table
const viewAllEmployees = async function () {
  const results = await db.query("SELECT * FROM employee");
  const dbData = results[0];
  showTable(dbData);
};

// function to add a department based on user input
const addDepartment = async function () {
  const departmentData = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What department would you like to add?"
    }
  ]);
  await inquirer.prompt([
    {
      type: "input",
      name: "enter",
      message: `Successfully added department "${departmentData.name}" into database. Press enter to continue.`
    }
  ]);
  await showTable([departmentData]);
  await db.query("INSERT INTO department SET ?", departmentData);
};

// function to update an employee role using input from the user
const updateEmployee = async function () {
  console.log("test");
}


// const addCourse = async function() {
//   //TODO complete adding a course by asking for instructor and course info
//   console.log("Test");

//   const results = await db.query("SELECT * FROM department");
//   const dbData = results[0];
//   const choiceData = dbData.map( (row) => ({
//     name: row.first_name + " " + row.last_name,
//     value: row
//   }))
//   choiceData.push({
//     name: "No Instructor",
//     value: {id: null}
//   })
//   await showTable([{JSON: JSON.stringify(dbData)}]);
//   await showTable(dbData);
  
//   const firstAnswer = await inquirer.prompt([
//     {
//       message: "Which instructor will teach this course?",
//       type: 'list',
//       choices: choiceData,
//       name: "instructor"
//     }
//   ]);
//   // console.log(firstAnswer);
//   // console.log(firstAnswer.instructor.id);

//   const otherData = await inquirer.prompt([
//     {
//       message: "What is the course title?",
//       type: 'input',
//       name: "course_title"
//     },
//     {
//       message: "What is the course description?",
//       type: 'input',
//       name: "course_description"
//     },
//     {
//       message: "Is course active?",
//       type: 'choice',
//       choices: [0, 1],
//       name: "active"
//     },
//   ]);
//   otherData.date_added = "2023-06-06";
//   otherData.instructor_id = firstAnswer.instructor.id;
//   await showTable([otherData]);
//   // console.log(otherData);
//   await db.query("INSERT INTO courses SET ?", otherData);
//   await menu();
// };

// const menu = async function () {
//   // console.log("Do stuff after!");

//   const answers = await inquirer.prompt([
//     {
//       message: "What do you want...",
//       type: 'list',
//       name: 'option',
//       choices: [
//         "Add a course"
//       ]
//     }
//   ])
//   if(answers.option === "Add a course"){
//     addCourse();
//   }
// }

// const init = async function(){
//   // show table is an async function which will look like a promise in console
//   // if we print
//   await showTable();
//   await mainMenu();
// }

mainMenu();

