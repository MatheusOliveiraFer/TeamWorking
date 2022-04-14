const textComentar = document.getElementById('text-comentar')
const enviarComentario = document.getElementById('enviar-comentario')
const comments_container = document.getElementById('comentarios-container')
const loading_button = document.getElementById('loading-button')
comments_container.innerHTML = ''

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectID = urlParams.get('a')

console.log(projectID)

if(!projectID){
    document.location.replace('/meusanuncios/index.html')
}else{
    tw.init('user_exist', ["get_project_details", [projectID]])
}

enviarComentario.addEventListener('click', function(e){
    enviarComentario.style.display = 'none'
    loading_button.style.display = 'flex'

    setTimeout(function(){
        if(textComentar.value != ''){
            tw.init('user_exist',['comment_create',[projectID,textComentar.value]])
        }else{
            textComentar.focus()

            enviarComentario.style.display = 'flex'
            loading_button.style.display = 'none'
        }
    },500)
})

function send_answer(commentID){
    const textAnswer = document.getElementById(`input_resp_${commentID}`)
    const buttonAnswer = document.getElementById(`button_answer_${commentID}`)
    const loadingAnswer = document.getElementById(`loading-button-${commentID}`)

    buttonAnswer.style.display = 'none'
    loadingAnswer.style.display = 'flex'

    setTimeout(function(){
        if(textAnswer.value != ''){
            tw.init('user_exist',['answer_create',[projectID,textAnswer.value,commentID]])
        }else{
            textAnswer.focus()

            buttonAnswer.style.display = 'flex'
            loadingAnswer.style.display = 'none'
        }
    },500)

}

function see_answers(id){
    if(document.getElementById(`see_answers_${id}`).innerText == '▶ Ver respostas'){
        document.getElementById(`answers_box_${id}`).style.display = 'flex'
        document.getElementById(`see_answers_${id}`).innerText = '▼ Ver respostas'
    }else{
        document.getElementById(`answers_box_${id}`).style.display = 'none'
        document.getElementById(`see_answers_${id}`).innerText = '▶ Ver respostas'
    } 
}

function removeComment(commentID){
    var r = confirm('Quer mesmo excluir este comentário? Respostas dadas a este comentário também serão excluídas no processo!');

    if(r == true){
        tw.init('user_exist',['comment_remove',[`${commentID}`]])
    }
}