const comments_database = {};

(function () {
    function new_comment(projectID, content) {
        const userID = cookieAccess.valor('userID')

        const comments = firebase.database().ref("Comentarios")
        const project = firebase.database().ref("Projetos").child(projectID)
        const user = firebase.database().ref("Usuarios").child(userID)

        let project_executed = false

        const comment_data = {
            projetoID: projectID,
            usuarioID: userID,
            conteudo: content,
            usuarioNome: '',
            usuarioImagem: '',
            usuarioEmail: ''
        }

        project.on('value', (snapshot) => {
            if(!project_executed){
                const projectInfo = snapshot.val()
    
                if(projectInfo){
                    user.on('value', (snapshot2) => {
                        const userInfo = snapshot2.val()
    
                        comment_data.usuarioNome = userInfo.nome
                        comment_data.usuarioEmail = userInfo.email
    
                        if(userInfo.imagem){
                            comment_data.usuarioImagem = userInfo.imagem
                        }else{
                            comment_data.usuarioImagem = '/assets/images/avatar.jpg'
                        }
    
                        comments.push(comment_data).then(function(){
                            console.log("Comentário inserido com sucesso!")
                            
                            if(projectInfo.IDdono != userID){
                                const owner = firebase.database().ref("Usuarios").child(projectInfo.IDdono)
    
                                owner.on('value', (snapshot3) => {
                                   const ownerInfo = snapshot3.val()
                                   
                                   const username = userInfo.nome.split(" ", 2)

                                   console.log("Username:",username)
    
                                   emailSend.notification(ownerInfo.email, username[0], content, projectInfo.titulo)
                                })
                            }else{
                                document.location.reload()
                            }

                        }).catch(function(e){
                            console.log("Ocorreu um erro ao tentar criar o comentário:", e)
                        })
                    })
                }

                project_executed = true
            }
        })
        
    }

    function new_answer(projectID, content, commentID){
        const project = firebase.database().ref("Projetos").child(projectID)
        const comments = firebase.database().ref("Comentarios")

        const userID = cookieAccess.valor("userID")
        const user = firebase.database().ref("Usuarios").child(userID)

        const comment_data = {
            projetoID: projectID,
            usuarioID: userID,
            conteudo: content,
            usuarioNome: '',
            usuarioImagem: '',
            usuarioEmail: '',
            respostaDe: commentID
        }

        let project_executed = false

        project.on('value', (snapshot) => {
            if(!project_executed){
                const projectInfo = snapshot.val()
    
                if(projectInfo.IDdono == userID){
                    user.on('value', (snapshot2) => {
                        const userInfo = snapshot2.val()

                        comment_data.usuarioNome = userInfo.nome
                        comment_data.usuarioEmail = userInfo.email

                        if(userInfo.imagem){
                            comment_data.usuarioImagem = userInfo.imagem
                        }else{
                            comment_data.usuarioImagem = '/assets/images/avatar.jpg'
                        }

                        comments.push(comment_data).then(function(){
                            console.log("Resposta inserida com sucesso!")

                            const commentData = firebase.database().ref("Comentarios").child(commentID)
                            
                            commentData.on('value', (snapshot3) => {
                                const commentInfo = snapshot3.val()

                                const username = userInfo.nome.split(" ",2)

                                emailSend.notification(commentInfo.usuarioEmail, username[0], content, projectInfo.titulo)
                            })

                        }).catch(function(e){
                            console.log("Ocorreu um erro ao tentar criar a resposta:", e)
                        })
                    })
                }
            }
        })
    }

    // function remove_comment(id, email, password) {
    //     var userID = ''

    //     //GET IS NOT A FUNCTION
    //     const comments = firebase.database().ref("Comments").child(id)

    //     var validation = await user_database.validate(email, password)

    //     if(validation == userID){
    //         comments.remove()
    //             .then(function () {
    //                 console.log("Comentário removido com sucesso!")
    //             })
    //             .catch(function (erro) {
    //                 console.log("Um erro ocorreu ao tentar excluir o comentário: ", erro)
    //             })
    //     }else{
    //         console.log("Você não tem permissão para efetuar a exclusão!")
    //     }
    // }

    comments_database.new = new_comment;
    comments_database.newAnswer = new_answer;
    // comments_database.remove = remove_comment;
})()