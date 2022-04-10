const avatar = document.getElementById('avatar-image')
const avatar_input = document.getElementById('avatar_image_input')
const name = document.getElementById('name_input')
const email = document.getElementById('email_input')
const phone = document.getElementById('phone_input')
const uf = document.getElementById('uf_input')
const city = document.getElementById('city_input')
const return_button = document.getElementById('return_button')
const save_button = document.getElementById('save_button')
const errorElement = document.getElementById('errorElement')
const loading = document.getElementById('loading-button')
const logout = document.getElementById('logout')

var avatar_image = ''
var updatedImage = false

tw.init('user_exist',['get_user_info'])

avatar_input.addEventListener('change', (e) => {

    let avatar_url = URL.createObjectURL(avatar_input.files[0])

    avatar.style.backgroundImage = `url(${avatar_url})`

    avatar_image = avatar_input.files[0]

    updatedImage = true
})

logout.addEventListener('click', (e) => {
    var cookieData = new Date(5100,0,01);
    cookieData = cookieData.toUTCString()
    document.cookie = `userID=;expires=${cookieData};path=/;`

    document.location.replace('/')
})


save_button.addEventListener('click', (e) => {
    save_button.style.display = 'none'
    loading.style.display = 'flex'
    errors = 0

    setTimeout(function(){
        if(name.value === '' || name.value == null){
            errors++
            name.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        } 
        if(email.value === '' || email.value == null){
            errors++
            email.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        } 
        if(phone.value === '' || phone.value == null){
            errors++
            phone.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }
        if(uf.value === '' || uf.value == null){
            errors++
            uf.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        } 
        if(city.value === '' || city.value == null){
            errors++
            city.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }

        if(errors > 0){
            save_button.style.display = 'flex'
            loading.style.display = 'none'

            e.preventDefault()
        }else{
            tw.init('update_user_info',[name.value, phone.value, uf.value, city.value, avatar_image, updatedImage])
        }
    },500)

    e.preventDefault()
})
