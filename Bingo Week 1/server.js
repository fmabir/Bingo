//importing necessary modules
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


//One thing that makes no sense to me is how is this server file connected with the actual html files!

//boilerplate
const app = express();


//Port where the output is visible
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


//I have added this piece of code
//app.get('/', function (req, res, next) {
//  res.send("Hello world");
//});
//added code block ends here


//Connection with database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    //I have changed the port to match my port
    port: '3308',
    //database name
    database: 'bingo'
});


//Code that is printing if connected to the database or not
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});



//Routing function structure --> app.METHOD(PATH, HANDLER)
//whenever the /register url is accessed the register.html file is loaded

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/register.html");
    //res.send("Hello world!");

});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");

});




//The same /login path has a get and a post request handling part?!
//gem method commented out
//The post request cannot be accessed when calling /login
//LOGIN
app.post("/login", (req, res) => {
    // console.log(req.body.firstname);
    // console.log(req.body.student_id);

    var id = req.body.id;
    var password = req.body.password;


    var sql = `SELECT password from user where NSU_ID = ${id}`;


    connection.query(sql, (err, result) => {
        if (err) {
            console.log("Error Dectected.");
            res.send("Access Denied. ;)");
        }
        else {
            var pass;
            result.forEach(row => {
                var decodedString = row.password;
                pass = atob(decodedString);
                console.log(pass);
            });



            //Maybe you are using name instead of password
            if (pass == undefined) {
                console.log("ID doesn't exist");
                res.send("Access Denied. ;)");
            }
            else if (pass == password) {
                console.log(" Successfully matched");
                res.send("You have logged in successfully!!");
            }
            else {
                console.log(" Failed to match.");
                res.send("Access Denied. ;)");
            }

        }

    });

    //sends the response
    //For now since there is no user homepage this is just sending a text back



});






//REGISTER
app.post("/register", (req, res) => {
    // console.log(req.body.firstname);
    // console.log(req.body.student_id);

    //The post request is returning a body and accessing the student_id and firstname part for it
    var fname = req.body.fname;
    var lname = req.body.lname;
    var mail = req.body.mail;
    var password = req.body.pass;
    var date = req.body.date;
    var id = req.body.id;
    var dept = req.body.dept;
    var gender = req.body.gender;

    // var formattedDate = date.substring(0, 4) + "-" + date.substring(5, 7) + 

    console.log(fname);
    console.log(lname);
    console.log(mail);
    console.log(password);
    console.log(date);
    console.log(id);
    console.log(dept);
    console.log(gender);

   


    //Hash block starts
    var inputString = password;

    //Encoding the input String using base64 hash and storing in the variable 
    var encodedString = btoa(inputString);

    //Printing the encoded string
    //console.log("The encoded string is> ", encodedString);

    //Taking the encoded sting and decoding it to get the original input string
    //var decodedString = atob(encodedString);

    //Printing the decoded string
    //console.log("The decoded string> ", decodedString);

    //Hash block ends

    //infos is a database table with name and sid(Pkey)
    var sql = `Insert into user (NSU_ID, first_name ,last_name , password, email, gender, date_of_birth, department) Values(${id}, '${fname}', '${lname}', '${encodedString}' , '${mail}', '${gender}', '${date}', '${dept}')`;

    

    //Query implementation
    connection.query(sql, (err) => {
        if (err) {
            console.log("Error Dectected from post. Duplicate sid");
            res.send("Registration Failed!");

        }
        else {
            console.log("Successfully inserted 1 record");
            showTable();
            res.sendFile(__dirname + "/login.html");
        }

    });


    
    //Debugging workload
    //console.log(`This returns and the process ends`)
    //res.send("Hellooooooooooo Woooooorrrrllldd!!");

});






//Shows the entire database table
function showTable() {
    connection.query("select * from user", (err, result) => {
        if (err) throw err;
        //loops through the entire result body and prints information
        // result.forEach(row => {
        //     const sid = row.sid;
        //     var name = row.name;

        //     console.log(`Student ID: ${sid}, Student Name: ${name}`);
        // });

        console.log(result);
    });
}




//Displays which port the server is running on
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});