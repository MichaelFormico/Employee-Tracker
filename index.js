const inquirer = require('inquirer');
const connection = require('./database');

// View all departments
async function viewDepartments() {
  try {
    const departments = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM department', (error, departments) => {
        if (error) {
          reject(error);
        } else {
          resolve(departments);
        }
      });
    });

    console.table(departments);
  } catch (error) {
    console.error('Failed to retrieve departments:', error);
  }
}

// View all roles
async function viewRoles() {
  try {
    const roles = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM role', (error, roles) => {
        if (error) {
          reject(error);
        } else {
          resolve(roles);
        }
      });
    });

    console.table(roles);
  } catch (error) {
    console.error('Failed to retrieve roles:', error);
  }
}

// View all employees
async function viewEmployees() {
  try {
    const employees = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee', (error, employees) => {
        if (error) {
          reject(error);
        } else {
          resolve(employees);
        }
      });
    });

    console.table(employees);
  } catch (error) {
    console.error('Failed to retrieve employees:', error);
  }
}

// Add a department
async function addDepartment() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter the ID of the department:',
        bottom: 0,
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        bottom: 0,
      },
    ]);

    const { id, name } = answers;

    connection.query('INSERT INTO department SET ?', { id, name }, (error, result) => {
      if (error) {
        console.error('Failed to add department:', error);
        return;
      }

      console.log('Department added successfully');
    });
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

// Add a role
async function addRole() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Enter the department ID for the role:',
      },
    ]);

    const { title, salary, departmentId } = answers;

    connection.query(
      'INSERT INTO role SET ?',
      { title, salary, department_id: departmentId },
      (error, result) => {
        if (error) {
          console.error('Failed to add role:', error);
          return;
        }

        console.log('Role added successfully');
      }
    );
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

// Add an employee
async function addEmployee() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
      },
      {
        type: 'input',
        name: 'roleId',
        message: "Enter the employee's role ID:",
      },
      {
        type: 'input',
        name: 'managerId',
        message: "Enter the employee's manager ID:",
      },
    ]);

    const { firstName, lastName, roleId, managerId } = answers;

    connection.query(
      'INSERT INTO employee SET ?',
      { first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId },
      (error, result) => {
        if (error) {
          console.error('Failed to add employee:', error);
          return;
        }

        console.log('Employee added successfully');
      }
    );
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

// Update an employee's role
async function updateEmployeeRole() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: "Enter the ID of the employee:",
      },
      {
        type: 'input',
        name: 'roleId',
        message: "Enter the new role ID for the employee:",
      },
    ]);

    const { employeeId, roleId } = answers;

    connection.query(
      'UPDATE employee SET role_id = ? WHERE id = ?',
      [roleId, employeeId],
      (error, result) => {
        if (error) {
          console.error('Failed to update employee role:', error);
          return;
        }

        console.log('Employee role updated successfully');
      }
    );
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

// Connect to the database
connection.connect(error => {
  if (error) {
    console.error('Failed to connect to the database:', error);
    return;
  }

  console.log('Connected to the database');

  // Start the application
  init();
});

// Main menu prompt
function init() {
  inquirer
    .prompt([
      {
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
      }
    ])
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          return;
      }

      // After completing the chosen action, prompt the user again
      init();
    })
    .catch(error => {
      console.log('An error occurred:', error);
      connection.end();
    });
}