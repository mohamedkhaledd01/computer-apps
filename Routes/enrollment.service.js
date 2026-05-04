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

router.post('/enrollment',(req,res)=>{
    console.log("Post Request Received");
    con.query("INSERT INTO enrollment (`student`, `course`,`date`) VALUES (?,?,?)",
    [req.body.student, req.body.course, req.body.date], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Added Successfully with Id "+
        result.insertId});
        console.log("Record Added"+ result.insertId);
    });
});

router.get('/enrollment', (req,res) =>{
    var enrollment_id = req.query.enrollment_id;
    if (enrollment_id == '%'){
        con.query("SELECT * FROM enrollment where enrollment_id LIKE ?", [enrollment_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
    else{
        con.query("SELECT * FROM enrollment where enrollment_id = ?", [enrollment_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});
    
router.delete('/enrollment',(req,res)=>{
    var enrollment_id = req.query.enrollment_id;
    con.query("DELETE FROM enrollment where enrollment_id = ?", [enrollment_id], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message" : "Record Id ["+req.query.enrollment_id+"] deleted Successfully"});
        console.log("Delete Request Received for record ["+req.query.enrollment_id+"] received");
    });
});

router.put('/enrollment',(req,res)=>{
    console.log("PUT Request Received");
    var enrollment_id= req.query.enrollment_id;
    con.query("UPDATE enrollment SET `student`= ?, `course` = ? ,`date` = ? WHERE enrollment_id = " + enrollment_id ,
    [req.body.student,req.body.course,req.body.date], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Id ["+ enrollment_id + "] is Updated Successfully"});
        console.log("Record Id ["+ enrollment_id+ "] is Updated Successfully");
    });
});

router.get('/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM enrollment where " + keyword + " = ? order by enrollment_id " + sort , [keyvalue],
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

