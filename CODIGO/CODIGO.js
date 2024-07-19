const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const config = {
  user: '', 
  password: '',
  server: 'localhost', 
  database: 'registro',
  options: {
    trustedConnection: true, 
    encrypt: false, 
  }
};

sql.connect(config).then(pool => {
  if (pool.connected) {
    console.log('Conectado ao banco de dados SQL Server');
  }
}).catch(err => {
  console.error('Erro ao conectar ao banco de dados: ', err);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/CODIGO.html'); 
});

app.post('/formulario', (req, res) => {
  const { email, senha } = req.body;

  if (req.body.cadastrar) {
    const hashedSenha = bcrypt.hashSync(senha, 10);
    const sqlQuery = 'INSERT INTO clientes (email, senha) VALUES (@Email, @Senha)';

    sql.connect(config).then(pool => {
      return pool.request()
        .input('Email', sql.VarChar, email)
        .input('Senha', sql.VarChar, hashedSenha)
        .query(sqlQuery);
    }).then(result => {
      console.log('Usuário cadastrado com sucesso');
      res.send('Usuário cadastrado com sucesso');
    }).catch(err => {
      console.error('Erro ao cadastrar usuário: ', err);
      res.send('Erro ao cadastrar usuário');
    });
  } else if (req.body.login) {
    const sqlQuery = 'SELECT senha FROM clientes WHERE email = @Email';

    sql.connect(config).then(pool => {
      return pool.request()
        .input('Email', sql.VarChar, email)
        .query(sqlQuery);
    }).then(result => {
      if (result.recordset.length === 1 && bcrypt.compareSync(senha, result.recordset[0].senha)) {
        console.log('Login bem-sucedido');
        res.send('Login bem-sucedido');
      } else {
        console.log('Email não encontrado ou senha incorreta');
        res.send('Email não encontrado ou senha incorreta');
      }
    }).catch(err => {
      console.error('Erro ao realizar login: ', err);
      res.send('Erro ao realizar login');
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
