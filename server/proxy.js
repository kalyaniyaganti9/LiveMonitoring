const express    = require('express');
const session    = require('express-session');
const flash    = require('express-flash');
const path       = require('path');
const config     = require(path.join(__dirname,"../config/global.json"));
const storage    = path.join(__dirname,"../"+config.Proxy.settings.storage_path);
const port       = config.Proxy.settings.port;
const app        = express();
const methodOverride = require('method-override')
const bcrypt = require('bcrypt');
const passport= require('passport');
const users = require('./userdbref');
const cors = require('cors');
//const users = [];
const initializePassport = require(path.join(storage+'/passport-config.js'));
initializePassport(passport);
/**
 *   Storage
 */
app.use(cors({
    origin: true,
    credentials: true
  }))
app.use(express.static(path.join(__dirname,"../"+config.Proxy.settings.storage_path)));
app.set('view-engine','ejs');
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(methodOverride('_method'))
app.use(session({
   secret: "secret",
   resave: false,
   saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/',checkAuthenticated,function (req, res) {
    res.render(path.join(storage+'/index.html'));
    //console.log(req.user.name)
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/appview.html' )
    }
    next()
  }
  

app.get('/stream',checkAuthenticated,checkNotAuthenticated, function (req, res) {
    res.sendFile(path.join(storage+'/stream.html'));
});

app.get('/view',checkAuthenticated, checkNotAuthenticated,function (req, res) {
    res.sendFile(path.join(storage+'/view.html'));
});

app.get('/appview',checkAuthenticated, checkNotAuthenticated,function (req, res) {
    res.sendFile(path.join(storage+'/appview.html'));
});

app.get('/login',checkNotAuthenticated, function (req, res) {
    res.render(path.join(storage+'/login.ejs'));
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect:'/appview',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register',checkNotAuthenticated, function (req, res) {
    res.render(path.join(storage+'/register.ejs'));
});

app.post('/register',checkNotAuthenticated, async (req, res) => {
    try{
       const hashedPassword= await bcrypt.hash(req.body.password,10);
       if(req.body.email==='kalyaniyaganti9@gmail.com' && users.length<=1){
       users.insert({
           id: Date.now().toString(),
           name: req.body.name,
           email: req.body.email,
           password: hashedPassword
       })
        res.redirect('/login')
      }
      else{
           console.log("regsitration not possible")
           res.redirect('/register')
        }
    }
    catch{
        res.redirect('/register')
    }
    //console.log(users)
});

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
app.listen(port, () => console.log(
`[+] Proxy Server   : http://localhost:${port}
[+] Storage Path   : ${storage}
[~] Running Proxy Server...`));