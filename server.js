const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sizeOf = require('image-size');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const ImageModule = require('docxtemplater-image-module-free');
const app = express();
const port = 2999;

// Setup multer for file handling
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/') // Ensure this directory exists
  },
  filename: function(req, file, cb) {
    // Rename the uploaded image file to include the timestamp in the filename
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Crumblezilla20!',
  database: 'coursedb'
});

db.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.post('/submit-form', upload.single('CEOImage'), (req, res) => {
    console.log('Received request at /submit-form');
    // Assuming userID is generated or retrieved from session, here for simplicity
  let userId = `user_${new Date().getTime()}`;
  let { companyName, employeeQuote, firstValue, secondValue, thirdValue, fourthValue, fifthValue, companyMission, companyDescription, firstWeekItems } = req.body;
  let imagePath = req.file ? req.file.path : null; // Path where the image is stored

  // SQL for creating the table if it doesn't exist
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS user_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(255),
      companyName VARCHAR(255),
      employeeQuote TEXT,
      firstValue VARCHAR(255),
      secondValue VARCHAR(255),
      thirdValue VARCHAR(255),
      fourthValue VARCHAR(255),
      fifthValue VARCHAR(255),
      companyMission TEXT,
      companyDescription TEXT,
      firstWeekItems TEXT,
      image VARCHAR(255),
      submissionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.query(createTableSQL, err => {
    if (err) {
      console.error('Error ensuring table exists:', err);
      return res.status(500).send('Error ensuring table exists');
    }

    const insertSQL = `
      INSERT INTO user_submissions
      (userId, companyName, employeeQuote, firstValue, secondValue, thirdValue, fourthValue, fifthValue, companyMission, companyDescription, firstWeekItems, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);
    `;
    const values = [userId, companyName, employeeQuote, firstValue, secondValue, thirdValue, fourthValue, fifthValue, companyMission, companyDescription, firstWeekItems, imagePath];
    db.query(insertSQL, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Error inserting data');
      }
      console.log('Data inserted successfully');
      console.log({
        userId,
        companyName,
        employeeQuote,
        firstValue,
        secondValue,
        thirdValue,
        fourthValue,
        fifthValue,
        companyMission,
        companyDescription,
        firstWeekItems,
        imagePath // This logs the path where the image is saved
      });
      
      res.send({ status: 'success', message: 'Data inserted successfully', id: result.insertId });
    });
  });
});



//Deleting last submission upon redo

app.get('/delete-last-submission', (req, res) => {
  const deleteSQL = `DELETE FROM user_submissions ORDER BY submissionTime DESC LIMIT 1;`;


  db.query(deleteSQL, (err, result) => {
      if (err) {
          console.error('Error deleting last submission:', err);
          return res.status(500).send('Error deleting last submission');
      }
      console.log('Last submission deleted successfully');
      res.send({ status: 'success', message: 'Last submission deleted successfully' });
  });
});








app.get('/generate-document', (req, res) => {
  console.log("Starting document generation process.");

  db.query('SELECT * FROM user_submissions ORDER BY submissionTime DESC LIMIT 1', (error, results) => {
      if (error) {
          console.error('Database query error:', error);
          return res.status(500).send('Database query error');
      }
      if (results.length === 0) {
          console.log('No submissions found.');
          return res.status(404).send('No submissions found');
      }

      const submission = results[0];
      const imagePath = path.join(__dirname, 'uploads', submission.image.replace('uploads\\', ''));
      console.log("Constructed image path:", imagePath);

      if (!fs.existsSync(imagePath)) {
          console.error("Image does not exist or is not accessible at the path:", imagePath);
          return res.status(404).send("Image file not found for the document.");
      }
      console.log("Confirmed: Image file exists and is accessible.");

      fs.readFile(path.join(__dirname, 'Onboarding Document.docx'), 'binary', (err, content) => {
          if (err) {
              console.error('Error reading document template:', err);
              return res.status(500).send('Error reading document template');
          }

          const zip = new PizZip(content);
          const imageModule = new ImageModule({
              getImage: function(tagValue) {
                  return fs.readFileSync(tagValue);
              },
              getSize: function(tagValue) {
                  const dimensions = sizeOf(tagValue);
                  return [dimensions.width, dimensions.height];
              }
          });

          try {
              const doc = new Docxtemplater(zip, {
                  modules: [imageModule],
                  paragraphLoop: true,
                  linebreaks: true,
              });

              // Ensure firstWeekItems is correctly formatted and split into an array
              let firstWeekItemsArray;
              if (submission.firstWeekItems && submission.firstWeekItems.trim()) {
                firstWeekItemsArray = submission.firstWeekItems.split('.').map(item => ({ item: item.trim() })).filter(item => item.item);

              } else {
                  firstWeekItemsArray = [];
              }
              console.log(firstWeekItemsArray); // This should output an array of strings, not objects.

              doc.setData({
                  CompanyNameHere: submission.companyName,
                  'Value 1': submission.firstValue,
                  'Value 2': submission.secondValue,
                  'Value 3': submission.thirdValue,
                  'Value 4': submission.fourthValue,
                  'Value 5': submission.fifthValue,
                  CMissionHere: submission.companyMission,
                  EQuote: submission.employeeQuote,
                  CompanyD: submission.companyDescription,
                  ItemFromChecklistHere: firstWeekItemsArray, // Use the correctly formatted array here
                  CEOIMAGEHERE: imagePath,
              });

              doc.render();

              const buf = doc.getZip().generate({type: 'nodebuffer'});

              res.setHeader('Content-Disposition', 'attachment; filename="OnboardingDocument.docx"');
              res.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
              res.send(buf);
              console.log("Document generated and sent successfully.");
          } catch (error) {
              console.error('Error during document generation:', error);
              return res.status(500).send('Error during document generation');
          }
      });
  });
});












// Endpoint to get the latest submission
app.get('/api/latest-submission', (req, res) => {
  const getLastSubmissionQuery = 'SELECT * FROM user_submissions ORDER BY submissionTime DESC LIMIT 1';
  db.query(getLastSubmissionQuery, (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      if (results.length === 0) {
          res.status(404).json({ error: 'No submissions found' });
          return;
      }
      // Send the last submission data back as a response
      res.json(results[0]);
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
