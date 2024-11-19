express = require('express');
var router = express.Router();
var upload = require('./multer')
var pool = require('./pool')

router.get('/all', function (req, res) {
    pool.query('SELECT * FROM employee', function (err, result) {
        if (err) throw err;
        res.json(result.rows)
    })

})
router.post('/insert', function (req, res) {


    pool.query('INSERT INTO employee (email, ename, emob, password) VALUES ($1, $2, $3, $4)', [req.body.email,req.body.ename,req.body.emob,req.body.epass], function (err, result) {
        if(err) {
            console.log(err)
            res.status(404).json({
              message: "Database Error Pls contact with backend team...!",
              status: false,
            });
          } else {
            res
              .status(200)
              .json({ message: "Brand Submitted Successfully", status: true });
          }
    })

})

router.post('/login', function (req, res) {
  // Query the database using parameterized queries to avoid SQL injection
  pool.query(
    'SELECT email FROM employee WHERE (email = $1 OR emob = $2) AND password = $3',
    [req.body.email, req.body.emob, req.body.password],
    function (error, result) {
      if (error) {
      
       return res.status(500).json({
          message: 'Database error, please contact the backend team... ' + error,
          status: false
        });
      } else {
       

        if (result.rows.length === 1) {
         
          // Return success if we find one matching result
          return res.status(200).json({
            message: 'Success',
            status: true
          });
        } else {
          console.log('Invalid');
       
          return res.status(200).json({
            message: 'Invalid Email ID/Mobile Number/Password',
            status: false
          });
        }
      }
    }
  );
});


router.post('/insert_company',upload.single('companyImage'),function(req,res){
 
  pool.query('INSERT INTO largecompany (company_name, establishment_date, ceo_name, type, google_link, co2,company_image,state,city,emission) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10)', [req.body.companyName,req.body.establishmentDate,req.body.ceoName,req.body.industryType,req.body.googleMapLink,req.body.co2Emission,req.file.filename,req.body.state,req.body.city,req.body.emission], function (err, result) {
    if(err) {
        console.log(err)
        res.status(404).json({
          message: "Database Error Pls contact with backend team...!",
          status: false,
        });
      } else {
        res
          .status(200)
          .json({ message: "Brand Submitted Successfully", status: true });
      }
})
})



router.get('/show_company', function (req, res) {
  // Assuming you want to select a company by its name or other unique identifier
  // For example, use the companyName passed in the request body

  // Query to select the company data from the database
  pool.query(
    'SELECT * FROM largecompany',
     // Using the companyName from the request body
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(404).json({
          message: "Database Error! Please contact the backend team...",
          status: false,
        });
      } else {
        console.log(result.rows)
      
       
          // If no company is found
          res.status(200).json({
            message: "Company all",
            status: true,
            data:result.rows
          });
        }
      
    }
  );
});


router.get('/get_company_details/:companyId', function(req, res) {
  const { companyId } = req.params;

  // Optional: Check if companyId is valid (this could be a simple check)
  if (!companyId || isNaN(companyId)) {
    return res.status(400).json({
      message: "Invalid companyId parameter",
      status: false
    });
  }

  pool.query('SELECT * FROM largecompany WHERE companyid = $1', [companyId], function(err, result) {
    if (err) {
      console.error('Database error:', err); // Logging more informative error
      return res.status(500).json({
        message: "Database error. Please contact backend team.",
        status: false,
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Company not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Company details fetched successfully",
      status: true,
      data: result.rows[0] // Assuming the result is an array, and you want a single company
    });
  });
});






router.post('/insert_verification/:companyId', function(req, res) {
  // Extract companyId from the URL parameter
  const companyId = req.params.companyId;  // Correct way to access companyId from req.params
  
  // Make sure the companyId is an integer (for validation)
  const parsedCompanyId = parseInt(companyId, 10);
  if (isNaN(parsedCompanyId)) {
    return res.status(400).json({
      message: "Invalid companyId. It must be an integer.",
      status: false,
    });
  }
  
  // Extract the status from the request body
  const status = req.body.status;

  // Ensure the status is either 'Verified' or 'Rejected'
  if (status !== 'Verified' && status !== 'Rejected') {
    return res.status(400).json({
      message: "Invalid status. Please provide 'Verified' or 'Rejected'.",
      status: false,
    });
  }

  // Insert the verification record with the company_id and status
  pool.query('INSERT INTO verification (companyid, status) VALUES ($1, $2)', 
    [parsedCompanyId, status], 
    function (err, verificationResult) {
      if (err) {
       
        return res.status(404).json({
          message: "Verification Table Error. Please contact backend team.",
          status: false,
        });
      } else {
        return res.status(200).json({
          message: "Verification Submitted Successfully",
          status: true,
        });
      }
  });
});



module.exports = router;
