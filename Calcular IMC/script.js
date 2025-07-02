// Alternância de dark mode
const root = document.documentElement;
const btnDark = document.getElementById('toggle-dark');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedDark = localStorage.getItem('darkMode');

function setDarkMode(ativar) {
  root.setAttribute('data-dark', ativar ? 'true' : 'false');
  localStorage.setItem('darkMode', ativar ? 'true' : 'false');
}

function toggleDark() {
  const isDark = root.getAttribute('data-dark') === 'true';
  setDarkMode(!isDark);
}

btnDark.addEventListener('click', toggleDark);

// Inicialização do modo escuro
if (savedDark === null) {
  setDarkMode(prefersDark);
} else {
  setDarkMode(savedDark === 'true');
}

// Cálculo do IMC
const form = document.getElementById('imc-form');
const resultado = document.getElementById('resultado');
const valorImc = resultado.querySelector('.valor-imc');
const classificacao = resultado.querySelector('.classificacao');

function classificarIMC(imc) {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade grau I';
  if (imc < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const altura = parseFloat(form.altura.value) / 100;
  const peso = parseFloat(form.peso.value);
  if (!altura || !peso || altura < 0.5 || altura > 2.5 || peso < 10 || peso > 300) {
    valorImc.textContent = '--';
    classificacao.textContent = 'Valores inválidos.';
    resultado.classList.remove('oculto');
    return;
  }
  const imc = peso / (altura * altura);
  valorImc.textContent = imc.toFixed(2);
  classificacao.textContent = classificarIMC(imc);
  resultado.classList.remove('oculto');
}); 