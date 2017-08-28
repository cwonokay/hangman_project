const express  = require("express");
const router   = express.Router();
const fs       = require("fs");
const words    = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

let targetWord  = words[Math.floor(Math.random()*words.length)];
let lettersGuessed = [];
let maxLives   = 8;
let messages = [];
let obj;
let underscore = [];
let no;
let randomWord  = targetWord.split("");
let wrongLetters = [];

console.log(targetWord);
console.log(randomWord);

randomWord.forEach(function (dash) {
  underscore.push("_")
})
function reset() {
  targetWord  = words[Math.floor(Math.random()*words.length)];
  lettersGuessed = [];
  maxLives   = 8;
  messages = [];
  obj;
  underscore = [];
  no;
  randomWord  = targetWord.split("");
  wrongLetters = [];

  randomWord.forEach(function (score) {
    underscore.push("_");
  });
}

router.get("/", function(req, res) {
  res.render("game" , {objects: obj, dash:underscore , counter: maxLives, no: no});
  messages = [];
  no ="";
});

router.get("/loser", function (req , res) {
res.render("loser", {targetWord});
});

router.get("/winner", function (req , res) {
res.render("winner");
});

router.post("/", function(req, res) {
let matching = false;
let guessed = false;
   req.checkBody("guess", "cannot be empty.").notEmpty();
   req.checkBody("guess", "Cannot exceed 1 letter at a time").isLength({max:1});
   req.checkBody("guess", "Cannot have special characters ").isAlpha();

   lettersGuessed.push(req.body.guess);


  let errors = req.getValidationResult();


  errors.then(function(result) {

     result.array().forEach(function(error) {
          console.log(error);
          if (error) {
         messages.push(error.msg);
         res.redirect('/');
       }

     });

     });

     obj = {
      errors: messages,
      lettersGuessed: lettersGuessed

};



for (var i = 0; i < randomWord.length; i++) {
 let corretLetter = randomWord[i];
   if (corretLetter === req.body.guess) {
       underscore[i] = randomWord[i];
       matching = true;
   }

 }


 for (var i = 0; i < wrongLetters.length; i++) {
   if (wrongLetters[i] === req.body.guess) {
     no = "you already used this letter";
     matching = true;
     res.redirect("/");
   }
 }


  if (!matching) {
    maxLives--;
    if (maxLives === 0) {
      res.redirect("/loser")
    } else{
      res.redirect("/")
    }
  };


 if(req.body.guess){
   wrongLetters.push(req.body.guess);
 };

 if ( underscore.toString() === randomWord.toString() ) {
   res.redirect("/winner");
 }
 console.log("this is underscore " + underscore.toString());

 console.log("this the randomWord " + randomWord.toString());

});


router.post("/loser", function (req, res) {
  req.session.destroy();
  reset();
   res.redirect("/");
});

router.post("/winner", function (req, res) {
  req.session.destroy();
  reset();
   res.redirect("/");
});





  module.exports = router
