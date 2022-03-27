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

    function get_all_users() {
        const user = firebase.database().ref("Usuarios")
        let user_executed = false

        user.on('value', (snapshot) => {
            if (!user_executed) {
                const get_users = snapshot.val();

                for (let gu in get_users) {
                    console.log(get_users[gu]);
                }
            }

            user_executed = true
        });
    }

    function remove_user(id) {
        const user = firebase.database().ref("Usuarios").child(id)

        user.remove()
            .then(function () {
                console.log("Usuário removido com sucesso!")
            })
            .catch(function (erro) {
                console.log("Um erro ocorreu ao tentar excluir o usuário: ", erro)
            })
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
                        document.cookie = `userID=${userID};expires=${cookieData};`

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

    user_database.new = new_user;
    user_database.getAll = get_all_users;
    user_database.remove = remove_user;
    user_database.validate = validate_user;
    user_database.request = open_request;
    user_database.checkCode = checkCode;
    user_database.passwordUpdate = passwordUpdate;
})()