const textComentar = document.getElementById('text-comentar')
const enviarComentario = document.getElementById('enviar-comentario')

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
    if(textComentar.value != ''){
        tw.init('user_exist',['comment_create',[projectID,textComentar.value]])
    }
})