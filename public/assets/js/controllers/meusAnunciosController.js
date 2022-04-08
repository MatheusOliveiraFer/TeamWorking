const anuncioContainer = document.getElementById('anuncioContainer')
const background_modal = document.getElementById('background-of-modal')

anuncioContainer.style.padding = '0px'

var userID = cookieAccess.valor('userID')
// var userID = '-Mxm32PFUCV0AkVT0TCk'

setTimeout(function(){
    if(!userID){
        document.location.replace('/login/index.html')
    }

    tw.init('get_all_project_user',[userID])
},500)

function open_modal(url){
    background_modal.innerHTML = `<div class="modal-image-container">
                                    <img class="modal-image" src="${url}">
                                      <div class="modal-close-button" onclick="document.getElementById('background-of-modal').style.display = 'none'">X</div>
                                  </div>`

    background_modal.style.display = 'flex'
}


