const express = require('express');
const app = express();

app.listen(3000, function () {
	console.log('Servidor rodando na porta 3000');
});

var path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname , 'views'))
app.get('/', (req, res)=> {
	res.render('pages/index.ejs')
})