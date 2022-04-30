const {count} = require("console")
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");





const handleError= (err) =>{

  console.log(err.message, err.code)
   let errors = {title: '',body: '', category: ''}

  

 if (err.message.includes('blog validation failed')){

  Object.values(err.errors).forEach(({properties}) => {
   errors[properties.path]= properties.message;
  });

  return errors;
 }}

//------------------------------------------------Solution 2 ------------------------------------------------------------------------
const createblog = async function (req, res) {
try{
  let data = req.body;

  console.log(data.category)

  // if(!data.category){

  //  return res.send("category is missing")
  // }
  authorid = data.authorId;

  const k = await authorModel.find({ _id: authorid });
  console.log(k)
  if (k.length <= 0) {
    return res.status(400).send("please provide valid user");
  }

  let blog = await blogModel.create(data);
  res.status(200).send({ data: data });
 } catch (error) {

  const errors = handleError(error)
  res.send({errors})
  //  return res.status(500).send({ error: error.message });
 }
};

//------------------------------------------------Solution 3 ------------------------------------------------------------------------

const getdata = async function (req, res) {
try{
 let data = req.query;

  let find = await blogModel.find({$and: [{ isDeleted: false }, { isPublished: true }, data]});

  if (find.length <= 0) {return res.status(400).send({ error: "No match found for the given criteria" });}
  res.status(200).send({data:find });

 }catch (error) {
   return res.status(500).send({ error: error.message });
 }
};

//------------------------------------------------Solution 4 ------------------------------------------------------------------------

const updateBlog = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params.blogId;

    let id = await blogModel.findById(blogId);
    if (id) {
      if (id.isDeleted === false) {
        if (id.isPublished === true) {
          let updatedDate = await blogModel.findOneAndUpdate({ _id: blogId },{ $set: { publishedAt: Date.now() } });
        }

        let x = await blogModel.find({ _id: blogId }).select({ tags: 1 });

        let a = [];
        for (let i = 0; i < x.length; i++) {
          a.push(x[i].tags);
        }
        a.push(data.tags);
       
        let b = a.flat()
      
        if (data.tags) {
          let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { tags: b } },
            { new: true, upsert: true }
          );
        }

        let y = await blogModel
          .find({ _id: blogId })
          .select({ subcategory: 1 });

        let c = [];
        for (let i = 0; i < y.length; i++) {
          c.push(y[i].subcategory);
        }

        c.push(data.subcategory);
        let d = c.flat();

        if (data.subcategory) {
          let updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: { subcategory: d } },
            { new: true, upsert: true }
          );
        }

        let updatedBlog = await blogModel.findOneAndUpdate(
          { _id: blogId },
          { $set: { title: req.body.title, body: req.body.body } },
          { new: true, upsert: true }
        );
        return res
          .status(200)
          .send({ msg: "Blog Updated Successfully", updatedBlog });
      } else {
        return res.status(404).send({ error: "Blog does not exists" });
      }
    } else {
      return res.status(404).send({ error: "Blog Id Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

//------------------------------------------------Solution 5 ------------------------------------------------------------------------

const deletedata = async function(req,res){
try{
   id= req.params.blogId
   let match1= await blogModel.find({$and:[{_id:id}, {isDeleted: false}]})
   if (match1.length<=0)
   {
     return res.status(404).send({msg: "no blog found with the id match"})
   }
 
   let match= await blogModel.findOneAndUpdate({_id:id}, {$set: {isDeleted: true}},{ new: true })
   res.status(200).send(match)
}
   catch (error) {
      return res.status(500).send({ error: error.message });
    }
 }

 //------------------------------------------------Solution 6 ------------------------------------------------------------------------

const queryDeleted = async function (req, res) {
  try {
    let data = req.query;
    if (Object.keys(data) === 0)
      return res.status(400).send({ status: false, msg: "Input Missing" });

    let deleted = await blogModel.updateMany(
      { $and: [data, { isPublished: false }] },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!deleted)
      return res.status(404).send({ status: false, msg: "Blog Not Found" });
    return res.status(200).send({ status: true, data: deleted });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports.createblog = createblog;
module.exports.getdata = getdata;
module.exports.updateBlog = updateBlog;
module.exports.queryDeleted = queryDeleted;
module.exports.deletedata = deletedata