const comments_database = {};

(function () {
    function new_comment(projectID, userID, password, email, content) {
        const comments = firebase.database().ref("Comments")
        const project = firebase.database().ref("Projects")

        let project_executed = false
        let exist = false
        let validation = user_database.validate(email, password)

        const comment_data = {
            projectID: projectID,
            userID: userID,
            content: content,
        }

        if(validation.userID == userID){
            project.on('value', (snapshot) => {
                if (!project_executed) {
                    const get_projects = snapshot.val();
    
                    for (let gp in get_projects) {
                        if(gp == projectID){
                            exist = true
                        }
                    }
    
                    project_executed = true
                }
            });
    
            function check() {
                if (project_executed) {
    
                    if (exist) {
                        comments.push(comment_data)
                            .then(function () {
                                console.log("Comentário inserido com sucesso!")
                            })
                            .catch(function (erro) {
                                console.log("Ocorreu um erro ao tentar inserir o comentário: ", erro)
                            })
                    }else{
                        console.log("O projeto informado não existe!")
                    }
                }else{
                    setTimeout(function () {
                        check();
                    }, 1000);
                }
            }
    
            check()
        }else{
            console.log("Você não tem permissão para comentar!")
        }
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