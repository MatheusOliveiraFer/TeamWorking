function meusAnuncios_item(title,smallDescription,lookingFor,ownerName,city,uf,value,id){
    return `<div class="anuncio">
        <div class="txt-inicial">
            ${title}
        </div>
        <div class="subtitulo">
            ${smallDescription}
        </div>
        <div id="lista-imagem_${id}" class="lista-imagem">
            
        </div>
        <div class="tipo-txt">
            <div class="tipo">Tipo:</div>
            <div class="txt-info">${lookingFor}</div>
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
                <div class="info-valor">Valor</div>
                <div class="valor">R$ ${value.toFixed(2).toString().replace('.',',')}</div>
            </div>
        </div>
    </div>
    `
}