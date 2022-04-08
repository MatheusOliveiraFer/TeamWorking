const type = document.getElementById('type')
const title = document.getElementById('title')
const smallDescription = document.getElementById('smallDescription')
const fullDescription = document.getElementById('fullDescription')
const value = document.getElementById('value')
const videoAnuncio = document.getElementById('videoAnuncio')
const image = document.getElementById('image')
const imageFront1 = document.getElementById('image_front_1')
const imageFront2 = document.getElementById('image_front_2')
const imageFront3 = document.getElementById('image_front_3')
const imageFront4 = document.getElementById('image_front_4')
const images = document.getElementById('image_container_anuncio')
const projectSender = document.getElementById('projectSender')
const save = document.getElementById('save')
const errorElement = document.getElementById('errorElement')
const loading = document.getElementById('loading-button')
var image_array = []
// var key_array = []
var active_slot = 0

var userID = cookieAccess.valor('userID')

if(!userID){
    document.location.replace('/login/index.html')
}

tw.init('user_exist')

image.addEventListener('change', (e) => {
    var slot = active_slot

    if (image.files[0].type == 'image/png' || image.files[0].type == 'image/jpeg' || image.files[0].type == 'image/gif' || image.files[0].type == 'image/webp') {
        
        image_array[slot] = image.files[0]
        // key_array.push(slot)
        let url = URL.createObjectURL(image_array[slot])

        let activeButton = document.getElementById(`image_front_${slot}`)
        
        activeButton.outerHTML = `<div>
                                <img id="image-${slot}-trash" class="trash" src="/assets/images/lixeira.png"/>
                                <img id="image-${slot}" 
                                    class="image_anuncio" 
                                    src="${url}" onclick="removeImage(this.id)" 
                                    onload="document.getElementById('image-${slot}-loading').style.display = 'none'; document.getElementById('image-${slot}').style.display = 'flex';" 
                                    onmouseover="document.getElementById('image-${slot}-trash').style.display = 'flex';" 
                                    onmouseout="document.getElementById('image-${slot}-trash').style.display = 'none';"/>
                                
                                <img id="image-${slot}-loading" class="image-loading-box"/>
                            </div>`
    } else {
        console.log('Formato inválido')
        image.type = 'text'
        image.type = 'file'
    }
})

function removeImage(id){
    const removableImage = document.getElementById(id)
    const removableImage_trash = document.getElementById(id + "-trash")
    const removableImage_loading = document.getElementById(id + "-loading")

    itemId = id.split('-')

    // image_array.splice(itemId[1],1)

    // var num = 0
    // key_array.forEach(key => {
    //     if(key == itemId[1]){
    //         key_array.splice(num,1)
    //     }

    //     num++
    // })

    delete image_array[itemId[1]]
    removableImage.outerHTML = `<div id="image_front_${itemId[1]}" class="image_button_cadastro_anuncio" onclick="document.getElementById('image').click(); active_slot=${itemId[1]}">+</div>`
    removableImage_trash.remove()
    removableImage_loading.remove()
}

projectSender.addEventListener('submit', (e) => {
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
        // if(image_array.length == 0){
        //     errors++
        //     console.log('array vazio')

        //     imageFront.style.border = '2px solid red'
        //     errorElement.innerText = "Recomendamos inserir no mínimo uma imagem"
        // }
        // if(videoAnuncio.value === '' || videoAnuncio.value == null){
        //     errors++
        //     videoAnuncio.style.border = '2px solid red'
        //     errorElement.innerText = "Existem campos sem preencher!"
        // }

        if(errors > 0){
            loading.style.display = 'none'
            save.style.display = 'inline'

            e.preventDefault()
        }else{
            tw.init('project_create', [title.value, userID, smallDescription.value, fullDescription.value, type.value, videoAnuncio.value, value.value, image_array])
        }
    },500)


    e.preventDefault()
})

projectSender.addEventListener('submit', (e) => {




    e.preventDefault()
})