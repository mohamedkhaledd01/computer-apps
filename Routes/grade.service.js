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

router.post('/grade',(req,res)=>{
    console.log("Post Request Received");
    con.query("INSERT INTO grade (`student_name`, `course_name`,`grade_value`) VALUES (?,?,?)",
    [req.body.student_name, req.body.course_name, req.body.grade_value], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Added Successfully with Id "+
        result.insertId});
        console.log("Record Added"+ result.insertId);
    });
});

router.get('/grade', (req,res) =>{
    var grade_id = req.query.grade_id;
    if (grade_id == '%'){
        con.query("SELECT * FROM grade where grade_id LIKE ?", [grade_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
    else{
        con.query("SELECT * FROM grade where grade_id = ?", [grade_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});
    
router.delete('/grade',(req,res)=>{
    var grade_id = req.query.grade_id;
    con.query("DELETE FROM grade where grade_id = ?", [grade_id], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message" : "Record Id ["+req.query.grade_id+"] deleted Successfully"});
        console.log("Delete Request Received for record ["+req.query.grade_id+"] received");
    });
});

router.put('/grade',(req,res)=>{
    console.log("PUT Request Received");
    var grade_id= req.query.grade_id;
    con.query("UPDATE grade SET `student_name`= ?, `course_name` = ? ,`grade_value` = ? WHERE grade_id = " + grade_id ,
    [req.body.student_name,req.body.course_name,req.body.grade_value], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Id ["+ grade_id + "] is Updated Successfully"});
        console.log("Record Id ["+ grade_id+ "] is Updated Successfully");
    });
});

router.get('/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM grade where " + keyword + " = ? order by grade_id " + sort , [keyvalue],
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

