// ============================================================
// TRILHA.TECH - Lógica de cálculo do score e indicação de vaga
// ============================================================
//
// Como funciona, resumindo:
// 1. Cada uma das 16 habilidades tem 4 opções (valores 0, 1, 2 ou 3).
// 2. Ao clicar em "Ver minha recomendação", somamos os valores
//    marcados e tiramos a MÉDIA (soma ÷ 16).
// 3. Essa média cai em uma de 3 faixas, cada uma ligada a uma vaga
//    real diferente.
// 4. O usuário NUNCA vê o número da média — só é redirecionado
//    direto pra vaga (decisão tomada com a professora/orientação:
//    evitar frustração ao ver uma nota baixa).

// ---- Vagas reais, uma para cada faixa de score ----
const VAGAS = {
  nivel1: {
    nome: "Suporte Operacional / Service Desk (Inlogger)",
    link: "https://www.linkedin.com/jobs/view/4466398907/"
  },
  nivel2: {
    nome: "Desenvolvedor Júnior / Estagiário Web",
    link: "https://www.linkedin.com/jobs/view/4344422467/"
  },
  nivel3: {
    nome: "Programa de Estágio iFuture (iFood - Trilha Tech)",
    link: "https://www.linkedin.com/jobs/view/4461341699/"
  }
};

// ---- Regras das faixas ----
// média < 2                  -> nível 1
// média >= 2 e média < 3     -> nível 2
// média >= 3                 -> nível 3
//
// Essa única regra já cobre os casos de número exato que você
// descreveu (ex: média = 2,0 cai no "nível 2"; média = 1,0 cai no
// "nível 1"; média = 3,0 cai no "nível 3"), então não precisa de
// nenhum tratamento especial pra número inteiro x número quebrado.
function calcularNivel(media) {
  if (media < 2) {
    return "nivel1";
  } else if (media < 3) {
    return "nivel2";
  } else {
    return "nivel3";
  }
}

// ---- Pega a resposta marcada em cada uma das 16 habilidades ----
function coletarRespostas() {
  const grupos = document.querySelectorAll("#skills-lista .opcoes");
  const respostas = [];

  grupos.forEach(function (grupo) {
    const marcado = grupo.querySelector('input[type="radio"]:checked');
    respostas.push(marcado ? Number(marcado.value) : null);
  });

  return respostas;
}

// ---- Liga o botão final ----
document.addEventListener("DOMContentLoaded", function () {
  const botao = document.getElementById("botao-recomendacao");

  botao.addEventListener("click", function () {
    const respostas = coletarRespostas();

    // Confere se todas as 16 habilidades foram respondidas
    const naoRespondidas = respostas.filter(function (valor) {
      return valor === null;
    }).length;

    if (naoRespondidas > 0) {
      alert(
        "Faltam " +
          naoRespondidas +
          " habilidade(s) para você avaliar antes de continuar."
      );
      return;
    }

    // Soma tudo e tira a média
    const soma = respostas.reduce(function (total, valor) {
      return total + valor;
    }, 0);
    const media = soma / respostas.length;

    // Decide a faixa e pega a vaga correspondente
    const nivel = calcularNivel(media);
    const vaga = VAGAS[nivel];

    // Leva a pessoa direto pra vaga, em uma nova aba.
    // (o número da média em si nunca é mostrado na tela)
    window.open(vaga.link, "_blank");
  });
});
