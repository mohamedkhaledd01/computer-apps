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

router.post('/course',(req,res)=>{
    console.log("Post Request Received");
    con.query("INSERT INTO course (`name`, `description`,`instructor`) VALUES (?,?,?)",
    [req.body.name, req.body.description, req.body.instructor], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Added Successfully with Id "+
        result.insertId});
        console.log("Record Added"+ result.insertId);
    });
});

router.get('/course', (req,res) =>{
    var course_id = req.query.course_id;
    if (course_id == '%'){
        con.query("SELECT * FROM course where course_id LIKE ?", [course_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
    else{
        con.query("SELECT * FROM course where course_id = ?", [course_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});
    
router.delete('/course',(req,res)=>{
    var course_id = req.query.course_id;
    con.query("DELETE FROM course where course_id = ?", [course_id], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message" : "Record Id ["+req.query.course_id+"] deleted Successfully"});
        console.log("Delete Request Received for record ["+req.query.course_id+"] received");
    });
});

router.put('/course',(req,res)=>{
    console.log("PUT Request Received");
    var course_id= req.query.course_id;
    con.query("UPDATE course SET `name`= ?, `description` = ? ,`instructor` = ? WHERE course_id = " + course_id ,
    [req.body.name,req.body.description,req.body.instructor], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Id ["+ course_id + "] is Updated Successfully"});
        console.log("Record Id ["+ course_id+ "] is Updated Successfully");
    });
});

router.get('/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM course where " + keyword + " = ? order by course_id " + sort , [keyvalue],
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

