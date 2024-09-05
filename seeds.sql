-- Insert departments
INSERT INTO department (name) VALUES 
('Engineering'),
('Finance'),
('Human Resources'),
('Sales');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000, 1),
('Accountant', 60000, 2),
('HR Manager', 75000, 3),
('Sales Representative', 50000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Sarah', 'Connor', 3, NULL),
('Michael', 'Jordan', 4, NULL),
('Emily', 'Davis', 1, 1),   -- Emily reports to John
('Chris', 'Evans', 4, 4);   -- Chris reports to Michael
