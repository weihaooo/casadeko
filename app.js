

// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {
    var AWS = require('aws-sdk');
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    var express = require('express');
    const fileUpload = require('express-fileupload');
    var bodyParser = require('body-parser');
    var path = require('path');
    const nodemailer = require('nodemailer');
    var moment = require('moment');
    moment().format();
    AWS.config.region = process.env.REGION
    // Connection URL
    const url = 'xxx';

    // Database Name
    const dbName = 'Casadeko';

    
    var sns = new AWS.SNS();

    var snsTopic =  process.env.NEW_SIGNUP_TOPIC;
    var app = express();
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(fileUpload());
    app.set('view engine', 'pug');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));

    app.get('/', function(req, res) {
        var tomorrow = new Date();
        tomorrow = moment(tomorrow).add(1, 'days');
        const dateString = moment(tomorrow).format("YYYY-MM-DD");
        console.log(dateString);
        var available = [1,1,1,1,1,1,1];
        // Use connect method to connect to the server
        // MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
          // if(err) {
                // console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
            // }
            // console.log('Connected...');
          // const collection = client.db(dbName).collection("Consultation");
          
          // function queryCollection(collection, callback){
            // collection.find( { date: dateString } ).toArray(function(err, result) {
            // if (err) {
                // console.log(err);
            // } else if (result.length >= 0) {
                // callback(result);
            // }
            // });
            // }

            // queryCollection(collection, function(result){
                // //You can do more stuff with the result here
                // result.forEach(function(value) {
                    // available[value.slot-1] = 0;
                // });
                // res.render('index', {
                    // static_path: 'static',
                    // theme: process.env.THEME || 'flatly',
                    // flask_debug: process.env.FLASK_DEBUG || 'false',
                    // slots: available,
                    // tomorrow: dateString,
                    // chosenDate: dateString
                // });
                // console.log(available);
            // });
          
          // client.close();
        // });
        res.render('index', {
                    static_path: 'static',
                    theme: process.env.THEME || 'flatly',
                    flask_debug: process.env.FLASK_DEBUG || 'false',
                    slots: available,
                    tomorrow: dateString,
                    chosenDate: dateString
                });
        
    });
    app.post('/bookslot', function(req, res) {
        var tomorrow = new Date();
        tomorrow = moment(tomorrow).add(1, 'days');
        tomorrow = moment(tomorrow).format("YYYY-MM-DD");
        
        var name = req.body.nameBook;
        var number = req.body.mobilenumberBook;
        var email = req.body.emailBook;
        var slot = req.body.slot;
        var comments = req.body.commentsBook;
        var date = req.body.date;
        const dateString = moment(date).format("YYYY-MM-DD");
        
        var available = [1,1,1,1,1,1,1];
        // Use connect method to connect to the server
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
          if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
            }
            console.log('Connected...');
          const collection = client.db(dbName).collection("Consultation");
          
          collection.insertOne({
                email: email,
                date: date,
                slot: slot,
              })
              .then(function(result) {
                // process result
                function queryCollection(collection, callback){
                    collection.find( { date: dateString } ).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length >= 0) {
                        callback(result);
                    }
                    });
                    }

                    queryCollection(collection, function(result){
                        //You can do more stuff with the result here
                        result.forEach(function(value) {
                            console.log(value);
                            available[value.slot-1] = 0;
                        });
                        
                        res.render('index', {
                            static_path: 'static',
                            theme: process.env.THEME || 'flatly',
                            flask_debug: process.env.FLASK_DEBUG || 'false',
                            slots: available,
                            tomorrow: tomorrow,
                            chosenDate: dateString
                        });
                        
                        client.close();
                    });
              })
        });
        var message = "Customer Name: " + name + "\n" +
                    "Customer Email: " + email + "\n" +
                    "Customer Number: " + number + "\n" +
                    "Comments: " + comments + "\n" +
                    "Slot: " + slot;
            
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'email',
                pass: process.env.EMAIL_PW
             }
        });
        
        // setup email data with unicode symbols
        var mailOptions; 
            
        
         mailOptions = {
            from: 'email', // sender address
            to: "xxx", // list of receivers
            subject: '[CASADEKO] Booking Consultation Slot', // Subject line
            text: message // plain text body
         };
        

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        

    });
    
    app.post('/changedate', function(req, res) {
        var tomorrow = new Date();
        tomorrow = moment(tomorrow).add(1, 'days');
        tomorrow = moment(tomorrow).format("YYYY-MM-DD");
        console.log("in change date");
        var date = req.body.date;
        const dateString = moment(date).format("YYYY-MM-DD");
        console.log(dateString);
        var available = [1,1,1,1,1,1,1];
        // Use connect method to connect to the server
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
          if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
            }
            console.log('Connected...');
          const collection = client.db(dbName).collection("Consultation");
          
          function queryCollection(collection, callback){
            collection.find( { date: dateString } ).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.length >= 0) {
                console.log(result);
                callback(result);
            }
            });
            }
            
            queryCollection(collection, function(result){
                //You can do more stuff with the result here
                result.forEach(function(value) {
                    console.log("Changedate" + value);
                    available[value.slot-1] = 0;
                });
                console.log("hre" +available);
               res.json({success : "Updated Successfully", status : 200, slot : available, tomorrow : tomorrow, chosenDate : date});
                
            });
          
          client.close();
        });
        
        
    });
    
    app.post('/freequote',function(req, res) {
        var tomorrow = new Date();
        tomorrow = moment(tomorrow).add(1, 'days').add(8,'hours');
        const dateString = moment(tomorrow).format("YYYY-MM-DD");
        console.log(dateString);
        var available = [1,1,1,1,1,1,1];
        // Use connect method to connect to the server
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
          if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
            }
            console.log('Connected...');
          const collection = client.db(dbName).collection("Consultation");
          
          function queryCollection(collection, callback){
            collection.find( { date: dateString } ).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.length >= 0) {
                callback(result);
            }
            });
            }

            queryCollection(collection, function(result){
                //You can do more stuff with the result here
                result.forEach(function(value) {
                    console.log(value);
                    available[value.slot-1] = 0;
                });
                res.render('index', {
                    static_path: 'static',
                    theme: process.env.THEME || 'flatly',
                    flask_debug: process.env.FLASK_DEBUG || 'false',
                    slots: available,
                    tomorrow: dateString,
                    chosenDate: dateString
                });
            });
          
          client.close();
        });
        
        var email = req.body.email;
        var name = req.body.name;
        var comments = req.body.comments;
        var number = req.body.mobilenumber;
        var message = "Customer Name: " + name + "\n" +
                    "Customer Email: " + email + "\n" +
                    "Customer Number: " + number + "\n" +
                    "Comments: " + comments ;
            
        var file = 0;
        console.log(req.body);
        console.log(req.files);
        
        if (typeof req.files.floorplan != 'undefined') {
            file = req.files.floorplan;
            console.log("File is not empty");
        } else{
            
            console.log("File is empty");
        }
        
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'xxx',
                pass: process.env.EMAIL_PW
             }
        });
        // setup email data with unicode symbols
        var mailOptions; 
            
        if(file !=0){
            mailOptions = {
            from: 'email', // sender address
            to: "xxx", // list of receivers
            subject: '[CASADEKO] Customer Enquiries/Free Quote', // Subject line
            text: message, // plain text body
            attachments: [{'filename': file.name, 'content': file.data}]
            //html: '<b>Hello world?</b>' // html body
            };
        } else{
            mailOptions = {
            from: 'email', // sender address
            to: "xxx", // list of receivers
            subject: '[CASADEKO] Customer Enquiries/Free Quote', // Subject line
            text: message // plain text body
            };
        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    
        
    });

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
