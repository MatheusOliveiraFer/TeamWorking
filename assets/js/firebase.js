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
            }catch(e){
                setTimeout(function () {
                    trying()
                },500)
            }
        }

        trying()
    }

    tw.init = init;
})()