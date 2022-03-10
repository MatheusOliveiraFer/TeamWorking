const recuperacao = document.getElementById('recuperacao')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirmPassword')
const errorElement = document.getElementById('errorElement')
const loading = document.getElementById('loading-button')

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page_type = urlParams.get('a')

if(!page_type){
    window.location.replace('/rota_recuperacao/esqueci')
}

recuperacao.addEventListener('submit', (e) => {
    enviar.style.display = 'none'
    loading.style.display = 'flex'
    errorElement.style.color = 'red'
    errorElement.innerText = ''

    setTimeout(function(){
        password.style.border = '1px solid #2684DE'
        confirmPassword.style.border = '1px solid #2684DE'

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

        if(errors > 0){
            loading.style.display = 'none'
            enviar.style.display = 'inline'

            e.preventDefault()
        }else{
            tw.init('password_update',[page_type, confirmPassword.value,password.value])  
        }
    },500)

    e.preventDefault()
})