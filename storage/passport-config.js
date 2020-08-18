const bcrypt= require('bcrypt')
const   LocalStrategy= require('passport-local').Strategy
const path       = require('path');
const users = require(path.join(__dirname,"../server/userdbref.js"));

 function initialize(passport){
   const authencticateuser = async  (email, password,done) => {
      try{
        user = users.find({ 'email' : email }, function (err, docs) {
        if (err) {
            console.log("something is wrong");
        } 
        else if (docs.length >0){
            console.log(docs.length);
            let verified = bcrypt.compareSync(password, docs[0].password);
            if(verified){
              return done(null, docs[0])
            }
            else{
              return done(null, false, {message:"passwords incorrect"})
            } 
        }
        else{
          return done(null,false,{message: "no user with that email"})
        }
      });
      }
      catch (e){
         return done(e) 
      }
    }
  passport.use(new LocalStrategy({
    usernameField: 'email'  
  }, authencticateuser ))
  passport.serializeUser((user,done) =>  done(null, user.id))
  async function getUserById(id){
    await users.find({ "id" : id }, function (err, docs) {
      if (err) {
    console.log("something is wrong");
     } else if (docs.length >0){
          return docs;
      }
    })
  };
  passport.deserializeUser((id,done) => { return done(null, getUserById(id))})
}

module.exports= initialize;