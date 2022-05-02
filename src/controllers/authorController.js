const AuthorModel= require("../models/authorModel")

//------------------------------------------------Author Validation ------------------------------------------------------------------------

const handleError= (err) =>{

let errors = { fname: '',lname: '', title: '', email:'',password:''}

if(err.code ===11000){
    errors.email ='the email is already registered'
    Object.keys(errors).forEach(k => (!errors[k] && errors[k] !== undefined) && delete errors[k]);
    return errors;
  }

if (err.message.includes('Author validation failed')){

  Object.values(err.errors).forEach(({properties}) => {
   errors[properties.path]= properties.message;
  });
  
Object.keys(errors).forEach(k => (!errors[k] && errors[k] !== undefined) && delete errors[k]);

return errors;
}}

//------------------------------------------------Create Author ------------------------------------------------------------------------

const createAuthor= async function(req,res) {
try{
    let data = req.body
    
    let author = await AuthorModel.create(data)
    res.status(201).send({status:true, data: author })
  
}catch (error) {
  const errors = handleError(error)
  res.status(400).send({status:false,errors})
  }
}

module.exports.createAuthor = createAuthor
