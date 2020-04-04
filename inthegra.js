const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.inthegra.strans.teresina.pi.gov.br/v1',
});

email = ''    
senha = ''
api_key = ''

class Veiculo{ 
    constructor(CodigoVeiculo, Lat, Long, Hora, Linha){
          this.CodigoVeiculo = CodigoVeiculo;
          this.Lat = Lat;
          this.Long = Long;
          this.Hora = Hora;
          this.Linha = Linha;    
    }  
}

class Linha{ 
    constructor(CodigoLinha, Denomicao, Origem, Retorno, Circular){
          this.CodigoLinha = CodigoLinha;
          this.Denomicao = Denomicao;
          this.Origem = Origem;
          this.Retorno = Retorno;
          this.Circular = Circular;                
    }  
}

class Parada{ 
    constructor(CodigoParada, Denomicao, Endereco, Lat, Long){
          this.CodigoParada = CodigoParada;
          this.Denomicao = Denomicao;
          this.Endereco = Endereco;
          this.Lat = Lat;
          this.Long = Long;                
    }  
} 

function GetHeaders(){
  var config = {
    headers:{
        'Content-Type': 'application/json',
        'Accept-Language': 'en',
        'Date': 'Wed, 13 Apr 2016 12:07:37 GMT', //TODO: Coletar data atual.
        'X-Api-Key': api_key,
    }
};
  return config;
}


async function getToken(){     
    var dados = '';
    const apiResponse = await api.post('/signin',{
    email: email, password: senha
}, GetHeaders()).then(function(response){
      dados = response.data;      
      return dados;
  }).catch(function (error) {
      console.log(error);
      return Promise.reject(error);
  });
      return dados;
}

//Retorna a localização de todos veículos por linhas, na última atualização de dados.
var onibus = [];
async function localizarTodosOnibus(){
  let config = GetHeaders();
  let token = await getToken().then(res =>{
    config['headers']['X-Auth-Token'] = res.token;
  });
  const result = await api.get('/veiculos', config).then(response => {    
    for(var k in response.data) {
      var linha = new Linha(
        response.data[k]['Linha']['CodigoLinha'],
        response.data[k]['Linha']['Denomicao'],
        response.data[k]['Linha']['Origem'],
        response.data[k]['Linha']['Retorno'],
        response.data[k]['Linha']['Circular'],                                                                                                    
      )
      for(var i in response.data[k]['Linha']['Veiculos']){
        const veiculos = new Veiculo(
          response.data[k]['Linha']['Veiculos'][i]['CodigoVeiculo'],
          response.data[k]['Linha']['Veiculos'][i]['Lat'],
          response.data[k]['Linha']['Veiculos'][i]['Long'],
          response.data[k]['Linha']['Veiculos'][i]['Hora'],
          linha                                                                   
          )
          onibus.push(veiculos)
      }console.log(onibus);
    }
  })
}

//Retorna a localização dos veículos em uma dada linha, na última atualização de dados.
var onibusEncontrados = [];
async function procurarOnibusPorLinha(codigoLinha){
  let config = GetHeaders();
  let token = await getToken().then(res =>{
    config['headers']['X-Auth-Token'] = res.token;
  });
  const result = await api.get('/veiculosLinha?busca=' + codigoLinha, config).then(response => {    
    for(var k in response.data) {
      var linha = new Linha(
        response.data[k]['Linha']['CodigoLinha'],
        response.data[k]['Linha']['Denomicao'],
        response.data[k]['Linha']['Origem'],
        response.data[k]['Linha']['Retorno'],
        response.data[k]['Linha']['Circular'],                                                                                                    
      )
      for(var i in response.data[k]['Linha']['Veiculos']){
        const veiculos = new Veiculo(
          response.data[k]['Linha']['Veiculos'][i]['CodigoVeiculo'],
          response.data[k]['Linha']['Veiculos'][i]['Lat'],
          response.data[k]['Linha']['Veiculos'][i]['Long'],
          response.data[k]['Linha']['Veiculos'][i]['Hora'],
          linha                                                                   
          )
          onibusEncontrados.push(veiculos)
      }console.log(onibusEncontrados);
    }
  })
}

var paradas = [];
async function localizarTodasParadas(){
  let config = GetHeaders();
  let token = await getToken().then(res =>{
    config['headers']['X-Auth-Token'] = res.token;
  });
  const result = await api.get('/paradas', config).then(response => {
    for(var k in response.data){
      var parada = new Parada(
        response.data[k]['CodigoParada'],
        response.data[k]['Denomicao'],
        response.data[k]['Endereco'],
        response.data[k]['Lat'],
        response.data[k]['Long'],                                                                                                    
      ) 
      paradas.push(parada)    
    }
  })
  console.log(paradas)
}

//Retorna todas as paradas que possuam o termo “ininga” na denominação ou no endereço.
var paradasEncontradasPorTermo = [];
async function procurarParadaPorTermo(termoParada){
  let config = GetHeaders();
  let token = await getToken().then(res =>{
    config['headers']['X-Auth-Token'] = res.token;
  });
  const result = await api.get('/paradas?busca=' + termoParada, config).then(response => {
    for(var k in response.data){
      var parada = new Parada(
        response.data[k]['CodigoParada'],
        response.data[k]['Denomicao'],
        response.data[k]['Endereco'],
        response.data[k]['Lat'],
        response.data[k]['Long'],                                                                                                    
      ) 
      paradasEncontradasPorTermo.push(parada)    
    }
  })
  console.log(paradasEncontradasPorTermo)
  console.log(paradasEncontradasPorTermo.length)
}

//Retorna todas as paradas da linha indicada.
var paradasEncontradasPorLinha = [];
async function procurarParadaPorLinha(codigoLinha){
  let config = GetHeaders();
  let token = await getToken().then(res =>{
    config['headers']['X-Auth-Token'] = res.token;
  });
  const result = await api.get('/paradasLinha?busca=' + codigoLinha, config).then(response => {
    for(var k in response.data.Paradas){
      var parada = new Parada(
        response.data['Paradas'][k]['CodigoParada'],
        response.data['Paradas'][k]['Denomicao'],
        response.data['Paradas'][k]['Endereco'],
        response.data['Paradas'][k]['Lat'],
        response.data['Paradas'][k]['Long'],                                                                                                    
      ) 
      paradasEncontradasPorLinha.push(parada)    
    }
  })
  console.log(paradasEncontradasPorLinha)
  console.log(paradasEncontradasPorLinha.length)
}



//Retorna todas as linhas disponíveis
var linhas = [];
async function localizarTodasLinhas(){
  let config = GetHeaders();
  let token = await getToken().then(res =>{
    config['headers']['X-Auth-Token'] = res.token;
  });
  const result = await api.get('/linhas', config).then(response =>{    
    for(var k in response.data){
      var linha = new Linha(
        response.data[k]['CodigoLinha'],
        response.data[k]['Denomicao'],
        response.data[k]['Origem'],
        response.data[k]['Retorno'],
        response.data[k]['Circular'],                                                                                                    
      ) 
      linhas.push(linha)    
    }
  })
  console.log(linhas)
  console.log(linhas.length)
}

//Retorna todas as linhas em que o parâmetro informado esteja na denominação, no ponto de origem ou ponto de retorno
var linhasEncontradas = [];
async function procurarLinha(termoLinha){
  let config = GetHeaders();
  let token = await getToken().then(res =>{
    config['headers']['X-Auth-Token'] = res.token;
  });
  const result = await api.get('/linhas?busca=' + termoLinha, config).then(response =>{    
    for(var k in response.data){
      var linha = new Linha(
        response.data[k]['CodigoLinha'],
        response.data[k]['Denomicao'],
        response.data[k]['Origem'],
        response.data[k]['Retorno'],
        response.data[k]['Circular'],                                                                                                    
      ) 
      linhasEncontradas.push(linha)    
    }
  })
  console.log(linhasEncontradas)
  console.log(linhasEncontradas.length)  
}

