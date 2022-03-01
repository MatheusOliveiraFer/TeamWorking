const name = document.getElementById('name')
const email = document.getElementById('email')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirmPassword')
const phone = document.getElementById('phone')
const uf = document.getElementById('uf')
const city = document.getElementById('city')
const signUp = document.getElementById('signUp')
const errorElement = document.getElementById('errorElement')
const enviar = document.getElementById('enviar')
const loading = document.getElementById('loading-button')

signUp.addEventListener('submit', (e) => {
    enviar.style.display = 'none'
    loading.style.display = 'flex'

    setTimeout(function(){
        loading.style.display = 'none'
        enviar.style.display = 'inline'

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
            e.preventDefault()
        }else{
            tw.init('user_create',[name.value,email.value,confirmPassword.value,password.value,phone.value,uf.value,city.value])  
        }
    },500)
    
    e.preventDefault()
})
