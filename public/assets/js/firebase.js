const tw = {};

(function () {

    function init(action, parameters) {
        // const firebaseConfig = {
        //     apiKey: "AIzaSyA2f2TRgVCZumOvWRn9xbKaey38pRFZsXw",
        //     authDomain: "teste-e58af.firebaseapp.com",
        //     databaseURL: "https://teste-e58af-default-rtdb.firebaseio.com",          
        //     projectId: "teste-e58af",          
        //     storageBucket: "teste-e58af.appspot.com",          
        //     messagingSenderId: "946883589121",          
        //     appId: "1:946883589121:web:c3b909214a05c6ce7dbc00",          
        //     measurementId: "G-SL3MKZV8E6"          
        // };

        const firebaseConfig = {
            apiKey: "AIzaSyAhIbe5H2iHquv3_IO87wKtkKE20IvJgx0",
            authDomain: "queroumsocio-978e2.firebaseapp.com",
            databaseURL: "https://queroumsocio-978e2-default-rtdb.firebaseio.com",
            projectId: "queroumsocio-978e2",
            storageBucket: "queroumsocio-978e2.appspot.com",
            messagingSenderId: "926845539156",
            appId: "1:926845539156:web:61e031fa3119702902aec1",
            measurementId: "G-SP7RYEELMK"
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
                    user_database.passwordUpdate(parameters[0],parameters[1],parameters[2])
                }
                if(action == 'get_user_info'){
                    user_database.getUser()
                }
                if(action == 'update_user_info'){
                    user_database.update(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5])
                }
                if(action == 'user_exist'){
                    user_database.exist(parameters[0],parameters[1])
                }
                if(action == 'get_all_projects'){
                    project_database.getAll()
                }
                if(action == 'get_all_project_user'){
                    project_database.getAllOfUser()
                }
                if(action == 'project_create'){
                    project_database.new(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6],parameters[7])
                }
                if(action == 'get_project_info'){
                    project_database.getProject(parameters[0])
                }
                if(action == 'project_update'){
                    project_database.update(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6],parameters[7],parameters[8])
                }
                if(action == 'get_project_details'){
                    project_database.getProjectDetails(parameters[0])
                }
                if(action == 'project_remove'){
                    project_database.remove(parameters[0])
                }
                if(action == 'comment_create'){
                    comments_database.new(parameters[0],parameters[1])
                }
                if(action == 'answer_create'){
                    comments_database.newAnswer(parameters[0],parameters[1],parameters[2])
                }
                if(action == 'comment_remove'){
                    comments_database.remove(parameters[0])
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

                    // firebase.app().delete()
                }
            }
        }

        trying()
    }

    tw.init = init;
})()