const mongoose = require("mongoose");
// require("mongoose-type-email");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      trim:true,
      required:[true, 'please enter your first name buddy']
    },
    lname: {
      type: String,
      trim:true,
      required: [true, 'Do not forget your last name bro']
    },

    title: {
      type: String,
      required: [true, 'title can only be Mr/Mrs/Miss'],
      enum: ["Mr", "Mrs", "Miss"],
    },
    email: {
      type: String,
      // type: mongoose.SchemaTypes.Email,
      required: [true, 'email should be present'],
      unique: true,
      trim:true,
      lowercase:true,
      validate: {
        validator: function(email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter a valid email", isAsync: false
    }
    },
    password: {
      type: String,
      trim:true,
      required: [true, 'Password is required']
    },
  },{ timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
