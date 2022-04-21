const user_database = {};

(function () {
    function new_user(name, email, confirmPassword, password, phone, uf, city) {
        let enviar = document.getElementById('enviar')
        let loading = document.getElementById('loading-button')
        let email_div = document.getElementById('email')
        let errorElement = document.getElementById('errorElement')

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            enviar = document.getElementById('enviar_modal')
            loading = document.getElementById('loading-button_modal')
            email_div = document.getElementById('email_modal')
            errorElement = document.getElementById('errorElement_modal')
        }

        if (confirmPassword != password) {
            console.log('As duas senhas passadas são diferentes')
            return
        }

        const user = firebase.database().ref("Usuarios")

        const user_data = {
            nome: name,
            email: email,
            senha: CryptoJS.MD5(password).toString(),
            imagem: '/assets/images/avatar.jpg',
            telefone: phone,
            uf: uf,
            cidade: city,
            confirmado: false,
            bloqueado: false,
        }

        let exist = false;
        let user_executed = false;

        user.on('value', (snapshot) => {
            if (!user_executed) {
                const get_users = snapshot.val();

                for (let gu in get_users) {
                    if (get_users[gu].email == email) {
                        exist = true
                    }
                }

                user_executed = true;
            }
        });

        function check() {
            if (user_executed) {
                if (exist) {
                    console.log("O email de usuário informado já existe no sistema")

                    errorElement.innerHTML = "O email de usuário informado já existe no sistema!"

                    enviar.style.display = 'inline'
                    loading.style.display = 'none'
                    email_div.style.border = '2px solid red'
                } else {
                    user.push(user_data)
                        .then(function () {
                            console.log("Usuário criado com sucesso!")
                            window.location.replace(`/rota_confirmacao/confirmacao/?email=${email}`)
                        })
                        .catch(function (erro) {
                            console.log("Um erro ocorreu ao tentar criar o usuário: ", erro)
                            errorElement.innerHTML = "Erro interno, por favor tente novamente!"

                            enviar.style.display = 'inline'
                            loading.style.display = 'none'
                        })
                }
            } else {
                setTimeout(function () {
                    check();
                }, 1000);
            }
        }

        check()
    }

    function update_user(name, phone, uf, city, image, updatedImage){
        var userID = cookieAccess.valor('userID')

        const user = firebase.database().ref(`Usuarios/${userID}`)
        const upload = firebase.storage().ref(`Avatares/${userID}/`)
        const save_button = document.getElementById('save_button')
        const loading = document.getElementById('loading-button')

        const errorElement = document.getElementById('errorElement')
        errorElement.style.color = 'red'

        let imageName = `${userID}_avatar`
        let URLimagem = ''
        let uploadImage = false;
        let user_executed = false;

        if(updatedImage){
            upload.child(imageName).put(image).then(function(){
                upload.child(imageName).getDownloadURL().then(function(url_imagem){
                    URLimagem = url_imagem
                    uploadImage = true
                })
                .catch(function(e){
                    save_button.style.display = 'inline'
                    loading.style.display = 'none'
                    console.log('Ocorreu um erro ao tentar atualizar o usuário:',e)
                    errorElement.innerText = 'Erro interno, por favor tente novamente!'

                    return
                })
            })
            .catch(function(e){
                save_button.style.display = 'inline'
                loading.style.display = 'none'
                console.log('Ocorreu um erro ao tentar atualizar o usuário:',e)
                errorElement.innerText = 'Erro interno, por favor tente novamente!'

                return
            })
        }

        function check(){

            if(uploadImage){
                user.on('value', (snapshot) => {
                    if (!user_executed) {
                        let user_info = snapshot.val()
    
                        user_info.nome = name;
                        user_info.telefone = phone;
                        user_info.uf = uf;
                        user_info.city = city;
                        user_info.imagem = URLimagem;
    
                        user.update(user_info).then(function(){
                            console.log('Usuário atualizado com sucesso!')

                            const comments = firebase.database().ref('Comentarios')
                            let comments_executed = false
                            
                            comments.on('value', (snapshot2) => {
                                if(!comments_executed){
                                    let commentsInfo = snapshot2.val()
                                    let num = 0 //NUMERO DE ITERAÇÕES DO FOR
                                    let count = 0 //NÚMERO DE UPDATES REALIZADOS
    
                                    for(gc in commentsInfo){
                                        if(commentsInfo[gc].usuarioID == userID){
                                            commentsInfo[gc].usuarioNome == user_info.nome
                                            commentsInfo[gc].usuarioImagem == URLimagem
    
                                            comments.child(gc).update(commentsInfo[gc]).then(function(e){
                                                count++
                                            })
                                            .catch(function(e){
                                                console.log("Ocorreu um erro ao tentar atualizar as informações do comentário",gc,e)
                                            })

                                            num++
                                        }
                                    }

                                    function check(){
                                        if(count == num){
                                            save_button.style.display = 'inline'
                                            loading.style.display = 'none'
                                            errorElement.innerText = 'Atualização feita com sucesso!'
                                            errorElement.style.color = 'green'
                                        }else{
                                            setTimeout(function(){
                                                check()
                                            },500)
                                        }
                                    }

                                    check()

                                    comments_executed = true
                                }
                            })

                            errorElement.style.color = 'green'
                            save_button.style.display = 'inline'
                            loading.style.display = 'none'
                            errorElement.innerText = 'Atualização feita com sucesso!'

                        }).catch(function(e){
                            save_button.style.display = 'inline'
                            loading.style.display = 'none'
                            console.log('Ocorreu um erro ao tentar atualizar o usuário:',e)
                            errorElement.innerText = 'Erro interno, por favor tente novamente!'
                        })
                    }

                    user_executed = true;
                })
            }else{
                setTimeout(function(){
                    check()
                },500)
            }
        }

        //CASO A IMAGEM TIVER SIDO ATUALIZADA É EXECUTADA A FUNÇÃO ACIMA PARA ATUALIZAR OS REGISTROS SÓ DEPOIS QUE A IMAGEM FOR UPADA, CASO CONTRÁRIO É FEITO A ATUALIZAÇÃO DOS REGISTROS IMEDIATAMENTE
        if(updatedImage){
            check()
        }else{
            user.on('value', (snapshot) => {
                if (!user_executed) {                    
                    let user_info = snapshot.val()
        
                    user_info.nome = name;
                    user_info.telefone = phone;
                    user_info.uf = uf;
                    user_info.city = city;
    
                    user.update(user_info).then(function(){
                        console.log('Usuário atualizado com sucesso!')
                        save_button.style.display = 'inline'
                        loading.style.display = 'none'
                        errorElement.innerText = 'Atualização feita com sucesso!'
                        errorElement.style.color = 'green'
                    }).catch(function(e){
                        save_button.style.display = 'inline'
                        loading.style.display = 'none'
                        console.log('Ocorreu um erro ao tentar atualizar o usuário:',e)
                        errorElement.innerText = 'Erro interno, por favor tente novamente!'
                    })
                }

                user_executed = true;
            })
        }
    }

    function validate_user(email, password) {
        const errorElement = document.getElementById('errorElement')
        const enviar = document.getElementById('enviar')
        const loading = document.getElementById('loading-button')
        const email_div = document.getElementById('email')
        const password_div = document.getElementById('password')

        const user = firebase.database().ref("Usuarios")

        password = CryptoJS.MD5(password).toString()

        let username = ""
        let userID = ""
        let user_executed = false
        let confirmation = false

        user.on('value', (snapshot) => {
            console.log('to aqui')

            if (!user_executed) {
                const get_users = snapshot.val();

                for (let gu in get_users) {
                    if (get_users[gu].email == email && get_users[gu].senha == password) {
                        username = get_users[gu].nome
                        userID = gu
                        confirmation = get_users[gu].confirmado
                    }
                }

                if (username == "") {
                    console.log("Email não encontrado ou senha inválida")

                    errorElement.innerText = 'Email não encontrado ou senha inválida!'

                    loading.style.display = 'none'
                    enviar.style.display = 'inline'
                    email_div.style.border = '2px solid red'
                    password_div.style.border = '2px solid red'
                } else {
                    if (confirmation) {
                        console.log(`O nome do usuário é ${username} e seu ID é ${userID}`)

                        var cookieData = new Date(5100,0,01);
                        cookieData = cookieData.toUTCString()
                        document.cookie = `userID=${userID};expires=${cookieData}; path=/;`

                        document.location.replace('/cadastro/Home.html')
                    } else {
                        errorElement.innerHTML = `Usuário não confirmado, <a style="
                            cursor: pointer;
                            color: #2684DE";
                        } onclick="window.location.replace('/rota_confirmacao/confirmacao/?email=${email}')">confirme aqui</a>!`
                    
                        enviar.style.display = 'inline'
                        loading.style.display = 'none'
                    }
                }

                user_executed = true;

                // return userID
            }
        });
    }

    function open_request(email,situation) {
        const errorElement = document.getElementById('errorElement')
        const enviar = document.getElementById('enviar')
        const loading = document.getElementById('loading-button')
        let input_div = document.getElementById('campo')

        console.log('Email recebido',email)

        const user = firebase.database().ref("Usuarios")
        const request = firebase.database().ref("Requisicoes")
        let user_executed = false
        let request_executed = false
        let user_exist = false
        let last_request = ''
        let confirmed = false
        let username = ''
        let code = Date.now().toString()
        code = code[code.length -1] + code[code.length -2] + code[code.length -3] + code[code.length -4] + code[code.length -5] + code[code.length -6]  

        const request_data = {
            email: email,
            validade: Date.now() + 1800 * 1000, //MEIA HORA
            codigo: code
        }

        //* VERIFICA SE O EMAIL INFORMADO PERTENCE A ALGUM USUÁRIO
        user.on('value', (snapshot) => {
            console.log('estou aqui')

            if (!user_executed) {
                const get_users = snapshot.val();

                for (let gu in get_users) {
                    if (get_users[gu].email == email) {
                        user_exist = true
                        confirmed = get_users[gu].confirmado
                        username = get_users[gu].nome.split(" ", 2)
                    }
                }

                user_executed = true;
            }
        });

        //* VERIFICA SE JÁ EXISTE ALGUMA REQUISIÇÃO NO NOME DAQUELE USUÁRIO
        request.on('value', (snapshot) => {
            console.log('estou aqui')

            if (!request_executed) {
                const get_requests = snapshot.val();

                for (let gq in get_requests) {
                    if (get_requests[gq].email == email) {
                        last_request = gq
                    }
                }

                request_executed = true;
            }
        });

        function check() {
            if (user_executed && request_executed) {
                if (user_exist) {
                    let duplicate_remove_fail = false

                    if (last_request != '') {
                        request.child(last_request).remove()
                            .then(function () {
                                console.log("Remoção da requisição repetida executada")
                            })
                            .catch(function (e) {
                                console.log("Ocorreu um erro ao tentar remover a requisição!", e)
                                
                                duplicate_remove_fail = true
                            })
                    }

                    if(!duplicate_remove_fail){
                        if(situation == 'confirmation' && confirmed == false){
                            request.push(request_data)
                            .then(function () {
                                console.log("Requisição inserida com sucesso!")

                                emailSend.password(email, code, username[0], '/rota_confirmacao/confirmacao')
                            })
                            .catch(function (e) {
                                console.log("Ocorreu um erro ao tentar criar a requisição!", e)
                                errorElement.innerText = "Erro interno, por favor tente novamente!"

                                enviar.style.display = 'inline'
                                loading.style.display = 'none'
                            })
                        }
                        if(situation == 'confirmation' && confirmed == true){
                            errorElement.innerHTML = `O usuário já foi confirmado, faça seu <a style="
                                cursor: pointer;
                                color: #2684DE";
                            } onclick="window.location.replace('/')">Login</a>!`
                        
                            enviar.style.display = 'inline'
                            loading.style.display = 'none'
                        }
                        if(situation == 'recovering' && confirmed == false){
                            errorElement.innerHTML = `Usuário não confirmado, <a style="
                                cursor: pointer;
                                color: #2684DE";
                            } onclick="window.location.replace('/rota_confirmacao/confirmacao/?email=${email}')">confirme aqui</a>!`
                        
                            enviar.style.display = 'inline'
                            loading.style.display = 'none'
                        }
                        if(situation == 'recovering' && confirmed == true){
                                request.push(request_data)
                            .then(function () {
                                console.log("Requisição inserida com sucesso!")

                                emailSend.password(email, code, username[0], '/rota_recuperacao/codigo')
                            })
                            .catch(function (e) {
                                console.log("Ocorreu um erro ao tentar criar a requisição!", e)
                                errorElement.innerText = "Erro interno, por favor tente novamente!"

                                enviar.style.display = 'inline'
                                loading.style.display = 'none'
                            })
                        }
                    }else{
                        console.log("Ocorreu um erro ao tentar criar a requisição!")
                        errorElement.innerText = "Erro interno, por favor tente novamente!"

                        enviar.style.display = 'inline'
                        loading.style.display = 'none'
                    }
                } else {
                    console.log('E-mail não encontrado!')
                    errorElement.innerText = "E-mail não encontrado!"

                    enviar.style.display = 'inline'
                    loading.style.display = 'none'
                    input_div.style.border = '2px solid red'
                }
            } else {
                setTimeout(function () {
                    check();
                }, 1000);
            }
        }

        check()
    }

    function checkCode(code,email,situation){
        const request = firebase.database().ref("Requisicoes")
        const user = firebase.database().ref("Usuarios")
        const errorElement = document.getElementById('errorElement') 
        const loading = document.getElementById('loading-button')
        const enviar = document.getElementById('enviar')
        const reinvite = document.getElementById('reinvite')

        let request_executed = false
        let user_executed = false
        var code_exist = false

        console.log(code)

        request.on('value', (snapshot) => {
            console.log('estou aqui')

            if (!request_executed) {
                const get_requests = snapshot.val();

                for (let gq in get_requests) {
                    if (get_requests[gq].email == email) {
                        if(get_requests[gq].codigo == code.toString()){
                            if(get_requests[gq].validade > Date.now()){
                                if(situation == 'recovering'){
                                    window.location.replace( `/rota_recuperacao/recuperacao/?a=${gq}`)
                                }else if(situation == 'confirmation'){
                                    user.on('value', (snapshot) => {
                                        if (!user_executed) {
                                            const get_users = snapshot.val();
                            
                                            for (let gu in get_users) {
                                                if (get_users[gu].email == email) {
                                                    const userUpdated = user.child(gu)

                                                    get_users[gu].confirmado = true

                                                    userUpdated.update(get_users[gu]).then(
                                                        function(){
                                                            window.location.replace('/rota_confirmacao/confirmado')
                                                        })
                                                }
                                            }
                            
                                            user_executed = true;
                                        }
                                    });
                                }
                                code_exist = true
                            }else{
                                errorElement.innerText = 'Código vencido ou inválido'
                            }
                        }else{}
                    }
                }

                request_executed = true;
            }
        });

        function check() {
            if(request_executed && !code_exist) {
                errorElement.innerText = 'Código vencido ou inválido'
                loading.style.display = 'none'
                enviar.style.display = 'inline'
                reinvite.style.backgroundColor = '#2684DE'
            }else{
                setTimeout(function () {
                    check();
                }, 1000);
            }
        }

        check()
    }

    function passwordUpdate(requestId,confirmPassword,password){
        const request = firebase.database().ref("Requisicoes").child(requestId)
        const users = firebase.database().ref("Usuarios")

        const errorElement = document.getElementById('errorElement')
        const loading = document.getElementById('loading-button')
        const enviar = document.getElementById('enviar')

        if (confirmPassword != password) {
            console.log('As duas senhas passadas são diferentes')
            return
        }



        let request_executed = false
        let user_executed = false
        let email = ''

        request.on('value', (snapshot) => {
            if (!request_executed) {
                const get_requests = snapshot.val();

                email = get_requests.email

                request.remove()
                    .then(function () {
                        console.log("Requisição consumida!")
                    })
                    .catch(function (erro) {
                        console.log("Um erro ocorreu ao tentar excluir a requisição: ", erro)
                    })

                request_executed = true;
            }
        });

        function check(){
            if(request_executed){
                users.on('value', (snapshot) => {
                    if (!user_executed) {
                        const get_users = snapshot.val();

                        for (let gu in get_users) {
                            if(get_users[gu].email == email){
                                get_users[gu].senha = CryptoJS.MD5(password).toString()

                                const updatedUser = users.child(gu)

                                updatedUser.update(get_users[gu])
                                    .then(function(){
                                        console.log("Usuário atualizado com sucesso!")

                                        enviar.style.display = 'inline'
                                        loading.style.display = 'none'

                                        window.location.replace('/rota_recuperacao/concluido')
                                    })
                                    .catch(function(e){
                                        console.log("Um erro ocorreu ao tentar atualizar o usuário: ", erro)
                                        errorElement.innerHTML = "Erro interno, por favor tente novamente!"

                                        enviar.style.display = 'inline'
                                        loading.style.display = 'none'
                                    })
                            }
                        }

                        user_executed = true;
                    }
                })
            }else{
                setTimeout(function () {
                    check();
                }, 1000);
            }
        }

        check()
    }

    function getUser() {
        var userID = cookieAccess.valor('userID')

        const user = firebase.database().ref("Usuarios").child(userID)
        let user_executed = false

        user.on('value', (snapshot) => {
            if (!user_executed) {
                const get_user = snapshot.val();

                document.getElementById('name_input').value = get_user.nome
                document.getElementById('email_input').value = get_user.email
                document.getElementById('phone_input').value = get_user.telefone
                document.getElementById('uf_input').value = get_user.uf
                document.getElementById('city_input').value = get_user.cidade

                document.getElementById('avatar-image').style.backgroundImage = `url('${get_user.imagem}')`
                
            
                console.log(get_user.imagem)
            }
            
            user_executed = true
            
        });
    }

    function userExist(action, parameters){
        var userID = cookieAccess.valor('userID')
        console.log('aqui',userID)

        if((!userID || userID == '') && action != 'login'){
            document.location.replace('/login/index.html')
            console.log('Login de cima')
        }
        else if((!userID || userID == '') && action == 'login'){
            console.log('Mantenha aqui')
        }

        let path = `Usuarios/${userID}`

        if(path != 'Usuarios/'){
            const user = firebase.database().ref(path)
    
            user.on('value', (snapshot) => {
                const userInfo = snapshot.val()
    
                console.log(userInfo)
    
                if(!userInfo){
                    var cookieData = new Date(5100,0,01);
                    cookieData = cookieData.toUTCString()
                    document.cookie = `userID=;expires=${cookieData};path=/;`
    
                    if(action != 'login'){
                        document.location.replace('/login/index.html')
                        console.log('Login de baixo')
                    }
                }else{
                    console.log(userInfo.nome)

                    if(action == 'login'){
                        document.location.replace('/cadastro/Home.html')
                        console.log('Home')
                    }else{
                        console.log("tw.init")
    
                        if(action && parameters){
                            tw.init(action, parameters)
                        }else if(action && !parameters){
                            tw.init(action)
                        }
                    }
                }
            })
        }
    }

    user_database.new = new_user;
    user_database.update = update_user;
    user_database.validate = validate_user;
    user_database.request = open_request;
    user_database.checkCode = checkCode;
    user_database.passwordUpdate = passwordUpdate;
    user_database.getUser = getUser;
    user_database.exist = userExist;
})()