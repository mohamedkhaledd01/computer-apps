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

router.post('/announcement',(req,res)=>{
    console.log("Post Request Received");
    con.query("INSERT INTO announcement (`course_name`, `title`,`date_posted`) VALUES (?,?,?)",
    [req.body.course_name, req.body.title, req.body.date_posted], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Added Successfully with Id "+
        result.insertId});
        console.log("Record Added"+ result.insertId);
    });
});

router.get('/announcement', (req,res) =>{
    var announcement_id = req.query.announcement_id;
    if (announcement_id == '%'){
        con.query("SELECT * FROM announcement where announcement_id LIKE ?", [announcement_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
    else{
        con.query("SELECT * FROM announcement where announcement_id = ?", [announcement_id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
            console.log(result);
        });
    }
});
    
router.delete('/announcement',(req,res)=>{
    var announcement_id = req.query.announcement_id;
    con.query("DELETE FROM announcement where announcement_id = ?", [announcement_id], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message" : "Record Id ["+req.query.announcement_id+"] deleted Successfully"});
        console.log("Delete Request Received for record ["+req.query.announcement_id+"] received");
    });
});

router.put('/announcement',(req,res)=>{
    console.log("PUT Request Received");
    var announcement_id= req.query.announcement_id;
    con.query("UPDATE announcement SET `course_name`= ?, `title` = ? ,`date_posted` = ? WHERE announcement_id = " + announcement_id ,
    [req.body.course_name,req.body.title,req.body.date_posted], function (err, result, fields) {
        if (err) throw err;
        res.json({"Status":"OK", "Message": "Record Id ["+ announcement_id + "] is Updated Successfully"});
        console.log("Record Id ["+ announcement_id+ "] is Updated Successfully");
    });
});

router.get('/search',(req,res)=>{
    keyword = req.query.keyword;
    keyvalue = req.query.keyvalue;
    sort = req.query.sort;
    con.query("SELECT * FROM announcement where " + keyword + " = ? order by announcement_id " + sort , [keyvalue],
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

