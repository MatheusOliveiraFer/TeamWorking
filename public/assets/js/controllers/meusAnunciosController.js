const anuncioContainer = document.getElementById('anuncioContainer')
const background_modal = document.getElementById('background-of-modal')
background_modal.style.zIndex = '1'

anuncioContainer.style.padding = '0px'

tw.init('user_exist',['get_all_project_user'])

function open_modal(url){
    background_modal.innerHTML = `<div class="modal-image-container">
                                    <img class="modal-image" src="${url}">
                                      <div class="modal-close-button" onclick="close_modal()">X</div>
                                  </div>`

                                  var dropdown = document.getElementsByClassName('dropdown-button')

                                  for(i=0; i<dropdown.length; i++) {
                                    dropdown[i].style.zIndex = '0';
                                  }

    background_modal.style.display = 'flex'
}

function close_modal(){
  document.getElementById('background-of-modal').style.display = 'none'

  var dropdown = document.getElementsByClassName('dropdown-button')

  for(i=0; i<dropdown.length; i++) {
    dropdown[i].style.display = 'inline-block';
  }
}

function confirmDelete(title, id){
    var r = confirm(`Quer mesmo excluir o anúncio ${title}?`);

    if (r == true){
      tw.init('user_exist',['project_remove',[id]])
    }
}


