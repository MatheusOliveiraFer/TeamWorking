const tw = {};

(function () {

    function init(action, parameters) {
        var firebaseConfig = {
            apiKey: "AIzaSyBDs8Gb8tqCImGGqwaCi8w1tgF2i_MHzww",
            authDomain: "teste2-3a116.firebaseapp.com",
            databaseURL: "https://teste2-3a116-default-rtdb.firebaseio.com",
            projectId: "teste2-3a116",
            storageBucket: "teste2-3a116.appspot.com",
            messagingSenderId: "309085303277",
            appId: "1:309085303277:web:87d36e3b89ccbbb675f7e4"
            };

        var trys = 0
            
        try{
            firebase.initializeApp(firebaseConfig)
        }catch(e){}

        function trying(){
            try{
                console.log('to aqui primeiro')

                if(action == 'user_create'){
                    user_database.new(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6])
                }
                if(action == 'user_validation'){
                    user_database.validate(parameters[0],parameters[1])
                }
                if(action == 'open_request'){
                    user_database.request(parameters[0],parameters[1],parameters[2])
                }
                if(action == 'check_code'){
                    user_database.checkCode(parameters[0],parameters[1],parameters[2])
                }
                if(action == 'password_update'){
                    console.log(1)

                    user_database.passwordUpdate(parameters[0],parameters[1],parameters[2])
                }
                if(action == 'get_all_project_user'){
                    project_database.getAllOfUser(parameters[0])
                }
                if(action == 'project_create'){
                    project_database.new(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6],parameters[7],parameters[8])
                }
            }catch(e){
                if(trys <= 5){
                    setTimeout(function () {
                        trys++
                        trying()
                    },500)
                }else{
                    console.log(e)

                    const errorElement = document.getElementById('errorElement')
                    const enviar = document.getElementById('enviar')
                    const loading = document.getElementById('loading-button')
                    const reinvite = document.getElementById('reinvite')
                    const loading_reinvite = document.getElementById('loading-button-reinvite')
                    
                    if(enviar && loading && errorElement){
                        loading.style.display = 'none'
                        enviar.style.display = 'inline'
                        errorElement.innerText = 'Erro interno, por favor tente novamente!'
                    }

                    if(reinvite){
                        loading_reinvite.style.display = 'none'
                        reinvite.style.display = 'inline'
                    }
                }
            }
        }

        trying()
    }

    tw.init = init;
})()