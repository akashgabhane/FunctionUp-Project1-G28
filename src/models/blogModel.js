const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim:true,
      required: [true, 'title should be present']
    },

    body: {
      type: String,
      trim:true,
      required: [true, 'body should have content']
    },

    tags: [
      {type: String,
       trim:true
      }
    ],

    category: {
      type: String,
      trim:true,
      required: [true,'Category should be present']
  },
    subcategory: [
      {type: String,
       trim:true
      }
    ],

    createdAt: Date,
    updatedAt: Date,

    deletedAt:{
      type: Date
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    publishedAt: {
      type: Date
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    authorId: {
      type: ObjectId,
      required: true,
      ref: "Author"
    }
  },  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema);
