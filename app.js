const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.set('strictQuery', true);
const port = 3000;

app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

const conn = mongoose.connect("mongodb+srv://admin-mank:mankMongo@cluster0.5sulplv.mongodb.net/wikiDB", {useNewUrlParser: true}, ()=>{console.log("Connected");});
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

//For home page 
app.get("/", function(req, res){
    myobj = {
        title: "Welcome to the home page of Mayank's API",
        content: "Use /articles in url to access the data, API built for learning purpose and can handle PUSH, POST, PUT, GET, PATCH requests."
    };
    res.send(myobj);
})
 
//Route should be same for the REST Api 
//Get request
//Chained method for the route method of express
app.route("/articles")
.get((req, res)=>{
    try{
        Article.find(function(err, foundArticles){
            if (err){
                res.send(err);
            }
            res.send(foundArticles);
        });
    }
    catch(e){
        res.send("No articles in the API");
    }
})
.post((req, res)=>{
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
    });
})
.delete( (req,res)=>{
    Article.deleteMany({}, (err)=>{
        if (err){
            res.send(err);
        }
        res.send("Successfully deleted all articles");        
    })
});

//To us a paramaterized URL
app.route("/articles/:articleTitle")
.get((req, res)=>{

    Article.findOne({title : req.params.articleTitle}, (err, foundArticle)=>{
        if (err){
            res.send("Route not received");
        }
        res.send(foundArticle);
    })
})

.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
          if(!err){
            res.send("Successfully updated article.");
          } else {
            res.send(err);
          }
        }
    );
})

.delete((req, res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if (!err){
                res.send("Successfully removed the "+req.params.articleTitle+" article");
            }else{
                res.send(err);
            }
        }
    )
});

app.listen(port, (req, res)=>{
    console.log("Server started at port 3000");
})