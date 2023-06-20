const inquirer = require('inquirer');
const showTable = require('./utility/table');
// const mysql = require('mysql2/promise');
// const { table } = require('table');+
const db = require('./config/connection')


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
    if(answer.choice == "View all departments") {
      viewAllDepartments()
    }
    if(answer.choice == "View all roles") {
      viewAllRoles()
    }
    if(answer.choice == "View all employees") {
      viewAllEmployees()
    }
    // if(answer.choice == "View all departments") {
    //   viewAllDepartments()
    // }
    // if(answer.choice == "View all departments") {
    //   viewAllDepartments()
    // }
    // if(answer.choice == "View all departments") {
    //   viewAllDepartments()
    // }
    // if(answer.choice == "View all departments") {
    //   viewAllDepartments()
    // }
    // if(answer.choice == "View all departments") {
    //   viewAllDepartments()
    // }
  })
}

// function to view the data in the department table
function viewAllDepartments() {
  db.query("SELECT * FROM department;", async function (err, data) {
    if(err) {
      console.log(err);
      return;
    } else {
      await showTable(data)
      mainMenu()
    }
  })
}

// function to view data in the role table
async function viewAllRoles() {
  const roleData = await db.promise().query("SELECT * FROM role");
  await showTable(roleData[0]);
  mainMenu();
};

// function to view data in the employee table
async function viewAllEmployees() {
  const employeeData = await db.promise().query("SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id;")
  await showTable(employeeData[0]);
  mainMenu()
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

