const codigo = document.getElementById('campo')
const errorElement = document.getElementById('errorElement')
const code = document.getElementById('code')
const b = document.getElementById('b')
const enviar = document.getElementById('enviar')
const reinvite = document.getElementById('reinvite')
const loading = document.getElementById('loading-button')
const loading_reinvite= document.getElementById('loading-button-reinvite')

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page_type = urlParams.get('email')

if(!page_type){
    window.location.replace('/rota_recuperacao/esqueci')
}

if(page_type.split("@",2)[1]){
    b.innerHTML = `<b>${page_type[0] + '****@' + page_type.split("@",2)[1]}</b>`
}

code.addEventListener('submit', (e) => {
    if(enviar.style.backgroundColor != 'grey'){
        reinvite.style.backgroundColor = 'grey'
        reinvite.style.cursor = 'default'

        enviar.style.display = 'none'
        loading.style.display = 'flex'
        errorElement.style.color = 'red'
        errorElement.innerText = ''

        setTimeout(function(){
            codigo.style.border = '1px solid #2684DE'
    
            let errors = 0;
    
            if(codigo.value === '' || codigo.value == null){
                errors++
                codigo.style.border = '2px solid red'
                errorElement.innerText = "Você esqueceu de preencher este campo!"
            }
            if(codigo.value.length < 6){
                errors++
                codigo.style.border = '2px solid red'
                errorElement.innerText = "O código enviado possui 6 dígitos!"
            }
    
            if(errors > 0){
                loading.style.display = 'none'
                enviar.style.display = 'inline'
                reinvite.style.backgroundColor = '#2684DE'
    
                e.preventDefault()
            }else{
                tw.init('check_code',[codigo.value,page_type,'recovering'])
            }
        },500)
    }

    e.preventDefault()
})

reinvite.addEventListener('click', (e) => {

    if(reinvite.style.backgroundColor != 'grey'){
        enviar.style.backgroundColor = 'grey'
        enviar.style.cursor = 'default'

        reinvite.style.display = 'none'
        loading_reinvite.style.display = 'flex'
        errorElement.style.color = 'red'
        errorElement.innerText = ''

        setTimeout(function(){
            loading_reinvite.style.display = 'none'
            reinvite.style.display = 'flex'
            enviar.style.backgroundColor = '#2684DE'

            tw.init('open_request',[page_type,'recovering'])
        },500)
    }

})

