const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectID = urlParams.get('a')

console.log(projectID)

var userID = cookieAccess.valor('userID')

if(!userID || !projectID){
    document.location.replace('/index.html')
}else{
    tw.init('get_project_details', [projectID])
}