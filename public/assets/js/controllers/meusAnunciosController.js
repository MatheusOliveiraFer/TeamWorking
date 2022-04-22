const anuncioContainer = document.getElementById('anuncioContainer')
const background_modal = document.getElementById('background-of-modal')
background_modal.style.zIndex = '1'
var dropdownButton = '';

anuncioContainer.style.padding = '0px'

tw.init('user_exist',['get_all_project_user'])

function dropboxOpen(id){
  if(dropdownButton){
    let dropdown_button = document.getElementById(`dropdown-button-${dropdownButton}`)
    document.getElementById(`dropdown-list-${dropdownButton}`).style.display = 'none'
          
    dropdown_button.style.borderBottomLeftRadius = "20px"
    dropdown_button.style.borderBottomRightRadius = "20px"
    dropdown_button.innerHTML = "..."
  }

  dropdownButton = id
  let dropdown_button = document.getElementById(`dropdown-button-${dropdownButton}`)

  document.getElementById(`dropdown-list-${id}`).style.display = 'block'

  dropdown_button.style.borderBottomLeftRadius = "0px"
  dropdown_button.style.borderBottomRightRadius = "0px"
  dropdown_button.innerHTML = "-"
}

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


window.addEventListener('click', function(e){

  if(dropdownButton){
    const dropdown_button = document.getElementById(`dropdown-button-${dropdownButton}`)
  
    if(!dropdown_button.contains(e.target)){
  
      document.getElementById(`dropdown-list-${dropdownButton}`).style.display = 'none'
    
      dropdown_button.style.borderBottomLeftRadius = "20px"
      dropdown_button.style.borderBottomRightRadius = "20px"
      dropdown_button.innerHTML = "..."
    }
  }
})




