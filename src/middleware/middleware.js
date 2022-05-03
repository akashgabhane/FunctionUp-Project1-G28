const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");

let authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"];

    if (!token) {
      res.status(401).send({ status: false, msg: "Token must be present" });
    } else {
      let decodedToken = jwt.verify(token, "project1-28");
      if (!decodedToken) {
        return res.status(403).send({ status: false, msg: "token is invalid" });
      }
      req.dataFromauthentication= decodedToken
      next();
    }
  } catch (err) {
    res.status(500).send({status:false, msg: "Error", error: err.message });
  }
};




let authorisation = async function (req, res, next) {
  try {

    let decodedToken= req.dataFromauthentication
    
    let blogid = req.params.blogId;
    if(blogid){
      let authorid = await blogModel.find({_id:blogid}).select({authorId:1})
      if(authorid.length<=0){
        return res.status(404).send({status: false,msg: "Incorrect blogid"});
      }
      let userLoggedIn = decodedToken.authorId;
      if (authorid[0].authorId != userLoggedIn){
        return res.status(403).send({status: false,msg: "You are not Authorised"});
      } 
    } else{
      let data= req.query;

      if (Object.keys(data) == 0) {
        return res.status(400).send({ status: false, msg: "Input Missing" });
      }
      let find= await blogModel.find({$and:[data,{isDeleted:false}]})  
      if (find.length<=0)
      {
        return res.status(404).send({status:false,msg: "no blog found with the id match"})
      }
      let validation= decodedToken.authorId
      let loginAuthorid = await blogModel.find({$and:[data,{authorId:validation}]}).select({authorId:1})
      if(loginAuthorid<=0){
        return res.status(403).send({status: false,msg: "You are not Authorised"});
      }
      req.key=loginAuthorid;
    }

    next();
  } catch (err) {
    res.status(500).send({status:false, msg: "Error", error: err.message });
  }
};

module.exports.authentication = authentication;
module.exports.authorisation = authorisation;