const pool = require('./connection');
const inquirer = require('inquirer');

const viewDepartments = async () => {
    const res = await pool.query('SELECT * FROM department');
    console.table(res.rows);
};

const viewRoles = async () => {
    const res = await pool.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id');
    console.table(res.rows);
};

const viewEmployees = async () => {
    const res = await pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                                  CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                                  FROM employee 
                                  JOIN role ON employee.role_id = role.id 
                                  JOIN department ON role.department_id = department.id 
                                  LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    console.table(res.rows);
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt({
        name: 'name',
        message: 'Enter the name of the department:',
    });
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added ${name} to the database.`);
};

const addRole = async () => {
    const departments = await pool.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(({ id, name }) => ({ name, value: id }));

    const { title, salary, department_id } = await inquirer.prompt([
        { name: 'title', message: 'Enter the name of the role:' },
        { name: 'salary', message: 'Enter the salary of the role:' },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department:',
            choices: departmentChoices,
        },
    ]);

    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added ${title} to the database.`);
};

const addEmployee = async () => {
    const roles = await pool.query('SELECT * FROM role');
    const employees = await pool.query('SELECT * FROM employee');

    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));
    const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { name: 'first_name', message: "Enter the employee's first name:" },
        { name: 'last_name', message: "Enter the employee's last name:" },
        {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's role:",
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: "Select the employee's manager:",
            choices: [...managerChoices, { name: 'None', value: null }],
        },
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added ${first_name} ${last_name} to the database.`);
};

const updateEmployeeRole = async () => {
    const employees = await pool.query('SELECT * FROM employee');
    const roles = await pool.query('SELECT * FROM role');

    const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select an employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roleChoices,
        },
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Updated employee's role.`);
};

module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };
