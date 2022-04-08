const email = document.getElementById('email')
const password = document.getElementById('password')
const signIn = document.getElementById('signIn')
const errorElement = document.getElementById('errorElement')
const enviar = document.getElementById('enviar')
const loading = document.getElementById('loading-button')

// var userID = cookieAccess.valor('userID')

// if(userID){
//     document.location.replace('/cadastro/Home.html')
// }

tw.init('user_exist', ['login'])

signIn.addEventListener('submit', (e) => {
    enviar.style.display = 'none'
    loading.style.display = 'flex'
    errorElement.style.color = 'red'
    errorElement.innerText = ''

    setTimeout(function(){
        email.style.border = '1px solid #2684DE'
        password.style.border = '1px solid #2684DE'

        let errors = 0;

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

        if(errors > 0){
            loading.style.display = 'none'
            enviar.style.display = 'inline'

            e.preventDefault()
        }else{
            tw.init('user_validation',[email.value,password.value])  
        }
    },500)

    e.preventDefault()
})