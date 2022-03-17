const anuncioContainer = document.getElementById('anuncioContainer')

anuncioContainer.style.padding = '0px'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page_type = urlParams.get('a')

tw.init('get_all_project_user',[page_type])

// `<div class="anuncio">
// <div class="txt-inicial">
//     Projeto em busca de programador em .Net atuará no ramo de e-commerce
// </div>
// <div class="subtitulo">
//     Inspeção e criação de novas tecnologias usando .NET
// </div>
// <div class="lista-imagem">
//     <div class="imagem1"></div>
//     <div class="imagem2"></div>
//     <div class="imagem3"></div>
// </div>
// <div class="tipo-txt">
//     <div class="tipo">Tipo:</div>
//     <div class="txt-info">Colaborador da equipe</div>
// </div>
// <div class="dados-publi">
//     <div class="info-dados">
//         <div class="info-criador">
//             <div class="info-proposta">
//                 Criador da proposta:
//             </div>
//             <div>
//                 Ricardo Vasconcelos Bitteti
//             </div>
//         </div>
//         <div class="info-loc">
//             <div class="info-cidade">
//                 Cidade de atuação da proposta:
//             </div>
//             <div class="loc-criador">
//                 Rio de Janeiro - RJ
//             </div>
//         </div>
//     </div>
//     <div class="valor-dados">
//         <div class="info-valor">Valor</div>
//         <div class="valor">R$: 5.500,00</div>
//     </div>
// </div>`