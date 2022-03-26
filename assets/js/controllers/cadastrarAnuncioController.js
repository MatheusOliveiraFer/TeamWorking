const type = document.getElementById('type')
const title = document.getElementById('title')
const smallDescription = document.getElementById('smallDescription')
const fullDescription = document.getElementById('fullDescription')
const value = document.getElementById('value')
const videoAnuncio = document.getElementById('videoAnuncio')
const image = document.getElementById('image')
const imageFront = document.getElementById('image_front')
const images = document.getElementById('image_container_anuncio')
const projectSender = document.getElementById('projectSender')
const save = document.getElementById('save')
const errorElement = document.getElementById('errorElement')
const loading = document.getElementById('loading-button')
var image_array = []
var key_array = []

var userID = '-MyL9xgPX9dMxu8cB6oh'

image.addEventListener('change', (e) => {
    if (image.files[0].type == 'image/png' || image.files[0].type == 'image/jpeg' || image.files[0].type == 'image/gif' || image.files[0].type == 'image/webp') {
        image_id = Date.now()
        
        image_array[image_id] = image.files[0]
        key_array.push(image_id)
        let url = URL.createObjectURL(image_array[image_id])

        images.innerHTML += `<div>
                                <img id="image_${image_id}_trash" class="trash" src="/assets/images/lixeira.png"/>
                                <img id="image_${image_id}" class="image_anuncio" src="${url}" onclick="removeImage(this.id)"/>
                            </div>`
    } else {
        console.log('Formato inválido')
        image.type = 'text'
        image.type = 'file'
    }
})

function removeImage(id){
    const removableImage = document.getElementById(id)
    const removableImage_trash = document.getElementById(id + "_trash")

    itemId = id.split('_')

    var num = 0
    key_array.forEach(key => {
        if(key == itemId[1]){
            key_array.splice(num,1)
        }

        num++
    })

    delete image_array[itemId[1]]
    removableImage.remove()
    removableImage_trash.remove()
}

projectSender.addEventListener('submit', (e) => {
    // var userID = valor_cookie('userID')

    // if(!userID){
    //     document.location.replace('/index.html')
    // }

    save.style.display = 'none'
    loading.style.display = 'flex'
    errorElement.style.color = 'red'
    errorElement.innerText = ''

    setTimeout(function(){
        let errors = 0;

        if(!videoAnuncio.value.includes('www.youtube.com/')){
            errors++
            videoAnuncio.style.border = '2px solid red'
            errorElement.innerText = "Recomendamos subir seu vídeo no Youtube"
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
        if(value.value === '' || value.value == null){
            errors++
            value.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }
        if(key_array.length == 0){
            errors++
            console.log('array vazio')

            imageFront.style.border = '2px solid red'
            errorElement.innerText = "Recomendamos inserir no mínimo uma imagem"
        }
        if(videoAnuncio.value === '' || videoAnuncio.value == null){
            errors++
            videoAnuncio.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }

        if(errors > 0){
            loading.style.display = 'none'
            save.style.display = 'inline'

            e.preventDefault()
        }else{
            tw.init('project_create', [title.value, ownerID, smallDescription.value, fullDescription.value, type.value, videoAnuncio.value, value.value, image_array, key_array])
        }
    },500)


    e.preventDefault()
})

projectSender.addEventListener('submit', (e) => {




    e.preventDefault()
})