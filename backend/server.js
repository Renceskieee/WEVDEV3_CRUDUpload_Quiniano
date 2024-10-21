const express = require('express');
const mysql = require('mysql');
const multer = require('multer');

const cors = require('cors');
const fs = require('fs');
const app = express();
const xlsx = require('xlsx');
const moment = require('moment');  // Moment.js for handling dates

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

db.connect(err => {
    if (err) {
        onsole.log('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to convert Excel date serial to JS Date
const excelDateToJSDate = (serial) => {
    // Excel stores dates as days since 1900-01-01
    const startDate = new Date(1900, 0, 1);
    const resultDate = new Date(startDate.getTime() + ((serial - 1) * 24 * 60 * 60 * 1000));
    return resultDate;
};

// Route to handle XLS file upload
app.post('/upload-xls', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Read the uploaded XLS file
        const workbook = xlsx.readFile(req.file.path);
        const sheet_name = workbook.SheetNames[0];
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

        // Log the uploaded data for troubleshooting
        console.log('Uploaded sheet data:', sheet);

        // Insert data into MySQL
            sheet.forEach(row => {
            const employeeNumber = row.employee_number;

            // Convert Excel serial date to JS date and format it to 'YYYY-MM-DD HH:mm:ss'
            const employeeTimeIn = excelDateToJSDate(row.employee_time_in);
            const formattedTimeIn = moment(employeeTimeIn).format('YYYY-MM-DD HH:mm:ss');

            console.log(`Employee Number: ${employeeNumber}, Employee Time In: ${formattedTimeIn}`);

            const sql = 'INSERT INTO employee_time_logs (employee_number, employee_time_in) VALUES (?, ?)';
            db.query(sql, [employeeNumber, formattedTimeIn], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return;
                }
                console.log('Data inserted successfully:', result);
            });
        });

        // Send response after insertion
        res.json({ message: 'File uploaded and data inserted successfully' });

    } catch (error) {
        console.error('Error processing XLS file:', error);
        res.status(500).json({ error: 'Error processing XLS file' });
    } finally {
        // Delete the uploaded file to save space on the server
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            } else {
                console.log('Uploaded file deleted');
            }
        });
    }
});

// Add this route to handle XLS file upload for employee_info
app.post('/upload-employee-info', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
  
    try {
        // Read the uploaded XLS file
        const workbook = xlsx.readFile(req.file.path);
        const sheet_name = workbook.SheetNames[0];
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);
    
        // Log the uploaded data for troubleshooting
        console.log('Uploaded employee info data:', sheet);
  
    // Insert data into MySQL
    sheet.forEach(row => {
        const employeeNumber = row.employee_number;
        const employeeName = row.employee_name;
        const employeeSalary = row.employee_salary;
        const employeePosition = row.position;
  
        const sql = 'INSERT INTO employee_info (employee_number, employee_name, employee_salary, position) VALUES (?, ?, ?, ?)';
        db.query(sql, [employeeNumber, employeeName, employeeSalary, employeePosition], (err, result) => {
            if (err) {
                console.error('Error inserting data into employee_info:', err);
                return;
                }
                console.log('Data inserted into employee_info successfully:', result);
            });
        });
  
        // Send response after insertion
        res.json({ message: 'Employee info file uploaded and data inserted successfully' });
  
    } catch (error) {
        console.error('Error processing employee info XLS file:', error);
        res.status(500).json({ error: 'Error processing employee info XLS file' });
    } finally {
        // Delete the uploaded file to save space on the server
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            } else {
                console.log('Uploaded employee info file deleted');
            }
            });
        }
    });

// Route to search employee records by employee number
app.get('/employee-records/:employee_number', (req, res) => {
    const employeeNumber = req.params.employee_number;

    const sql = `
        SELECT DATE(employee_time_in) AS date, 
            MIN(TIME(employee_time_in)) AS earliest_time, 
            MAX(TIME(employee_time_in)) AS last_time, 
            TIMEDIFF(MAX(employee_time_in), MIN(employee_time_in)) AS time_difference
        FROM employee_time_logs
        WHERE employee_number = ?
        GROUP BY DATE(employee_time_in)
    `;

    db.query(sql, [employeeNumber], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
