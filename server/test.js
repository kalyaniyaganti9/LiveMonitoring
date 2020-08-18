const users = require('./userdbref');
users.find({ 'email' : "kalyaniyaganti9@gmail.com" }, function (err, docs) {
    if (err) {
        console.log("something is wrong");
    } else if (docs.length >0){
        console.log(docs);
        return docs;
    }
  });