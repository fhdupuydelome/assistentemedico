const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0.ovuqo.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) =>{
	if(err) return console.log(err);
	db = client.db('assistentemedico');
	app.listen(3000, function () {
		console.log('Servidor rodando na porta 3000');
	});
});

app.use(bodyParser.urlencoded({extended: true}))
var path = require('path');
const { Db, ObjectID, ObjectId } = require('mongodb');
/*app.use(express.static('public'))*/
app.use('/static', express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname , 'views'))

app.get('/', (req, res) => {
	res.render('index.ejs')
})

//rotas da view Pacientes
app.get('/paciente', (req, res) => {
	res.render('./pages/pacientes/cadastrarPaciente.ejs');
})

app.get('/lista-paciente', (req, res) => {
	db.collection('paciente').find().toArray((err, results) => {
		if(err) return console.log(err);
		res.render('./pages/pacientes/listarpacientes.ejs', {data: results});
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