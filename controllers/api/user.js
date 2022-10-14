const nodemailer = require("nodemailer");
const jwt =  require('jsonwebtoken');
const User = require('../../model/userSchema')

const Register =async (req,res)=>{
    try{
        const {fname,lname,email,phone,password,cpassword} = req.body;
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            // return res.status(400).send('User already exists')
            res.send({
                success: false,
                message: 'User already exists',
                statusCode: 400,
            })
        }
        else if(password !== cpassword){
            console.log('Password does not match')
            // return res.status(400).send('Password does not match')
            res.send({
                success: false,
                message: 'Password does not match',
                statusCode: 400,
            })
        }
        else {
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
                    // plain text body
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
           const datas =  await newUser.save()

            // res.status(200).send('User registered successfully')
            res.send({
                success: true,
                message: 'User registered successfully',
                statusCode: 200,
                datas: datas
            })
        }
    }
    catch(err){
        // console.log(err)
        // res.status(500).send(err)
        res.send({
            success: false,
            message: err.name,
            statusCode: 500,
        })
    }

}




const Login =async (req,res)=>{
    try {
        const{email,password} = req.body;
        const existinguser = await User.findOne({email:email});
            if(!existinguser){
                // console.log('User does not exist')
                // return res.status(400).send('User does not exist')
                res.send({
                    success: false,
                    message: 'User does not exist',
                    statusCode: 400,
                })
            }
            if(existinguser.password !== password ){
                // console.log('Password dogkjges not match')
                // return res.status(400).send('Password does not match')
                res.send({
                    success: false,
                    message: 'Authentication failed',
                    statusCode: 400,
                })
            }
            const payload = {user:{ id:existinguser.id}}
            jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:3600000},
            (err,token)=>{
                if(err) throw err;
                // return res.json({token})
                res.send({
                    success: true,
                    message: 'User Logged in successfully',
                    statusCode: 200,
                    data: token
                })
            })
    } 
    catch (error) {
        console.log(error)
        // return res.status(500).send("Server error")
        res.send({
            success: false,
            message: 'Server error',
            statusCode: 500,
        })
    }

}

const Myprofile =async (req,res)=>{

    try {
        const exist = await User.findById(req.user.id);
        if(!exist){
            // console.log('User not found')
            // return res.status(400).send('User not found').
            res.send({
                success: false,
                message: 'User not found',
                statusCode: 400,
            })
        }
        // console.log("fetching profile")
        // res.json(exist);
        res.send({
            success: true,
            message: 'Profile fetched successfully',
        })
    } catch (error) {
        // console.log(error)
        // return res.status(500).send("Server error")
        res.send({
            success: false,
            message: 'Server error',
            statusCode: 500,
        })
    }


}


module.exports = { Register, Login, Myprofile}