// Banco de dados de filmes
const filmes = [
  { titulo: "Rapunzel", idade: "LIVRE", generos: ["fantasia", "aventura", "musical"], nota: 7.8, ano: 2010, duracao: 100 },
  { titulo: "Procurando Dory", idade: "LIVRE", generos: ["animação", "aventura", "comédia"], nota: 7.3, ano: 2016, duracao: 97 },
  { titulo: "Gato de Botas", idade: "LIVRE", generos: ["aventura", "animação", "comédia"], nota: 6.6, ano: 2011, duracao: 90 },
  { titulo: "A Babá Encantada", idade: "LIVRE", generos: ["fantasia", "comédia"], nota: 5.9, ano: 2008, duracao: 99 },
  { titulo: "Encanto", idade: "LIVRE", generos: ["fantasia", "musical", "animação"], nota: 7.2, ano: 2021, duracao: 102 },
  { titulo: "Velozes e Furiosos 7", idade: "14", generos: ["ação", "aventura", "crime"], nota: 7.1, ano: 2015, duracao: 137 },
  { titulo: "Shrek", idade: "LIVRE", generos: ["fantasia", "aventura", "comédia"], nota: 7.9, ano: 2001, duracao: 90 },
  { titulo: "Homem-Aranha no Aranhaverso", idade: "10", generos: ["animação", "ação", "aventura"], nota: 8.4, ano: 2018, duracao: 117 },
  { titulo: "Toy Story", idade: "LIVRE", generos: ["animação", "aventura", "comédia"], nota: 8.3, ano: 1995, duracao: 81 },
  { titulo: "Interestelar", idade: "10", generos: ["ficção científica", "aventura", "drama"], nota: 8.6, ano: 2014, duracao: 169 },
  { titulo: "O Rei Leão", idade: "LIVRE", generos: ["animação", "aventura", "drama"], nota: 8.5, ano: 1994, duracao: 88 },
  { titulo: "Vingadores: Ultimato", idade: "12", generos: ["ação", "aventura", "ficção científica"], nota: 8.4, ano: 2019, duracao: 181 }
];

// Variáveis globais
let campoIdade, sliderNota, sliderAno, sliderDuracao;
let filtroGeneros = [];
let recomendacoes = [];
let carregando = false;
let filtrosAplicados = false;

function setup() {
  // Canvas com espaço suficiente
  createCanvas(1000, 1200);
  background(245);
  
  // Configuração de fonte com fallback
  try {
    textFont('Arial');
  } catch (e) {
    textFont('sans-serif');
    console.log("Usando fonte fallback: sans-serif");
  }
  
  drawHeader();
  createFilters();
  createButtonBuscar();
}

function draw() {
  background(245);
  
  drawHeader();
  drawFiltersUI();
  
  if (carregando) {
    showLoading();
  } else if (recomendacoes.length > 0) {
    showRecommendations();
  } else {
    showInstructions();
  }
  
  if (filtrosAplicados) {
    showAppliedFilters();
  }
}

// Funções de UI
function drawHeader() {
  fill(50);
  textSize(28);
  textAlign(CENTER);
  text("🎬 Sistema de Recomendação de Filmes", width/2, 40);
  
  textSize(16);
  fill(100);
  text("Encontre filmes perfeitos para você", width/2, 70);
}

function createFilters() {
  // Campo de idade
  textAlign(LEFT);
  fill(50);
  textSize(16);
  text("Digite sua idade:", 30, 120);
  
  campoIdade = createInput("8");
  campoIdade.position(150, 105);
  campoIdade.size(60);
  campoIdade.style('padding', '5px');
  campoIdade.style('font-size', '14px');
  
  // Checkboxes de gêneros
  text("Selecione os gêneros preferidos:", 30, 160);
  createGeneroCheckboxes();
  
  // Sliders
  createSliders();
}

function createGeneroCheckboxes() {
  const todosGeneros = [...new Set(filmes.flatMap(filme => filme.generos))].sort();
  const startX = 30;
  const startY = 180;
  const colWidth = 300;
  
  for (let i = 0; i < todosGeneros.length; i++) {
    const genero = todosGeneros[i];
    const col = Math.floor(i / 6);
    const row = i % 6;
    
    const checkbox = createCheckbox(genero);
    checkbox.position(startX + col * colWidth, startY + row * 25);
    checkbox.style('font-size', '14px');
    filtroGeneros.push(checkbox);
  }
}

function createSliders() {
  const startY = 350;
  
  // Slider Nota
  text("Nota mínima:", 30, startY);
  sliderNota = createSlider(0, 10, 6, 0.1);
  sliderNota.position(150, startY-5);
  sliderNota.size(200);
  
  // Slider Ano
  text("Ano mínimo:", 30, startY+40);
  sliderAno = createSlider(1980, 2023, 2000, 1);
  sliderAno.position(150, startY+35);
  sliderAno.size(200);
  
  // Slider Duração
  text("Duração máxima (min):", 30, startY+80);
  sliderDuracao = createSlider(60, 240, 180, 5);
  sliderDuracao.position(150, startY+75);
  sliderDuracao.size(200);
}

function drawFiltersUI() {
  textAlign(LEFT);
  fill(50);
  textSize(16);
  
  // Atualiza valores dos sliders
  textAlign(RIGHT);
  fill(70);
  text(sliderNota.value().toFixed(1), 360, 365);
  text(sliderAno.value(), 360, 405);
  text(sliderDuracao.value(), 360, 445);
  textAlign(LEFT);
}

function createButtonBuscar() {
  const botao = createButton("🔍 Buscar Recomendações");
  botao.position(30, 500);
  botao.size(200, 40);
  botao.style('font-size', '16px');
  botao.style('background-color', '#4CAF50');
  botao.style('color', 'white');
  botao.style('border', 'none');
  botao.style('border-radius', '5px');
  botao.mousePressed(gerarRecomendacoes);
}

// Funções de lógica
function gerarRecomendacoes() {
  carregando = true;
  filtrosAplicados = true;
  
  setTimeout(() => {
    const idade = parseInt(campoIdade.value()) || 0;
    const generosSelecionados = filtroGeneros.filter(cb => cb.checked()).map(cb => cb.value());
    const notaMinima = sliderNota.value();
    const anoMinimo = sliderAno.value();
    const duracaoMaxima = sliderDuracao.value();
    
    recomendacoes = filmes.filter(filme => {
      const idadeMinima = filme.idade === "LIVRE" ? 0 : parseInt(filme.idade);
      return idade >= idadeMinima &&
             filme.nota >= notaMinima &&
             filme.ano >= anoMinimo &&
             filme.duracao <= duracaoMaxima;
    }).map(filme => {
      const matches = generosSelecionados.filter(g => filme.generos.includes(g)).length;
      return { ...filme, score: matches };
    }).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.nota !== a.nota) return b.nota - a.nota;
      return b.ano - a.ano;
    });
    
    if (generosSelecionados.length === 0) {
      recomendacoes.sort((a, b) => {
        if (b.nota !== a.nota) return b.nota - a.nota;
        return b.ano - a.ano;
      });
    }
    
    carregando = false;
  }, 800);
}

// Funções de exibição
function showLoading() {
  textAlign(CENTER);
  fill(70);
  textSize(18);
  text("Buscando recomendações...", width/2, 600);
  
  let dots = frameCount % 60 / 15;
  text(".".repeat(floor(dots)), width/2, 630);
}

function showRecommendations() {
  textAlign(LEFT);
  fill(50);
  textSize(22);
  text("🍿 Recomendações para você:", 30, 600);
  
  let y = 630;
  const maxRecomendacoes = min(recomendacoes.length, 6);
  
  for (let i = 0; i < maxRecomendacoes; i++) {
    const filme = recomendacoes[i];
    
    // Card do filme
    fill(255);
    stroke(220);
    strokeWeight(1);
    rect(30, y - 20, width - 60, 70, 5);
    
    // Informações
    fill(60);
    textSize(16);
    text(filme.titulo, 50, y + 5);
    
    fill(100);
    textSize(11);
    text(`⭐ ${filme.nota} | 📅 ${filme.ano} | ⏱ ${filme.duracao} min | 🎭 ${filme.generos.slice(0, 2).join(", ")} | ${filme.idade}`, 50, y + 25);
    
    // Barra de relevância
    const relevancia = map(filme.score, 0, 3, 0, 100);
    const generosSelecionados = filtroGeneros.filter(cb => cb.checked()).map(cb => cb.value());
    if (generosSelecionados.length > 0) {
      fill(50, 205, 50, 100);
      noStroke();
      rect(50, y + 35, relevancia, 6, 3);
    }
    
    y += 80;
  }

  if (recomendacoes.length > maxRecomendacoes) {
    fill(100);
    textSize(14);
    textAlign(CENTER);
    text(`Mostrando ${maxRecomendacoes} de ${recomendacoes.length} resultados`, width/2, y + 20);
  }
}

function showInstructions() {
  textAlign(CENTER);
  fill(120);
  textSize(16);
  text("Digite sua idade, selecione gêneros e ajuste os filtros", width/2, 600);
  text("para ver recomendações personalizadas de filmes.", width/2, 630);
}

function showAppliedFilters() {
  textAlign(LEFT);
  fill(80);
  textSize(14);
  
  const idade = campoIdade.value();
  const generos = filtroGeneros.filter(cb => cb.checked()).map(cb => cb.value());
  const nota = sliderNota.value();
  const ano = sliderAno.value();
  const duracao = sliderDuracao.value();
  
  let filtrosText = `Idade: ${idade}+ | Nota: ${nota.toFixed(1)}+ | Ano: ${ano}+ | Duração: até ${duracao} min`;
  if (generos.length > 0) {
    filtrosText += ` | Gêneros: ${generos.join(", ")}`;
  }
  
  text("Filtros aplicados: " + filtrosText, 30, 570);
}