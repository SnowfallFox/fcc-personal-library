/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let good_id = '67361e4f7c92e0adf28d57e8'
let bad_id = '672cde44311196af0fd51708'
let delete_id = '673625d13e675d8b6da60180'

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
          chai
              .request(server)
              .keepOpen()
              .post('/api/books')
              .send({ title:'test POST for new title' })
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'application/json');
                  assert.property(res.body, '_id', 'book object should contain an ID property')
                  assert.property(res.body, 'title', 'book object should contain a title property')
                  assert.isString(res.body._id)
                  assert.isString(res.body.title)
                  assert.equal(res.body.title, 'test POST for new title')
                  done();
              });
      })
      test('Test POST /api/books with no title given', function(done) {
          chai
              .request(server)
              .keepOpen()
              .post('/api/books')
              .send({ })
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'text/html');
                  assert.isString(res.text)
                  assert.equal(res.text, 'missing required field title')
                  done();
              });
      });
    })
    suite('GET /api/books => array of books', function(){
      test('Test GET /api/books',  function(done){
          chai
              .request(server)
              .keepOpen()
              .get('/api/books')
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.isArray(res.body);
                  assert.property(res.body[0], '_id', 'object in array should have ID')
                  assert.property(res.body[0], 'title', 'object in array should have title')
                  assert.property(res.body[0], 'commentcount', 'object in array should have commentcount')
                  assert.property(res.body[0], 'comments', 'object in array should have comments array')
                  done();
              });
      });      
    });
    suite('GET /api/books/[id] => book object with [id]', function(){
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai
              .request(server)
              .keepOpen()
              .get(`/api/books/${bad_id}`)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'text/html');
                assert.isString(res.text)
                assert.equal(res.text, 'no book exists')
                  done();
              });
      })
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai
              .request(server)
              .keepOpen()
              .get(`/api/books/${good_id}`)
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'application/json');
                  assert.property(res.body, '_id', 'object in array should have ID')
                  assert.property(res.body, 'title', 'object in array should have title')
                  assert.property(res.body, 'comments', 'object in array should have comments array')
                  done();
              });
      });
    })
    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      test('Test POST /api/books/[id] with comment', function(done){
          chai
              .request(server)
              .keepOpen()
              .post(`/api/books/${good_id}`)
              .send({ comment:'yay!' })
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'application/json');
                  assert.property(res.body, '_id', 'object in array should have ID')
                  assert.property(res.body, 'title', 'object in array should have title')
                  assert.property(res.body, 'comments', 'object in array should have comments array')
                  assert.isArray(res.body.comments)
                  done();
              });
      })
      test('Test POST /api/books/[id] without comment field', function(done){
          chai
              .request(server)
              .keepOpen()
              .post(`/api/books/${good_id}`)
              .send({ })
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'text/html');
                  assert.isString(res.text)
                  assert.equal(res.text, 'missing required field comment')
                  done();
              });
      })
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
          chai
              .request(server)
              .keepOpen()
              .post(`/api/books/${bad_id}`)
              .send({ comment:'yay!' })
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'text/html');
                  assert.isString(res.text)
                  assert.equal(res.text, 'no book exists')
                  done();
              });
      })
    });
    suite('DELETE /api/books/[id] => delete book object id', function() {
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
          chai
              .request(server)
              .keepOpen()
              .delete(`/api/books/${delete_id}`)
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'text/html');
                  assert.isString(res.text)
                  assert.equal(res.text, 'delete successful')
                  done();
              });
      })
      test('Test DELETE /api/books/[id] with  id not in db', function(done){
          chai
              .request(server)
              .keepOpen()
              .delete(`/api/books/${bad_id}`)
              .end(function (err, res) {
                  assert.equal(res.status, 200);
                  assert.equal(res.type, 'text/html');
                  assert.isString(res.text)
                  assert.equal(res.text, 'no book exists')
                  done();
              });
      });
    });
  });
});
