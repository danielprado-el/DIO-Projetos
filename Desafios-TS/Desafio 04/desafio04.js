"use strict";
// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela
// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
let apiKey;
let requestToken;
let username;
let password;
let sessionId;
let listId;
let nomeLista;
let descricao;
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let searchContainer = document.getElementById('search-container');
let listButton = document.getElementById('create-list-button');
let listContainer = document.getElementById('list-container');
let listButtonCancel = document.getElementById('list-button-cancel');
let listButtonCreate = document.getElementById('list-button-create');
let ShowListButton = document.getElementById('show-list-button');
let ShowListButtonCancel = document.getElementById('show-list-button-cancel');
let ShowListContainer = document.getElementById('show-list');
loginButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    let verify = yield logar();
    yield criarSessao();
    if (verify) {
        searchContainer.classList.remove('hidden');
        document.querySelector('.login').classList.add('hidden');
    }
}));
searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let query = document.getElementById('search');
    let listaDeFilmes = yield procurarFilme(query.value);
    let ul = document.createElement('ul');
    ul.id = "lista";
    if (listaDeFilmes) {
        for (const item of listaDeFilmes.results) {
            let li = document.createElement('li');
            ul.appendChild(li);
            let div = document.createElement('div');
            div.className = 'layout';
            li.appendChild(div);
            let img = document.createElement('img');
            img.src = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${item.poster_path}`;
            div.appendChild(img);
            let div1 = document.createElement('div');
            div1.className = "descricao";
            div.appendChild(div1);
            let p = document.createElement('p');
            p.innerHTML = `${item.original_title}`;
            div1.appendChild(p);
            let button = document.createElement('button');
            button.innerHTML = 'Adicionar';
            button.id = `${item.id}`;
            button.className = 'butaoId';
            div1.appendChild(button);
            let button2 = document.createElement('button');
            button2.innerHTML = 'Adicionar à lista';
            button2.id = `${item.id}`;
            button2.className = 'butao2Id';
            div1.appendChild(button2);
        }
    }
    searchContainer.appendChild(ul);
    console.log(listaDeFilmes);
    let butaos = document.getElementsByClassName('butaoId');
    for (let butao of butaos) {
        butao.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            const filmeId = butao.getAttribute('id');
            yield adicionarFilme(Number(filmeId));
        }));
    }
    let butaos2 = document.getElementsByClassName('butao2Id');
    for (let butao of butaos2) {
        butao.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            const filmeId = butao.getAttribute('id');
            yield adicionarFilmeNaLista(Number(filmeId), listId);
        }));
    }
}));
listButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    searchContainer.classList.add('hidden');
    listContainer.classList.remove('hidden');
}));
listButtonCancel.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    searchContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
}));
listButtonCreate.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarLista(nomeLista, descricao);
    searchContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
    listButtonCreate.setAttribute('disabled', 'anable');
}));
ShowListButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    searchContainer.classList.add('hidden');
    ShowListContainer.classList.remove('hidden');
    yield pegarLista();
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let listaDeFilmes = yield pegarLista();
    let ul = document.createElement('ul');
    ul.id = "lista";
    if (listaDeFilmes) {
        for (const item of listaDeFilmes.items) {
            let li = document.createElement('li');
            ul.appendChild(li);
            let div = document.createElement('div');
            div.className = 'layout';
            li.appendChild(div);
            let img = document.createElement('img');
            img.src = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${item.poster_path}`;
            div.appendChild(img);
            let div1 = document.createElement('div');
            div1.className = "descricao";
            div.appendChild(div1);
            let p = document.createElement('p');
            p.innerHTML = `${item.original_title}`;
            div1.appendChild(p);
        }
    }
    ShowListContainer.appendChild(ul);
}));
ShowListButtonCancel.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    searchContainer.classList.remove('hidden');
    ShowListContainer.classList.add('hidden');
}));
function preencherSenha() {
    let getPassword = document.getElementById('senha');
    password = getPassword.value;
    validateLoginButton();
}
function preencherLogin() {
    let getusername = document.getElementById('login');
    username = getusername.value;
    validateLoginButton();
}
function preencherApi() {
    let getApiKey = document.getElementById('api-key');
    apiKey = getApiKey.value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.removeAttribute('disabled');
    }
}
function preencherNomeLista() {
    let getNomeLista = document.getElementById('nomeDaLista');
    nomeLista = getNomeLista.value;
    validateListButton();
}
function preencherDescricao() {
    let getDescricao = document.getElementById('descricao');
    descricao = getDescricao.value;
    validateListButton();
}
function validateListButton() {
    if (nomeLista && descricao) {
        listButtonCreate.removeAttribute('disabled');
    }
}
class HttpClient {
    static get({ url = '', method = '', body = null || JSON.parse('{}') }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET"
        });
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
            method: "GET"
        });
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET"
        });
        let token = result;
        requestToken = token.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            }
        });
        let resultLogin = result;
        if (resultLogin.success) {
            return true;
        }
        return false;
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        let sessao = result;
        sessionId = sessao.session_id;
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: nomeDaLista,
                description: descricao,
                language: "pt-br"
            }
        });
        let list = result;
        listId = list.list_id;
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "GET"
        });
        console.log(result);
        if (result) {
            return result;
        }
    });
}
