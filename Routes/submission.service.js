const mysql = require('mysql');
const express = require('express');
const router = express.Router();

router.use(express.json());

global.con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms"
});

con.connect(function(err) {
    if (err) throw err;
    console.log('database is connected');
});

router.post('/submission',(req,res)=>{
    console.log("Post Request Received");
    con.query("INSERT INTO submission (`student_name`, `assignment_title`,`submission_date`) VALUES (?,?,?)",
    [req.body.student_name, req.body.assignment_title, req.body.submission_date], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Added Successfully with Id "+
        result.insertId});
        console.log("Record Added"+ result.insertId);
    });
});

router.get('/submission', (req,res) =>{
    var submission_id = req.query.submission_id;
    if (submission_id == '%'){
        con.query("SELECT * FROM submission where submission_id LIKE ?", [submission_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
    else{
        con.query("SELECT * FROM submission where submission_id = ?", [submission_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});
    
router.delete('/submission',(req,res)=>{
    var submission_id = req.query.submission_id;
    con.query("DELETE FROM submission where submission_id = ?", [submission_id], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message" : "Record Id ["+req.query.submission_id+"] deleted Successfully"});
        console.log("Delete Request Received for record ["+req.query.submission_id+"] received");
    });
});

router.put('/submission',(req,res)=>{
    console.log("PUT Request Received");
    var submission_id= req.query.submission_id;
    con.query("UPDATE submission SET `student_name`= ?, `assignment_title` = ? ,`submission_date` = ? WHERE submission_id = " + submission_id ,
    [req.body.student_name,req.body.assignment_title,req.body.submission_date], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Id ["+ submission_id + "] is Updated Successfully"});
        console.log("Record Id ["+ submission_id+ "] is Updated Successfully");
    });
});

router.get('/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM submission where " + keyword + " = ? order by submission_id " + sort , [keyvalue],
    function (err, result, fields) {
    if (err) {
        res.json({"Status": "Error","Message": err});
    }else{
        res.json(result);
        console.log(result);
    }
    });
    console.log (`Incoming SEARCH Request`);
});


module.exports = router;

