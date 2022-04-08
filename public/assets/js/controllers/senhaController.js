const email = document.getElementById('campo')
const errorElement = document.getElementById('errorElement')
const forgot = document.getElementById('forgot')
const enviar = document.getElementById('enviar')
const loading = document.getElementById('loading-button')

forgot.addEventListener('submit', (e) => {
    enviar.style.display = 'none'
    loading.style.display = 'flex'
    errorElement.style.color = 'red'
    errorElement.innerText = ''

    setTimeout(function(){
        email.style.border = '1px solid #2684DE'

        let errors = 0;

        if(email.value === '' || email.value == null){
            errors++
            email.style.border = '2px solid red'
            errorElement.innerText = "Você esqueceu de preencher este campo!"
        }

        if(errors > 0){
            loading.style.display = 'none'
            enviar.style.display = 'inline'

            e.preventDefault()
        }else{
            tw.init('open_request',[email.value,'recovering'])
        }
    },500)

    e.preventDefault()
})