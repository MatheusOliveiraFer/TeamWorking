const anuncioContainer = document.getElementById('anuncioContainer')

anuncioContainer.style.padding = '0px'

// var userID = cookieAccess.valor('userID')
var userID = '-MyL9xgPX9dMxu8cB6oh'

setTimeout(function(){
    if(!userID){
        document.location.replace('/index.html')
    }

    tw.init('get_all_project_user',[userID])
},500)

