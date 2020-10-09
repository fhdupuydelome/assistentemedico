const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const uri =
  'mongodb://fdupuy:097812@cluster0-shard-00-00.ptps8.mongodb.net:27017,cluster0-shard-00-01.ptps8.mongodb.net:27017,cluster0-shard-00-02.ptps8.mongodb.net:27017/assistentemedico?ssl=true&replicaSet=atlas-5iyjpj-shard-0&authSource=admin&retryWrites=true&w=majority';

app.use(bodyparser.urlencoded({ extended: true }));

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err);

  db = client.db('assistentemedico', { useUnifiedTopology: true });
  app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000');
  });
});

var path = require('path');
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/medicos-listar', (req, res) => {
  db.collection('medicos')
    .find()
    .toArray((err, results) => {
      if (err) return console.log(err);

      res.render('pages/medicos/lista.ejs', { data: results });
      console.log(results);
    });
});
//Rota cadastro
app
  .route('/medicos-cadastrar')
  .get((req, res) => {
    res.render('pages/medicos/cadastro.ejs');
  })
  .post((req, res) => {
    db.collection('medicos').insertOne(req.body, (err, result) => {
      if (err) return console.log(err);
      console.log('Salvo no banco de dados');
      res.redirect('/medicos-listar');
    });
  });

//Rota edição

app
  .route('/medicos-editar/:id')
  .get((req, res) => {
    var id = req.params.id;

    db.collection('medicos')
      .find(ObjectId(id))
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render('pages/medicos/editar.ejs', { data: result });
      });
  })
  .post((req, res) => {
    var id = req.params.id;
    var nome = req.body.nome;
    var sobrenome = req.body.sobrenome;
    var registro = req.body.registro;
    var especialidade = req.body.especialidade;
    var email = req.body.email;
    var telefone = req.body.telefone;

    db.collection('medicos').updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          nome: nome,
          sobrenome: sobrenome,
          registro: registro,
          especialidade: especialidade,
          email: email,
          telefone: telefone,
        },
      },
      (err) => {
        if (err) return console.log(err);
        res.redirect('/medicos-listar');
      }
    );
  });

app.route('/medicos-deletar/:id').get((req, res) => {
  var id = req.params.id;
  console.log(id);
  db.collection('medicos').deleteOne({ _id: ObjectId(id) }, (err) => {
    if (err) return res.send(500, err);

    res.redirect('/medicos-listar');
  });
});
