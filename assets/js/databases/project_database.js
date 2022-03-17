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
        const anuncioContainer = document.getElementById('anuncioContainer')

        let project_executed = false
        let has = false;

        project.on('value', (snapshot) => {
            if (!project_executed) {
                const get_projects = snapshot.val();

                for (let gp in get_projects) {
                    if (get_projects[gp].IDdono == userID) {
                        console.log(get_projects[gp]);
                        has = true;

                        anuncioContainer.innerHTML += `
                        <div class="anuncio">
                            <div class="txt-inicial">
                                ${get_projects[gp].titulo}
                            </div>
                            <div class="subtitulo">
                                ${get_projects[gp].descricaoPequena}
                            </div>
                            <div class="lista-imagem">
                                <div class="imagem1"></div>
                                <div class="imagem2"></div>
                                <div class="imagem3"></div>
                            </div>
                            <div class="tipo-txt">
                                <div class="tipo">Tipo:</div>
                                <div class="txt-info">${get_projects[gp].buscando}</div>
                            </div>
                            <div class="dados-publi">
                                <div class="info-dados">
                                    <div class="info-criador">
                                        <div class="info-proposta">
                                            Criador da proposta:
                                        </div>
                                        <div>
                                            Ricardo Vasconcelos Bitteti
                                        </div>
                                    </div>
                                    <div class="info-loc">
                                        <div class="info-cidade">
                                            Cidade de atuação da proposta:
                                        </div>
                                        <div class="loc-criador">
                                            Rio de Janeiro - RJ
                                        </div>
                                    </div>
                                </div>
                                <div class="valor-dados">
                                    <div class="info-valor">Valor</div>
                                    <div class="valor">R$ ${get_projects[gp].valor.toFixed(2).toString().replace('.',',')}</div>
                                </div>
                            </div>
                        </div>`
                    }
                }

                if (!has) {
                    console.log("Este usuário ainda não criou nenhum projeto")
                }

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