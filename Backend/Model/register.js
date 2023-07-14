const mongoose=require("mongoose");
const Schema=mongoose.Schema

const userSchema = new Schema({
      fullname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      require:true
    },
    mobileno:{
      type: String,
      validate: {
        validator: function(value) {
          const mobileNumberRegex = /^[0-9]{10}$/;
          return mobileNumberRegex.test(value);
        },
        message: 'Invalid mobile number format'
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/
    },
    password:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    city:{
      type:String,
      require:true
    }
    // resume:{
    //     type: Buffer,
    //     required: true,
    // },
    // photo:{
    //     type: Buffer,
    //     required: true,
    // }
  });

const registermodel=mongoose.model("UserRegister",userSchema);

module.exports={registermodel};