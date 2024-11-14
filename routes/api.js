/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, { dbName:'Library' });

const bookSchema = new mongoose.Schema({
  title: { type:String },
  commentcount: { type:Number, default:0 },
  comments: { type:Array }
});
const book = mongoose.model('books', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = await book.find({}, { __v:0 })
      res.json(books)
    })
    
    .post(async function (req, res) {
      //response will contain new book object including atleast _id and title
      let title = req.body.title;

      if (!title) {
        res.send('missing required field title');
      } else {
        let query = await book.find({ title:title }, { __v:0 });
        if (query[0]) {
          res.json({ _id:query[0]._id, title:query[0].title })
        } else {
          const newBook = new book({ title:title });
          await newBook.save();

          // grab ticket from DB and res.json
          query = await book.find({ title:title }, { __v:0 });
          res.json({ _id:query[0]._id, title:query[0].title })
        }
      }
      
      

    })
    
    .delete(async function(req, res) {
      //if successful response will be 'complete delete successful'
      await book.deleteMany({})
      res.send( 'complete delete successful' )
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookid = req.params.id;
      let query = await book.findById(bookid, { __v:0 });

      if (query) {
        res.json({ _id:query._id, title:query.title, comments:query.comments });
      } else {
        res.send('no book exists');
      }
    })
    
    .post(async function(req, res) {
      //json res format same as .get
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        res.send( 'missing required field comment' )
      } else {
        let query = await book.findById(bookid, { __v:0 })

        if (query) {
          query.comments.push(comment);
          query.commentcount+=1;
          await query.save();
          res.json({ _id:query._id, title:query.title, comments:query.comments })
        } else {
          res.send( 'no book exists' )
        }
      }
      
    })
    
    .delete(async function(req, res) {
      //if successful response will be 'delete successful'
      let bookid = req.params.id;
      let query = await book.findById(bookid);

      if (query) {
        await book.findByIdAndDelete(bookid);
        res.send( 'delete successful' );
      } else {
        res.send( 'no book exists' );
      }
    });
  
};
