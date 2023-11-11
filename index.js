const mysql = require('mysql2');
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "aa11AA!!",
    database: "workDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID# " + connection.threadId + "\n");
    askQuestions();
});

function askQuestions() {
    inquirer.prompt({
        message: "Welcome, what would you like to do?",
        type: "list",
        choices: [
            "View ALL Employees",
            "View ALL Departments",
            "New Employee",
            "New Department",
            "New Role",
            "Update Employee Role",
            "QUIT"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        switch (answers.choice) {
            case "View ALL Employees":
                viewEmployees()
                break;

            case "View ALL Departments":
                viewDepartments()
                break;

            case "New Employee":
                addEmployee()
                break;

            case "New Department":
                addDepartment()
                break;

            case "New Role":
                addRole()
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;

            default:
                connection.end()
                break;
        }
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee",
    function (err, data) {
        if(err) throw err
        console.table(data);
        askQuestions();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department",
    function (err, data) {
        if(err) throw err
        console.table(data);
        askQuestions();
    })
}

function addEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What is the Employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the Employee's last name?"
        },
        {
            type: "number",
            name: "roleId",
            message: "What is the Employee's role ID?"
        },
        {
            type: "number",
            name: "departmentId",
            message: "What is the Department ID?"
        },
        {
            type: "number",
            name: "managerId",
            message: "What is the Employee's manager's ID?"
        }
    ]).then(function(res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId],
        function(err, data) {
            if (err) throw err;
            console.table(data);
            askQuestions();
        })
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the Department that you want to add?"
    }, ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department],
        function(err, data) {
            if (err) throw err;
            console.table(data);
            askQuestions();
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            message: "Enter Title:",
            type: "input",
            name: "title"
        }, {
            message: "Enter Salary:",
            type: "number",
            name: "salary"
        }, {
            message: "Enter Department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id],
        function (err, data) {
            if (err) throw err;
            console.table(data);
        })
        askQuestions();
    })

}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            message: "Which employee would you like to update? (Use first name only for now)",
            type: "input",
            name: "name"
        }, {
            message: "Enter the new role ID:",
            type: "number",
            name: "role_id"
        }
    ]).then(function (response) {
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name],
        function (err, data) {
            if (err) throw err;
            console.table(data);
        })
        askQuestions();
    })

}

