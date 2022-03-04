const user_database = {};

(function () {
    function new_user(name, email, confirmPassword, password, phone, uf, city) {
        const enviar = document.getElementById('enviar')
        const loading = document.getElementById('loading-button')
        const email_div = document.getElementById('email')

        if(confirmPassword != password){
            console.log('As duas senhas passadas são diferentes')
            return
        }

        const user = firebase.database().ref("Users")

        const user_data = {
            name: name,
            email: email,
            password: CryptoJS.MD5(password).toString(),
            phone: phone,
            uf: uf,
            city: city,
            confirmation: true
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
                    const errorElement = document.getElementById('errorElement')

                    errorElement.innerHTML = "O email de usuário informado já existe no sistema!"
                
                    enviar.style.display = 'inline'
                    loading.style.display = 'none'
                    email_div.style.border = '2px solid red'
                } else {
                    user.push(user_data)
                        .then(function () {
                            console.log("Usuário criado com sucesso!")
                            window.location.replace('Home.html') //FUTURAMENTE TELA HOME
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
        const user = firebase.database().ref("Users")
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
        const user = firebase.database().ref("Users").child(id)

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

        const user = firebase.database().ref("Users")

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
                    if (get_users[gu].email == email && get_users[gu].password == password) {
                        username = get_users[gu].name
                        userID = gu
                        confirmation = get_users[gu].confirmation
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

                        errorElement.innerText = `O nome do usuário é ${username}!`
                        errorElement.style.color = "green"

                        loading.style.display = 'none'
                        enviar.style.display = 'inline'
                    } else {
                        console.log("Por favor, verifique seu email, foi enviado um e-mail de confirmação!")
                    }
                }

                user_executed = true;

                // return userID
            }
        });
    }

    user_database.new = new_user;
    user_database.getAll = get_all_users;
    user_database.remove = remove_user;
    user_database.validate = validate_user;
})()