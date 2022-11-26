var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var bodyParser = require('body-parser')
const mysql = require('mysql');
const moment = require('moment');
const cors = require('cors');
const { application } = require('express');

var server = express();
var data

server.use(cors({
  origin: '*'
}));

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'app_covid19'
  })

  const query = "WITH added_row_number AS ("
  +"SELECT"
   + "*,"
    +" ROW_NUMBER() OVER(PARTITION BY state ORDER BY tot_cases DESC) as row_n "
  +"FROM app_covid19.records_covid19) "
  +"SELECT"
    +"*"
  +"FROM added_row_number "
  +"WHERE row_n = 1"

  var schema = buildSchema(`
  type covid19Payload{
    id: ID,
    state: String!
    tot_cases: Int!
    new_case: Int!
    tot_death: Int!
    new_death: Int!
  }
  type baseQuery {
    covid19Payload : [covid19Payload!]!
  }
  schema {
    query: baseQuery
  }
`)

var root = { 
    covid19Payload : ()=>{
     return data
      }
    };


connection.connect()

connection.query(query, (err, rows, fields) => {
if (err) throw err
data = rows
})


server.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

server.listen(4000);