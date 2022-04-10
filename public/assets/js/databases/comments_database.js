const comments_database = {};

(function () {
    function new_comment(projectID, content, answer) {
        const userID = cookieAccess.valor('userID')

        const comments = firebase.database().ref("Comentarios")
        const project = firebase.database().ref("Projetos").child(projectID)
        const user = firebase.database().ref("Usuarios").child(userID)

        let project_executed = false
        let exist = false

        const comment_data = {
            projetoID: projectID,
            userID: userID,
            conteudo: content,
            usuarioNome: '',
            usuarioImagem: ''
        }

        project.on('value', (snapshot) => {
            if(!project_executed){
                const projectInfo = snapshot.val()
    
                if(projectInfo){
                    user.on('value', (snapshot2) => {
                        const userInfo = snapshot2.val()
    
                        comment_data.usuarioNome = userInfo.nome
    
                        if(userInfo.imagem){
                            comment_data.usuarioImagem = userInfo.imagem
                        }else{
                            comment_data.usuarioImagem = '/assets/images/avatar.png'
                        }
    
                        comments.push(comment_data).then(function(){
                            console.log("Comentário inserido com sucesso!")
                            document.location.reload()
                        }).catch(function(e){
                            console.log("Ocorreu um erro ao tentar criar o comentário:", e)
                        })
                    })
                }

                project_executed = true
            }
        })
        
    }

    function get_all_comments_project(projectID) {
        const comments = firebase.database().ref("Comments")
        const users = firebase.database().ref("Users")
        const userList = []

        let comment_executed = false
        let user_executed = false

        users.on('value', (snapshot) => {
            if (!user_executed) {
                const get_users = snapshot.val();

                for (let gu in get_users) {
                    userList[gu] = {name: get_users[gu].name}
                }

                user_executed = true

                comments.on('value', (snapshot) => {
                    if (!comment_executed) {
                        const get_comments = snapshot.val();
        
                        for (let gc in get_comments) {
                            if(get_comments[gc].projectID == projectID){
                                console.log(userList[get_comments[gc].userID].name + ": " + get_comments[gc].content);
                            }
                        }
        
                        comment_executed = true
                    }
                });
            }
        });
    }

    async function remove_comment(id, email, password) {
        var userID = ''

        //GET IS NOT A FUNCTION
        const comments = firebase.database().ref("Comments").child(id)

        var validation = await user_database.validate(email, password)

        if(validation == userID){
            comments.remove()
                .then(function () {
                    console.log("Comentário removido com sucesso!")
                })
                .catch(function (erro) {
                    console.log("Um erro ocorreu ao tentar excluir o comentário: ", erro)
                })
        }else{
            console.log("Você não tem permissão para efetuar a exclusão!")
        }
    }

    comments_database.new = new_comment;
    comments_database.getAll = get_all_comments_project;
    comments_database.remove = remove_comment;
})()