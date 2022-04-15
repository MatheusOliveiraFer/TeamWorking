function meusAnuncios_item(title,smallDescription,type,ownerName,city,uf,value,id){
    return `<div class="anuncio">
              <div class="txt-inicial-editar">
                <div class="dropdown-button">
                  <p id="dropdown-button-${id}" class="dropdown-button-txt" onclick="dropboxOpen('${id}')">...</p>
                  <div id="dropdown-list-${id}" class="dropdown-list">
                    <p class="dropdown-item" onclick="document.location.replace('/detalheAnuncio/index.html?a=${id}')">Detalhes</p>
                    <p class="dropdown-item" onclick="document.location.replace('/meusanuncios/EditarAnuncio.html?a=${id}')">Editar</p>
                    <p id="dropdown-delete-${id}" class="dropdown-item" onclick="confirmDelete('${title}','${id}')">Excluir</p>
                  </div>
                </div>
                <a href="##" style="color: #000; text-align: center">${title}</a>
                <div class="dropdown-balance" style="height: 40px; width: 60px;"></div>
              </div>
            <div class="subtitulo">
                ${smallDescription}
            </div>
            <div id="lista-imagem_${id}" class="lista-imagem">
                    
            </div>
            <div class="tipo-txt">
              <div class="cont1">
                <div class="tipo">Tipo:</div>
                <div class="txt-info">${type}</div>
              </div>
              <div class="cont2">
                <div class="link-info"></div>
                <div class="link"><a href=""></a></div>
              </div>
            </div>
            <div class="dados-publi">
              <div class="info-dados">
                <div class="info-criador">
                  <div class="info-proposta">
                    Criador da proposta:
                  </div>
                  <div>
                    ${ownerName}
                  </div>
                </div>
                <div class="info-loc">
                  <div class="info-cidade">
                    Cidade de atuação da proposta:
                  </div>
                  <div class="loc-criador">
                    ${city} - ${uf}
                  </div>
                </div>
              </div>
              <div class="valor-dados">    
                ${value ? `<div class="info-valor">Valor:</div><div class="valor">R$${value.toFixed(2).toString().replace('.', ',')}</div></div>` : ''}
            </div>
          </div>`
}