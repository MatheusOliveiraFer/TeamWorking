const anuncioContainer = document.getElementById('anuncioContainer')

anuncioContainer.style.padding = '0px'

var userID = cookieAccess.valor('userID')

setTimeout(function(){
    if(!userID){
        document.location.replace('/index.html')
    }else{
        tw.init('get_all_projects',[userID])
    }
},500)