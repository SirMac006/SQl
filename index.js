const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./db/queries');

function start() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(({ action }) => {
        switch (action) {
            case 'View all departments':
                viewDepartments().then(start);
                break;
            case 'View all roles':
                viewRoles().then(start);
                break;
            case 'View all employees':
                viewEmployees().then(start);
                break;
            case 'Add a department':
                addDepartment().then(start);
                break;
            case 'Add a role':
                addRole().then(start);
                break;
            case 'Add an employee':
                addEmployee().then(start);
                break;
            case 'Update an employee role':
                updateEmployeeRole().then(start);
                break;
            case 'Exit':
                process.exit();
        }
    });
}

start();
