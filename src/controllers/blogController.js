const {count} = require("console")
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

//------------------------------------------------Blog Validation------------------------------------------------------------------------

const handleError= (err) =>{

let errors = {title: '',body: '', category: ''}

 if (err.message.includes('blog validation failed')){

  Object.values(err.errors).forEach(({properties}) => {
   errors[properties.path]= properties.message;
  });

 Object.keys(errors).forEach(k => (!errors[k] && errors[k] !== undefined) && delete errors[k]);

  return errors;
 }}


//------------------------------------------------Create Blog------------------------------------------------------------------------

const createblog = async function (req, res) {
try{

  let data = req.body;
  
  let authorid = data.authorId;
  if (!authorid){
    return res.status(400).send({status:false, error: "please provide Author Id"})
   }
  const find = await authorModel.find({ _id: authorid });
  
  if (find.length <= 0) {
    return res.status(400).send({status:false,error:"please provide valid user"});
  }

  let blogCreated = await blogModel.create(data);
  res.status(201).send({status:true, data: blogCreated });
 } catch (error) {
  const errors = handleError(error)
  res.status(400).send({status:false,errors})
 }
};

//------------------------------------------------Get Data------------------------------------------------------------------------

const getdata = async function (req, res) {
try{

  let data = req.query;
  // if ( Object.keys(data).length == 0){
  //  return res.status(400).send({status:false, msg: "Input Missing"})
  // }

  let find = await blogModel.find({$and:[{ isDeleted: false },{ isPublished: true},data]});
  if (find.length <= 0){
    return res.status(404).send({status:false, error: "No match found for the given criteria" });
  }

  let findWithAuthorDetails = await blogModel.find({$and:[{ isDeleted: false },{ isPublished: true},data]}).populate("authorId");
  res.status(200).send({status:true,data: findWithAuthorDetails});

 }catch (error) {
   return res.status(500).send({status:false, error: error.message });
 }
};

//------------------------------------------------Update Blog------------------------------------------------------------------------

const updateBlog = async function (req, res) {
  try {

    let data = req.body;
    if (Object.keys(data)==0){
      return res.status(400).send({status:false, msg:"No Update Changes Has Been Given"})
    }
    let blogId = req.params.blogId;
    let id = await blogModel.findById(blogId);
    if (id) {
      if (id.isDeleted === false) {
       
        // let x = await blogModel.find({ _id: blogId }).select({ tags: 1 });

        // let a = [];
        
        // for (let i = 0; i < x.length; i++) {
        //   a.push(x[i].tags);
        // }
        // a.push(data.tags);
        // let b = a.flat()
       
        // if (data.tags) {
        //   let updatedBlog = await blogModel.findOneAndUpdate(
        //     { _id: blogId },
        //     { $set: { tags: b } },
        //     { new: true, upsert: true }
        //   );
        // }

        if (data.tags) {
          let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $push: {tags:data.tags} },
            { new: true, upsert: true }
          );
        }

        // let y = await blogModel
        //   .find({ _id: blogId })
        //   .select({ subcategory: 1 });

        // let c = [];
        // for (let i = 0; i < y.length; i++) {
        //   c.push(y[i].subcategory);
        // }

        // c.push(data.subcategory);
        // let d = c.flat();

        // if (data.subcategory) {
        //   let updatedBlog = await blogModel.findOneAndUpdate(
        //     { _id: blogId },
        //     { $set: { subcategory: d } },
        //     { new: true, upsert: true }
        //   );
        // }
         if (data.subcategory) {
            let updatedBlog = await blogModel.findOneAndUpdate(
              { _id: blogId },
              { $push: { subcategory: data.subcategory } },
              { new: true, upsert: true }
            );
          }

        let updatedBlog = await blogModel.findOneAndUpdate(
          { _id: blogId },
          { $set: { title: req.body.title, body: req.body.body, isPublished:true, publishedAt: Date.now() } },
          { new: true, upsert: true }
        );
        return res.status(200).send({status:true, msg: "Blog Updated Successfully", updatedBlog });
      } else {
        return res.status(404).send({status:false, error: "Blog does not exists" });
      }
    } else {
      return res.status(404).send({ status:false,error: "Blog Id Not Found" });
    }
  } catch (error) {
    return res.status(500).send({status:false, error: error.message });
  }
};

//------------------------------------------------Delete From Database------------------------------------------------------------------------

const deletedata = async function(req,res){

try{
  
   id= req.params.blogId
   let find= await blogModel.find({$and:[{_id:id}, {isDeleted: false}]})
   if (find.length<=0)
   {
     return res.status(404).send({status:false,msg: "no blog found with the id match"})
   }
 
   let match= await blogModel.findOneAndUpdate({_id:id}, {$set: {isDeleted: true,deletedAt: Date.now()}},{ new: true, upsert: true })
   res.status(200).send({status:true,data:match})
}
   catch (error) {
      return res.status(500).send({status:false, error: error.message });
    }
 }

 //------------------------------------------------Delete By Query ------------------------------------------------------------------------

 const queryDeleted = async function (req, res) {
  try {
    
    let data = req.query;
    let key=req.key[0].authorId

   let deleted = await blogModel.updateMany({$and:[{authorId:key},data]},{isDeleted: true, deletedAt: Date.now()},{ new: true});
    return res.status(200).send({status:true,data: deleted });
 
  } catch (error) {
    return res.status(500).send({status:false, error: error.message });
  }
};


//------------------------------------------------Login User ------------------------------------------------------------------------


const loginUser=async function(req,res){

let email = req.body.email;
let password = req.body.password;

let match = await authorModel.findOne({email:email,password:password})
if(!match){
  res.status(400).send({status:false,msg: "Email/Password is incorrect"})
}else{

  let token = await jwt.sign({
   authorId: match._id.toString(),
   Project : "bloggingSite"
  },
  "project1-28"
  );
  res.status(201).send({status: true, data: token });
};
}


module.exports.createblog = createblog;
module.exports.getdata = getdata;
module.exports.updateBlog = updateBlog;
module.exports.queryDeleted = queryDeleted;
module.exports.deletedata = deletedata
module.exports.loginUser = loginUser