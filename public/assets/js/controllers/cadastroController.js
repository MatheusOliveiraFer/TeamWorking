let name = document.getElementById('name')
let email = document.getElementById('email')
let password = document.getElementById('password')
let confirmPassword = document.getElementById('confirmPassword')
let phone = document.getElementById('phone')
let uf = document.getElementById('uf')
let city = document.getElementById('city')
let signUp = document.getElementById('signUp')
let errorElement = document.getElementById('errorElement')
let enviar = document.getElementById('enviar')
let loading = document.getElementById('loading-button')
let button_modal = document.getElementById('button_modal')

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    name = document.getElementById('name_modal')
    email = document.getElementById('email_modal')
    password = document.getElementById('password_modal')
    confirmPassword = document.getElementById('confirmPassword_modal')
    phone = document.getElementById('phone_modal')
    uf = document.getElementById('uf_modal')
    city = document.getElementById('city_modal')
    signUp = document.getElementById('signUp_modal')
    errorElement = document.getElementById('errorElement_modal')
    enviar = document.getElementById('enviar_modal')
    loading = document.getElementById('loading-button_modal')
}

tw.init('user_exist', ['login'])

signUp.addEventListener('submit', (e) => {
    enviar.style.display = 'none'
    loading.style.display = 'flex'
    errorElement.style.color = 'red'
    errorElement.innerText = ''

    setTimeout(function(){
        name.style.border = '1px solid #2684DE'
        email.style.border = '1px solid #2684DE'
        password.style.border = '1px solid #2684DE'
        confirmPassword.style.border = '1px solid #2684DE'
        phone.style.border = '1px solid #2684DE'
        uf.style.border = '1px solid #2684DE'
        city.style.border = '1px solid #2684DE'

        let errors = 0;

        if(password.value.length < 6){
            errors++
            password.style.border = '2px solid red'
            confirmPassword.style.border = '2px solid red'
            errorElement.innerText = "A senha deve ter 6 dígitos ou mais!"
        }
        if(password.value != confirmPassword.value){
            errors++
            password.style.border = '2px solid red'
            confirmPassword.style.border = '2px solid red'
            errorElement.innerText = "Os dois campos de senha não conferem!"
        }
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
        if(password.value === '' || password.value == null){
            errors++
            password.style.border = '2px solid red'
            errorElement.innerText = "Existem campos sem preencher!"
        }
        if(confirmPassword.value === '' || confirmPassword.value == null){
            errors++
            confirmPassword.style.border = '2px solid red'
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
            loading.style.display = 'none'
            enviar.style.display = 'inline'

            e.preventDefault()
        }else{
            tw.init('user_create',[name.value,email.value,confirmPassword.value,password.value,phone.value,uf.value,city.value])  
        }
    },500)
    
    e.preventDefault()
})