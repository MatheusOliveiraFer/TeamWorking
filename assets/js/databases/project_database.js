const project_database = {};

(function () {
    function new_project(title, ownerID, smallDescription, fullDescription, lookingFor, linkVideo, valor) {
        const project = firebase.database().ref("Projetos")

        const project_data = {
            titulo: title,
            IDdono: ownerID,
            descricaoPequena: smallDescription,
            descricaoCompleta: fullDescription,
            buscando: lookingFor,
            linkVideo: linkVideo,
            valor: valor
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

    function get_all_project_user(userID) {
        const project = firebase.database().ref("Projetos")
        const user = firebase.database().ref("Usuarios").child(userID)
        
        const anuncioContainer = document.getElementById('anuncioContainer')

        let project_executed = false
        let has = false;

        anuncioContainer.innerHTML = ""

        project.on('value', (snapshot) => {
            if (!project_executed) {


                const get_projects = snapshot.val();

                user.on('value', (snapshot) => {
                    ownerData = snapshot.val()

                    for (let gp in get_projects) {
                        if (get_projects[gp].IDdono == userID) {
                            console.log(get_projects[gp]);
                            anuncioContainer.innerHTML += meusAnuncios_item(get_projects[gp].titulo,get_projects[gp].descricaoPequena,get_projects[gp].buscando,ownerData.nome,ownerData.cidade,ownerData.uf,get_projects[gp].valor,gp)
                            

                            const lista = document.getElementById(`lista-imagem_${gp}`)

                            let num = 0

                            //PARA QUANDO TIVER VÍDEO
                            // if(get_projects[gp].linkVideo){
                            //     lista.innerHTML += `<div id="imagemID" class="imagem1">

                            //     </div>`
                            // }
                
                            get_projects[gp].imagens.forEach( item => {
                                imageID = `imagem_${gp}_${num}`
                
                                lista.innerHTML += `<div id="imagemID" class="imagem1">
                                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                                        <img src="${item}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';">
                                                    </div>`

                                num++
                            })


                            has = true;
                        }

                    }

                    if (!has) {
                        anuncioContainer.style.backgroundColor = 'white'
                        anuncioContainer.innerHTML += `<div class="sem_anuncios">Você ainda não possui anúncios, que tal criar o primeiro?</div>`
    
                        console.log("Este usuário ainda não criou nenhum projeto")
                    }
                })

                project_executed = true
            }
        });
    }

    function remove_project(id, email, password) {
        const project = firebase.database().ref("Projetos").child(id)

        let validation = user_database.validate(email, password)

        if (validation.userID == project.val().ownerID) {
            project.remove()
                .then(function () {
                    console.log("Projeto removido com sucesso!")
                })
                .catch(function (erro) {
                    console.log("Um erro ocorreu ao tentar excluir o projeto: ", erro)
                })
        } else {
            console.log("Você não tem permissão para efetuar a exclusão!")
        }
    }

    project_database.new = new_project;
    project_database.getAll = get_all_projects;
    project_database.getAllOfUser = get_all_project_user;
    project_database.remove = remove_project;
})()