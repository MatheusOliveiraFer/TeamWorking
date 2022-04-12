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
    
                                   emailSend.notification(ownerInfo.email, username[0], content, projectInfo.titulo, 'comment')
                                })
                            }else{
                                document.location.reload()
                            }

                            document.getElementById('enviar-comentario').style.display = 'flex'
                            document.getElementById('loading-button').style.display = 'none'
                            document.getElementById('text-comentar').value = ''
                            
                        }).catch(function(e){
                            console.log("Ocorreu um erro ao tentar criar o comentário:", e)

                            document.getElementById('enviar-comentario').style.display = 'flex'
                            document.getElementById('loading-button').style.display = 'none'
                            document.getElementById('text-comentar').value = ''
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
                            
                            let commentData_executed = false
                            commentData.on('value', (snapshot3) => {
                                if(!commentData_executed){
                                    const commentInfo = snapshot3.val()
    
                                    const username = userInfo.nome.split(" ",2)
    
                                    emailSend.notification(commentInfo.usuarioEmail, username[0], content, projectInfo.titulo, 'answer')

                                    commentData_executed = true
                                }
                            })

                            document.getElementById(`button_answer_${commentID}`).style.display = 'flex'
                            document.getElementById(`loading-button-${commentID}`).style.display = 'none'
                            document.getElementById(`input_resp_${commentID}`).value = ''

                        }).catch(function(e){
                            console.log("Ocorreu um erro ao tentar criar a resposta:", e)

                            document.getElementById(`button_answer_${commentID}`).style.display = 'flex'
                            document.getElementById(`loading-button-${commentID}`).style.display = 'none'
                            document.getElementById(`input_resp_${commentID}`).value = ''
                        })
                    })
                }
            }
        })
    }

    function remove_comment(commentID) {
        const userID = cookieAccess.valor("userID")
        const comment = firebase.database().ref("Comentarios").child(commentID)

        let comment_executed = false
        let answer_executed = false

        comment.on('value', (snapshot) => {
            if(!comment_executed){
                const commentInfo = snapshot.val()

                if(commentInfo && commentInfo.usuarioID == userID){

                    comment.remove().then(function(){
                        const commentAnswers = firebase.database().ref("Comentarios")

                        commentAnswers.on('value', (snapshot2) => {
                            if(!answer_executed){
                                const answerInfo = snapshot2.val()
    
                                for(a in answerInfo){
                                    if(answerInfo[a].respostaDe && answerInfo[a].respostaDe == commentID){
                                        const answer = firebase.database().ref("Comentarios").child(a) 

                                        answer.remove().then(function(msg){
                                            console.log("Resposta excluída",msg)
                                        }).catch(function(e){
                                            console.log("Ocorreu um erro ao tentar excluir a resposta:",e)
                                        })

                                        console.log("Excluido resposta:", answerInfo[a].conteudo)
                                    }
                                }

                                answer_executed = true
                            }
                        })
                    }).catch(function(e){
                        console.log("Ocorreu um erro ao tentar excluir o comentário:",e)
                    })

                    console.log("Excluido comentário:", commentInfo.conteudo)
                }

                comment_executed = true
            }
        })
    }

    comments_database.new = new_comment;
    comments_database.newAnswer = new_answer;
    comments_database.remove = remove_comment;
})()