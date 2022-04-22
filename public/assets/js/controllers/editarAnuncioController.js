const type = document.getElementById('type')
const title = document.getElementById('title')
const smallDescription = document.getElementById('smallDescription')
const fullDescription = document.getElementById('fullDescription')
const value = document.getElementById('value')
const videoAnuncio = document.getElementById('videoAnuncio')
const image = document.getElementById('image')
const imageFront = document.getElementById('image_front')
const images = document.getElementById('image_container_anuncio')
const projectEditor = document.getElementById('projectEditor')
const save = document.getElementById('save')
const errorElement = document.getElementById('errorElement')
const loading = document.getElementById('loading-button')
var active_slot = 0

projectEditor.display = 'none'

var images_array = []
var deleted_indexes = []

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectID = urlParams.get('a')

if(!projectID){
    document.location.replace('/login/index.html')
}else{
    tw.init('user_exist',['get_project_info',[projectID]])
}

image.addEventListener('change', (e) => {
    var slot = active_slot

    if (image.files[0].type == 'image/png' || image.files[0].type == 'image/jpeg' || image.files[0].type == 'image/gif' || image.files[0].type == 'image/webp') {

        images_array[slot] = image.files[0]
        let url = URL.createObjectURL(images_array[slot])
        let activeButton = document.getElementById(`image_box_${slot}`)

        activeButton.innerHTML = `<div>
                                <img id="image-${slot}-trash" class="trash" src="/assets/images/lixeira.png"/>
                                <img id="image-${slot}" 
                                    class="image_anuncio" 
                                    src="${url}" onclick="removeImage(this.id)" 
                                    onload="document.getElementById('image-${slot}-loading').style.display = 'none'; document.getElementById('image-${slot}').style.display = 'flex';" 
                                    onmouseover="document.getElementById('image-${slot}-trash').style.display = 'flex';" 
                                    onmouseout="document.getElementById('image-${slot}-trash').style.display = 'none';"/>
                                
                                <img id="image-${slot}-loading" class="image_loading_box"/>
                            </div>`

        deleted_indexes = deleted_indexes.sort()
        for(var i=0; i <= deleted_indexes.length + 1; i++){
            if(deleted_indexes[i] == slot){
                deleted_indexes.splice(i,1)
            }
        }

        image.type = 'text'
        image.type = 'file'
    } else {
        image.type = 'text'
        image.type = 'file'
    }
})

function removeImage(id){
    let itemId = id.split('-')

    deleted_indexes.push(itemId[1])
    deleted_indexes = deleted_indexes.sort()

    const removableImage = document.getElementById(`image_box_${itemId[1]}`)

    removableImage.innerHTML = `<div id="image_front_${itemId[1]}" class="image_button_cadastro_anuncio" onclick="document.getElementById('image').click(); active_slot=${itemId[1]}">+</div>`
}

projectEditor.addEventListener('submit', (e) => {
    userID = cookieAccess.valor('userID')

    if(!userID){
        document.location.replace('/login/index.html')
    }

    save.style.display = 'none'
    loading.style.display = 'flex'
    errorElement.style.color = 'red'
    errorElement.innerText = ''

    setTimeout(function(){
        let errors = 0;

        if(!videoAnuncio.value.includes('www.youtube.com/') && !(videoAnuncio.value === '' || videoAnuncio.value == null)){
            errors++
            videoAnuncio.style.border = '2px solid red'
            errorElement.innerText = "Recomendamos subir seu vídeo no Youtube"
        }
        if(value.value != '' && isNaN(value.value)){
            errors++
            value.style.border = '2px solid red'
            errorElement.innerText = "Valor inválido para o campo valor!"
        }
        if(title.value.length > 40){
            errors++
            title.style.border = '2px solid red'
            errorElement.innerText = "Tente um título menor!"
        }
        if(type.value === '' || type.value == null){
            errors++
            type.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }
        if(title.value === '' || title.value == null){
            errors++
            title.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }
        if(smallDescription.value === '' || smallDescription.value == null){
            errors++
            smallDescription.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }
        if(fullDescription.value === '' || fullDescription.value == null){
            errors++
            fullDescription.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }

        if(errors > 0){
            loading.style.display = 'none'
            save.style.display = 'inline'

            e.preventDefault()
        }else{
            tw.init('project_update', [projectID, type.value, title.value, smallDescription.value, fullDescription.value, value.value, videoAnuncio.value, images_array, deleted_indexes])
        }
    },500)


    e.preventDefault()
})

function caseNotImage(index){       
    var image_slot = document.getElementById(`image_box_${index}`)
    image_slot.innerHTML = `<div id="image_front_${index}" class="image_button_cadastro_anuncio" onclick="document.getElementById('image').click(); active_slot=${index}">+</div>`
}