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

router.post('/quiz',(req,res)=>{
    console.log("Post Request Received");
    con.query("INSERT INTO quiz (`course_name`, `title`,`grade`) VALUES (?,?,?)",
    [req.body.course_name, req.body.title, req.body.grade], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Added Successfully with Id "+
        result.insertId});
        console.log("Record Added"+ result.insertId);
    });
});

router.get('/quiz', (req,res) =>{
    var quiz_id = req.query.quiz_id;
    if (quiz_id == '%'){
        con.query("SELECT * FROM quiz where quiz_id LIKE ?", [quiz_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
    else{
        con.query("SELECT * FROM quiz where quiz_id = ?", [quiz_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});
    
router.delete('/quiz',(req,res)=>{
    var quiz_id = req.query.quiz_id;
    con.query("DELETE FROM quiz where quiz_id = ?", [quiz_id], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message" : "Record Id ["+req.query.quiz_id+"] deleted Successfully"});
        console.log("Delete Request Received for record ["+req.query.quiz_id+"] received");
    });
});

router.put('/quiz',(req,res)=>{
    console.log("PUT Request Received");
    var quiz_id= req.query.quiz_id;
    con.query("UPDATE quiz SET `course_name`= ?, `title` = ? ,`grade` = ? WHERE quiz_id = " + quiz_id ,
    [req.body.course_name,req.body.title,req.body.grade], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Id ["+ quiz_id + "] is Updated Successfully"});
        console.log("Record Id ["+ quiz_id+ "] is Updated Successfully");
    });
});

router.get('/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM quiz where " + keyword + " = ? order by quiz_id " + sort , [keyvalue],
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

