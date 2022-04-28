const anuncioContainer = document.getElementById('anuncioContainer')
const background_modal = document.getElementById('background-of-modal')

anuncioContainer.style.padding = '0px'

tw.init('get_all_projects')

function open_modal(url){
    background_modal.innerHTML = `<div class="modal-image-container">
                                    <img class="modal-image" src="${url}">
                                      <div class="modal-close-button" onclick="document.getElementById('background-of-modal').style.display = 'none'">X</div>
                                  </div>`

    background_modal.style.display = 'flex'
}