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

router.post('/assignment',(req,res)=>{
    console.log("Post Request Received");
    con.query("INSERT INTO assignment (`course_name`, `title`,`due_date`) VALUES (?,?,?)",
    [req.body.course_name, req.body.title, req.body.due_date], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Added Successfully with Id "+
        result.insertId});
        console.log("Record Added"+ result.insertId);
    });
});

router.get('/assignment', (req,res) =>{
    var assignment_id = req.query.assignment_id;
    if (assignment_id == '%'){
        con.query("SELECT * FROM assignment where assignment_id LIKE ?", [assignment_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
    else{
        con.query("SELECT * FROM assignment where assignment_id = ?", [assignment_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});
    
router.delete('/assignment',(req,res)=>{
    var assignment_id = req.query.assignment_id;
    con.query("DELETE FROM assignment where assignment_id = ?", [assignment_id], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message" : "Record Id ["+req.query.assignment_id+"] deleted Successfully"});
        console.log("Delete Request Received for record ["+req.query.assignment_id+"] received");
    });
});

router.put('/assignment',(req,res)=>{
    console.log("PUT Request Received");
    var assignment_id= req.query.assignment_id;
    con.query("UPDATE assignment SET `course_name`= ?, `title` = ? ,`due_date` = ? WHERE assignment_id = " + assignment_id ,
    [req.body.course_name,req.body.title,req.body.due_date], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Id ["+ assignment_id + "] is Updated Successfully"});
        console.log("Record Id ["+ assignment_id+ "] is Updated Successfully");
    });
});

router.get('/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM assignment where " + keyword + " = ? order by assignment_id " + sort , [keyvalue],
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

