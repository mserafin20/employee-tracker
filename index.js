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
    if(answer.choice == "Add a department") {
      addDepartment()
    }
    if(answer.choice == "Add a role") {
      addRole()
    }
    if(answer.choice == "Add an employee") {
      addEmployee()
    }
    if(answer.choice == "Update an employee role") {
      updateEmployeeRole()
    }
    if(answer.choice == "Exit") {
      process.exit()
    }
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

// function to add a department based on user input to the database
async function addDepartment() {
  const response = await inquirer.prompt([
    {
      type: "input",
      name: "department_name",
      message: "What department would you like to add to the database?"
    }
  ]);
  const departmentData = await db.promise().query("INSERT INTO department (name) VALUES (?)", [response.department_name])
};

// function to add a role based on user input to the database
async function addRole() {
  const departmentData = await db.promise().query("SELECT * FROM department")
  const departmentChoices = departmentData[0].map(({ id, name }) => ({ name: name, value: id }))
  const response = await inquirer.prompt([
    {
      type: "input",
      name: "role_name",
      message: "What is the new role called?"
    },
    {
      type: "input",
      name: "role_salary",
      message: "What will the new salary of this role be?"
    },
    {
      type: "list",
      name: "role_id",
      message: "Which department does this new role belong to?",
      choices: departmentChoices
    }
  ]);

  const newRole = await db.promise().query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.role_name, response.role_salary, response.role_id])
  mainMenu();
};

// function to add an employee based on user input into the database

async function addEmployee() {
  const roleData = await db.promise().query("SELECT * FROM role");
  const roleChoices = roleData[0].map(({ title, id }) => ({ name: title, value: id }));
  const employeeData = await db.promise().query("SELECT * FROM employee");
  const employeeChoices = employeeData[0].map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id}));
  const response = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the new employee's first name?"
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the new employee's last name?"
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the new employee's role?",
      choices: roleChoices
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who will be the employee's manager?",
      choices: employeeChoices
    },
  ]);

  const newEmployee = await db.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.first_name, response.last_name, response.role_id, response.manager_id])
  mainMenu();
};

// function to update an employee role using input from the user to the database
async function updateEmployeeRole() {
  const employeeData = await db.promise().query("SELECT * FROM employee");
  const employeeChoices = employeeData[0].map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id}));
  const roleData = await db.promise().query("SELECT * FROM role");
  const roleChoices = roleData[0].map(({ title, id }) => ({ name: title, value: id }));

  const response = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's role needs to be updated?",
      choices: employeeChoices
    },
    {
      type: "list",
      name: "employee_role",
      message: "What role will be assigned to the selected employee?",
      choices: roleChoices
    }
  ])

  const updatedEmployee = await db.promise().query("UPDATE employee SET role_id=? WHERE id=?", [response.employee_role, response.employee])
  mainMenu();
}
mainMenu();

