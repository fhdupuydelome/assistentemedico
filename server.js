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

//rotas da view Pacientes
app.get('/paciente', (req, res) => {
	res.render('pages/pacientes/cadastrarPaciente.ejs');
})

app.get('/lista-paciente', (req, res) => {
	db.collection('paciente').find().toArray((err, results) => {
		if(err) return console.log(err);
		res.render('pages/pacientes/listarpacientes.ejs', {data: results});
	})
})

app.post('/salvaPaciente', (req, res) => {
	db.collection('paciente').save(req.body, (err, result) =>{
		if(err) return console.log(err);
		console.log('Salvo no banco de dados');
		res.redirect('/paciente');
	})
})

app.route('/editarPaciente/:id').get((req, res) => {
	var id = req.params.id;
	db.collection('paciente').find(ObjectId(id)).toArray((err, result) => {
		if (err) return res.send(err)
		res.render('./pages/pacientes/editarPaciente.ejs', {data: result});
	})
})
.post((req, res) => {
	var id = req.params.id;
	var nome = req.body.nome;
	var sobrenome = req.body.sobrenome;
	var cpf = req.body.cpf;
	var telefone = req.body.telefone;
	var logradouro = req.body.logradouro
	var numero = req.body.numero;
	var cidade = req.body.cidade;
	var estado = req.body.estado;
	db.collection('paciente').updateOne({_id: ObjectId(id)}, {
		$set: {
			nome: nome,
			sobrenome: sobrenome,
			cpf: cpf,
			telefone: telefone,
			logradouro: logradouro,
			numero: numero,
			cidade: cidade,
			estado: estado
		}
	}, (err, result) => {
		if(err) return res.send (err);
		res.redirect('/lista-paciente');
		console.log("Atualizado no banco de dados");
	});
});

app.route('/deletarPaciente/:id').get((req, res) => {
	var id = req.params.id;
	db.collection('paciente').deleteOne({_id: ObjectId(id)}, (err, result) => {
		if(err) return res.send(500, err);
		res.redirect('/lista-paciente');
		console.log('Deletado do Banco de Dados');
		
	});
});
//Fim das rotas da view Paciente

// ROtas da view medicamentos medicamentos
app.get('/cadastrarMedicamentos', function(req, res){
    res.render('./pages/medicamentos/cadastrar.ejs');
})

app.get('/show', (req, res) => {
  db.collection('medicamento').find().toArray((err, results) => {
      if (err) return console.log(err)
      console.log(results)
      res.render('show', {medicamento: results })

  })
})



app.post('/show', (req, res)=>{
    //criar a coleção medicamento, que irá armazenar nossos dados
    db.collection('medicamento').save(req.body, (err, result) => {
        if (err) return console.log(err)
     
        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
      })
});

app.route('/medicamentos/:id')
.get((req, res) => {
  var id = req.params.id
    db.collection('medicamento').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('medicamentos', { medicamento: result })
    })
})

.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var horas = req.body.horas
  var substancia = req.body.substancia
  var dosagem = req.body.dosagem
  var marca = req.body.marca
  var lab = req.body.lab
  var tomar = req.body.tomar
  var teste = req.body.teste
  
  db.collection('medicamento').updateOne({_id: ObjectId(id)}, {
      $set: {
        name:name,
        horas: horas,
        substancia:substancia,
        dosagem: dosagem,
        marca:marca,
        lab: lab,
        tomar:tomar,
        teste: teste
      }
    }, (err, result) => {
      if (err) return res.send(err)
      
      console.log('Banco Atualizado com Sucesso!')
      res.redirect('/show')
      
    })
})



//fim da rota pacientes

// rota de medicamentos
////////////////////////// CARREGAR PAG DE INSERIR DADOS /////////////////////////
app.get('/medicamentos', function(req, res){
  res.render('pages/medicamentos/index.ejs');
})

//////////////////////////////////    RENDERIZAR DADOS         ////////////////////////////////////////////////////////////
app.get('/listarmedicamentos', (req, res) => {
db.collection('medicamento').find().toArray((err, results) => { 
    if (err) return console.log(err)
    console.log(results)
    res.render('pages/medicamentos/visualizar.ejs', {medicamento: results })

})
})


app.post('/salvarmedicamentos', (req, res)=>{
  //criar a coleção medicamento, que irá armazenar nossos dados
  db.collection('medicamento').save(req.body, (err, result) => {
      if (err) return console.log(err)
   
      console.log('Salvo no Banco de Dados')
      res.redirect('/listarmedicamentos')
    })
});
/////////////////////////////////////////////////   EDITAR  ///////////////////////////////////////////////////////////////////

app.route('/editmedico/:id')

.get((req, res) => {
var id = req.params.id
  db.collection('medicamento').find(ObjectId(id)).toArray((err, result) => {
      if (err) return res.send(err)
      res.render('pages/medicamentos/editar.ejs', { medicamento: result })
  })
})

.post((req, res) => {
var id = req.params.id
var name = req.body.name
var horas = req.body.horas
var substancia = req.body.substancia
var dosagem = req.body.dosagem
var marca = req.body.marca
var lab = req.body.lab
var tomar = req.body.tomar
var teste = req.body.teste

db.collection('medicamento').updateOne({_id: ObjectId(id)}, {
    $set: {
      name:name,
      horas: horas,
      substancia:substancia,
      dosagem: dosagem,
      marca:marca,
      lab: lab,
      tomar:tomar,
      teste: teste
    }
  }, (err, result) => {
    if (err) return res.send(err)
    
    console.log('Banco Atualizado com Sucesso!')
    res.redirect('/listarmedicamentos')
    
  })
})


///////////////////////// DELETAR ///////////////
app.route('/delete/:id')
.get((req, res) => {
var id = req.params.id

db.collection('medicamento').deleteOne({_id: ObjectId(id)},
(err, result) => {
    if (err) return console.log(err)
    console.log('Valor removido com Sucesso!')
    res.redirect('/listarmedicamentos')
  })
})
//fim da rota de medicamentos