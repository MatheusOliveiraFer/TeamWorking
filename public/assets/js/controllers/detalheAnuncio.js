const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectID = urlParams.get('a')

console.log(projectID)

if(!projectID){
    document.location.replace('/meusanuncios/index.html')
}else{
    tw.init('user_exist', ["get_project_details", [projectID]])
}