const project_database = {};

(function () {
    function new_project(title, ownerID, smallDescription, fullDescription, lookingFor, linkVideo) {
        const project = firebase.database().ref("Projects")

        const project_data = {
            title: title,
            ownerID: ownerID,
            smallDescription: smallDescription,
            fullDescription: fullDescription,
            lookingFor: lookingFor,
            linkVideo: linkVideo
        }

        let exist = false;
        let project_executed = true;

        // project.on('value', (snapshot) => {
        //     if (!project_executed) {
        //         const get_projects = snapshot.val();

        //         for (let gp in get_projects) {
        //             if (get_projects[gp].title == title) {
        //                 exist = true
        //             }
        //         }

        //         project_executed = true;
        //     }
        // });

        // function check() {
        //     if (project_executed) {
        //         if (exist) {
        //             console.log("Existe um projeto com este nome já registrado no sistema")
        //         } else {
                    project.push(project_data)
                        .then(function () {
                            console.log("Projeto criado com sucesso!")
                        })
                        .catch(function (erro) {
                            console.log("Um erro ocorreu ao tentar criar o projeto: ", erro)
                        })
        //         }
        //     } else {
        //         setTimeout(function () {
        //             check();
        //         }, 1000);
        //     }
        // }

        // check()
    }

    function get_all_projects() {
        const project = firebase.database().ref("Projetos")
        let project_executed = false

        project.on('value', (snapshot) => {
            if (!project_executed) {
                const get_projects = snapshot.val();

                for (let gp in get_projects) {
                    console.log(get_projects[gp]);
                }

                project_executed = true
            }
        });
    }

    function get_all_project_user(userID){
        const project = firebase.database().ref("Projects")
        let project_executed = false
        let has = false;

        project.on('value', (snapshot) => {
            if (!project_executed) {
                const get_projects = snapshot.val();

                for (let gp in get_projects) {
                    if(get_projects[gp].ownerID == userID){
                        console.log(get_projects[gp]);
                        has = true;
                    }
                }

                if(!has){
                    console.log("Este usuário ainda não criou nenhum projeto")
                }

                project_executed = true
            }
        });
    }

    function remove_project(id, email, password) {
        const project = firebase.database().ref("Projects").child(id)

        let validation = user_database.validate(email, password)

        if(validation.userID == project.val().ownerID){
            project.remove()
                .then(function () {
                    console.log("Projeto removido com sucesso!")
                })
                .catch(function (erro) {
                    console.log("Um erro ocorreu ao tentar excluir o projeto: ", erro)
                })
        }else{
            console.log("Você não tem permissão para efetuar a exclusão!")
        }
    }

    project_database.new = new_project;
    project_database.getAll = get_all_projects;
    project_database.getAllOfUser = get_all_project_user;
    project_database.remove = remove_project;
})()