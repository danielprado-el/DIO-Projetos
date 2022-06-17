"use strict";
let botaoAtualizar = document.getElementById('atualizar-saldo');
let botaoLimpar = document.getElementById('limpar-saldo');
let soma = document.getElementById('soma');
let campoSaldo = document.getElementById('campo-saldo');
limparSaldo();
function somarAoSaldo(valor) {
    if (campoSaldo) {
        campoSaldo.innerHTML = `${Number(campoSaldo.innerHTML) + valor}`;
    }
}
function limparSaldo() {
    if (campoSaldo) {
        campoSaldo.innerHTML = '0';
    }
}
botaoAtualizar.addEventListener('click', function () {
    somarAoSaldo(Number(soma.value));
    soma.value = '0';
});
botaoLimpar.addEventListener('click', function () {
    limparSaldo();
    soma.value = '0';
});
