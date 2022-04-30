const AuthorModel= require("../models/authorModel")




const handleError= (err) =>{

  console.log(err.message, err.code)
   let errors = { fname: '',lname: '', title: '', email:'',password:''}

  if(err.code ===11000){

    errors.email =' the email is already registerd'
    return errors;
  }

 if (err.message.includes('Author validation failed')){

  Object.values(err.errors).forEach(({properties}) => {
   errors[properties.path]= properties.message;
  });

  return errors;

}}
//------------------------------------------------Solution 1 ------------------------------------------------------------------------

const createAuthor= async function(req, res) {
try{
    let author = req.body
    
    
   let authors = await AuthorModel.create(author)
  //  catch(error) {return res.send("make sure that you have enterend name , email and pasword are present  ")}
    res.send({data: authors})
 } catch (error) {

  
   const errors = handleError(error)
   res.send({errors})
        // return res.status(500).send("please make sure that firstname, lastname and other details are correctly entrerd");
      }
}

module.exports.createAuthor = createAuthor 
