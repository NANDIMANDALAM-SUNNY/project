const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require("nodemailer");
const jwt =  require('jsonwebtoken');
const User = require('./model/userSchema');
const middleware = require('./middleware/middleware');
const app = express();
require('dotenv').config();


// connecting to mongoose
mongoose.connect(process.env.DB, { useNewUrlParser: true , useUnifiedTopology: true })
        .then(() => console.log('DB connected'))
        .catch(err => console.log(err))




app.use(express())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({origin:"*"}))


app.get('/',(req,res)=>{
    res.send('Hello World')
})





// 
// register route
app.post('/register',async (req,res)=>{
    try{
        const {fname,lname,email,phone,password,cpassword} = req.body;
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            console.log('User already exists')
            return res.status(400).send('User already exists')
        }
        else if(password !== cpassword){
            console.log('Password does not match')
            return res.status(400).send('Password does not match')
        }
        else {
            // var uniqueString = "123456"
            // const isValid = false
            // const {email} = req.body
            const newUser = new User({fname,lname,email,phone,password,cpassword});
           
        const sendEmail=(email,uniqueString)=>{
            var transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'n.sunny170@gmail.com',
                    pass:'qtiwwndcrnrepjzj'
                },
                tls:{
                    rejectUnauthorized:false
                }
            }); 
           console.log(uniqueString)
           var  mailOptions={
                    from: "myemail@gmail.com",
                    to: email,
                    subject: "Account Confirmation",
                    text: "Your Account has been succesfully created", 
                     html:`
                    <div style="margin:50px">
                    <div style=" border: 1px solid black;border-radius: 30px;padding:20px ">
                    <h3>Thank you for joining with us</h3>
                        <p>You will get notified for the latest news and updates</p>
                       
                        <img width="200px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQKfVYiWBAIiYbX252T8tlMEDMoOZdTWf52sv3mFFV&s"  />
                    </div>
                <p style="color:grey">You're receiving this email because this gmail account is associated with us.</p>
                 </div>
                    `
            }
             transporter.sendMail(mailOptions, function(error, response) {
                         if (error) {
                             console.log(error);
                             return;
                         }
                         console.log('Message sent');
                         transporter.close();
                     });
            
            
            }
            sendEmail(email)
            await newUser.save()

            console.log('User created')
            res.status(200).send('User registered successfully')
        }
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})




app.post('/login',async (req,res)=>{
        try {
            const{email,password} = req.body;
            const existinguser = await User.findOne({email:email});
                if(!existinguser){
                    console.log('User does not exist')
                    return res.status(400).send('User does not exist')
                }
                if(existinguser.password !== password ){
                    console.log('Password dogkjges not match')
                    return res.status(400).send('Password does not match')
                }
                const payload = {user:{ id:existinguser.id}}
                jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:3600000},
                (err,token)=>{
                    if(err) throw err;
                    return res.json({token})
                })
        } 
        catch (error) {
            console.log(error)
            return res.status(500).send("Server error")
        }
})

// protecting routes
app.get('/myprofile',middleware,async (req,res)=>{
    try {
        const exist = await User.findById(req.user.id);
        if(!exist){
            console.log('User not found')
            return res.status(400).send('User not found')
        }
        console.log("fetching profile")
        res.json(exist);
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server error")
    }
})




// estalishing Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}
);








// const _ = require('lodash')
// const arr = [
//     {
//         name:"sunny",
//         age:1
//     },
//     {
//         name:"sunnytest",
//         age:2
//     }
// ]

// //        const img =  _.map(allDetails, i => _.pick(i, '_id', 'img','date'))  
       

// let mapped_array1 = _.map(arr, 'name');
  
// // Printing the output 
// console.log(mapped_array1);
       
// // Original array 
// var users = [
//   { 'user': 'jonny' },
//   { 'user': 'john' }
// ];
   
// // Use of _.map() method
// // The `_.property` iteratee shorthand
// let mapped_array = _.map(users, 'user');
  
// // Printing the output 
// console.log(mapped_array);
