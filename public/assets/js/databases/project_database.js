const project_database = {};

(function () {
    function new_project(title, ownerID, smallDescription, fullDescription, type, linkVideo, valor, imageArray) {
        const project = firebase.database().ref("Projetos")
        const loading = document.getElementById('loading-button')
        const saveButton = document.getElementById('save')
        const errorElement = document.getElementById('errorElement')

        storage_id = Date.now() + title.replace(' ', '_') + ownerID
        const upload = firebase.storage().ref(`Project images/${storage_id}/`)

        let project_data = {
            titulo: title.replace("'", "´").replace('"', "´"),
            IDdono: ownerID,
            descricaoPequena: smallDescription,
            descricaoCompleta: fullDescription,
            imagens: [],
            tipo: type,
            linkVideo: linkVideo,
            valor: valor ? parseFloat(valor) : '',
            IDArmazenamento: storage_id,
            dataCriacao: Date.now()
        }

        let num = 0 //*NÚMERO DE ITENS DO keyArray PERCORRIDOS
        let count = 0 //*NÚMERO DE IMAGENS UPADAS COM SUCESSO
        let error = 0 //*CONTADOR DE ERROS, NO FINAL EXISTE UMA VERIFICAÇÃO PARA REMOVER TODAS AS IMAGENS ENVIADOS CASO HOUVER ALGUM ERRO
        let arrayLinks = [] //*ARRAY QUE GUARDA OS LINKS GERADOS PELO PRÓPRIO FIREBASE PARA CADA IMAGEM PARA PODER ENVIAR JUNTO NO JSON
        let arrayImageNames = [] //*ARRAY QUE GUARDA O imagemName DAS IMAGENS PARA PODER DELETAR TODAS AS ENVIADOS CASO DER ERRO EM ALGUMA
        imageArray.forEach(item => {
            let imageName = `${ownerID}_${num}`
            arrayImageNames.push(imageName)

            var imageFile = item

            upload.child(imageName).put(imageFile).then(function (a) {
                idURL = a.metadata.contentDisposition.lastIndexOf(userID)
                idURL = a.metadata.contentDisposition.substring(idURL)

                upload.child(idURL).getDownloadURL().then(function (url_imagem) {
                    arrayLinks.push(url_imagem)

                    count++
                })
                .catch(function() {
                    error++
                    console.log('Erro ao tentar gerar link de imagem')
                })
            })
            .catch(function() {
                error++
                console.log('Erro ao tentar upar imagem')
            })

            num++
        })

        function check() {
            if (error == 0) {
                if (num == count) {
                    project_data.imagens = arrayLinks

                    project.push(project_data)
                        .then(function() {
                            console.log("Projeto criado com sucesso!")
                            document.location.replace('/meusanuncios/index.html')
                        })
                        .catch(function() {
                            console.log("Um erro ocorreu ao tentar criar o projeto")

                            loading.style.display = 'none'
                            saveButton.style.display = 'inline'
                            errorElement.innerText = 'Erro interno, por favor tente novamente!'

                            error++
                            check()
                        })
                } else {
                    setTimeout(function() {
                        check();
                    }, 1000);
                }
            } else {
                console.log('Ocorreu um erro ao tentar upar uma imagem')

                loading.style.display = 'none'
                saveButton.style.display = 'inline'
                errorElement.innerText = 'Erro interno, por favor tente novamente!'

                arrayImageNames.forEach(item => {
                    upload.child(item).delete()
                })
            }
        }

        check()
    }

    function get_all_projects() {
        const project = firebase.database().ref("Projetos")

        const anuncioContainer = document.getElementById('anuncioContainer')
        const anuncioLoading = document.getElementById('anuncioLoading')

        let project_executed = false
        let has = false

        project.on('value', (snapshot) => {
            if (!project_executed) {

                let firebaseProjects = snapshot.val();
                let get_projects = []

                //*TRANSFORMANDO O OBJETO QUE VEIO DO FIREBASE EM MAPA
                for(let index in firebaseProjects){
                    let item = firebaseProjects[index]
                    item.id = index

                    get_projects.push(item)
                }

                //* ORDENANDO OS PROJETOS DO MAIS NOVO PRO MAIS ANTIGO
                get_projects = get_projects.sort((a,b) => {return b.dataCriacao > a.dataCriacao ? 1 : -1})

                for (let index in get_projects) {
                    let gp = get_projects[index].id

                    const user = firebase.database().ref("Usuarios").child(get_projects[index].IDdono)

                    user.on('value', (snapshot) => {
                        ownerData = snapshot.val()

                        if (get_projects[index] && ownerData) {
                            has = true
                            anuncioContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.76)'

                            if (document.getElementById('text_sem_anuncio')) {
                                document.getElementById('text_sem_anuncio').remove()
                            }

                            var type = ''

                            switch (get_projects[index].tipo) {
                                case '1': type = 'Compra e venda de empresas e negócios'; break;
                                case '2': type = 'Formação de Startups, projetos e vagas de emprego'; break;
                                case '3': type = 'Oportunidade de investimento, sociedade e parceria'; break;
                            }

                            let descricaoPequenaResumida = get_projects[index].descricaoPequena

                            if (get_projects[index].descricaoPequena.length > 140) {
                                descricaoPequenaResumida = `${get_projects[index].descricaoPequena.substring(0, 140)}...`
                            }
                            anuncioContainer.innerHTML += anuncios_item(get_projects[index].titulo, descricaoPequenaResumida, type, ownerData.nome, ownerData.cidade, ownerData.uf, get_projects[index].valor, gp)

                            const lista = document.getElementById(`lista-imagem_${gp}`)

                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                lista.style.width = '100%'
                            } else {
                                lista.style.width = '50%'
                            }

                            //*ADIÇÃO DE VÍDEO
                            if (get_projects[index].linkVideo) {
                                lista.innerHTML += `<div class="video-box">
                                                            <img class="play-button" src="/assets/images/play.png" onclick='window.open("${get_projects[index].linkVideo}")'
                                                        </div>`
                            }

                            //*ADIÇÃO DE IMAGENS

                            if (get_projects[index].imagens) {

                                var photosNum = 0

                                if (get_projects[index].imagens[0] && get_projects[index].imagens[0].lastIndexOf('deleted') == -1) {
                                    imageID = `imagem_${gp}_0`

                                    lista.innerHTML += `<div class="imagem1">
                                            <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                            <img src="${get_projects[index].imagens[0]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[0]}')">
                                        </div>`

                                    photosNum++
                                }
                                if (get_projects[index].imagens[1] && get_projects[index].imagens[1].lastIndexOf('deleted') == -1) {
                                    imageID = `image_${gp}_1`

                                    lista.innerHTML += `<div class="imagem1">
                                            <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                            <img src="${get_projects[index].imagens[1]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[1]}')">
                                        </div>`

                                    photosNum++
                                }
                                if (get_projects[index].imagens[2] && get_projects[index].imagens[2].lastIndexOf('deleted') == -1 && photosNum < 2) {
                                    imageID = `image_${gp}_2`

                                    lista.innerHTML += `<div class="imagem1">
                                            <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                            <img src="${get_projects[index].imagens[2]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[2]}')">
                                        </div>`

                                    photosNum++
                                }
                                if (get_projects[index].imagens[3] && get_projects[index].imagens[3].lastIndexOf('deleted') == -1 && photosNum < 2) {
                                    imageID = `image_${gp}_3`

                                    lista.innerHTML += `<div class="imagem1">
                                            <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                            <img src="${get_projects[index].imagens[3]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[3]}')">
                                        </div>`

                                    photosNum++
                                }
                            } else {
                                lista.innerHTML += `<div class="imagem1">
                                            <img src="/assets/images/Loading.gif" id="image_${gp}_loading" class="image_of_loading"/>
                                            <img src="/assets/images/semImagem.png" id="image_${gp}" class="image_of_project" onload="document.getElementById('image_${gp}_loading').style.display = 'none'; document.getElementById('image_${gp}').style.display = 'flex';">
                                        </div>`
                            }
                        }

                        anuncioLoading.remove()

                    })
                }

                if (!has) {
                    anuncioContainer.style.backgroundColor = 'white'
                    anuncioContainer.innerHTML += `<div id="text_sem_anuncio" class="sem_anuncios">Ainda não existe nenhum anúncio para você!</div>`

                    anuncioLoading.remove()

                    console.log("Ainda não existe nenhum anúncio, que tal criar o primeiro?")
                }

                project_executed = true
            }
        });
    }

    function get_all_project_user() {
        const userID = cookieAccess.valor('userID')

        const project = firebase.database().ref("Projetos")
        const user = firebase.database().ref("Usuarios").child(userID)

        const anuncioContainer = document.getElementById('anuncioContainer')
        const anuncioLoading = document.getElementById('anuncioLoading')

        let project_executed = false
        let has = false;

        project.on('value', (snapshot) => {
            if (!project_executed) {

                let firebaseProjects = snapshot.val();
                let get_projects = []

                //*TRANSFORMANDO O OBJETO QUE VEIO DO FIREBASE EM MAPA
                for(let index in firebaseProjects){
                    let item = firebaseProjects[index]
                    item.id = index

                    get_projects.push(item)
                }

                //* ORDENANDO OS PROJETOS DO MAIS NOVO PRO MAIS ANTIGO
                get_projects = get_projects.sort((a,b) => {return b.dataCriacao > a.dataCriacao ? 1 : -1})


                user.on('value', (snapshot) => {
                    ownerData = snapshot.val()

                    for (let index in get_projects) {
                        let gp = get_projects[index].id

                        if (get_projects[index].IDdono == userID && ownerData) {

                            var type = ''

                            switch (get_projects[index].tipo) {
                                case '1': type = 'Compra e venda de empresas e negócios'; break;
                                case '2': type = 'Formação de Startups, projetos e vagas de emprego'; break;
                                case '3': type = 'Oportunidade de investimento, sociedade e parceria'; break;
                            }

                            let descricaoPequenaResumida = get_projects[index].descricaoPequena

                            if (get_projects[index].descricaoPequena.length > 140) {
                                descricaoPequenaResumida = `${get_projects[index].descricaoPequena.substring(0, 140)}...`
                            }

                            anuncioContainer.innerHTML += meusAnuncios_item(get_projects[index].titulo, descricaoPequenaResumida, type, ownerData.nome, ownerData.cidade, ownerData.uf, get_projects[index].valor, gp)

                            const lista = document.getElementById(`lista-imagem_${gp}`)

                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                lista.style.width = '100%'
                            } else {
                                lista.style.width = '50%'
                            }

                            //*ADIÇÃO DE VÍDEO
                            if (get_projects[index].linkVideo) {
                                lista.innerHTML += `<div class="video-box">
                                                        <img class="play-button" src="/assets/images/play.png" onclick='window.open("${get_projects[index].linkVideo}")'
                                                    </div>`
                            }

                            //*ADIÇÃO DE IMAGENS
                            if (get_projects[index].imagens) {

                                var photosNum = 0

                                if (get_projects[index].imagens[0] && get_projects[index].imagens[0].lastIndexOf('deleted') == -1) {
                                    imageID = `imagem_${gp}_0`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${get_projects[index].imagens[0]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[0]}')">
                                    </div>`

                                    photosNum++
                                }
                                if (get_projects[index].imagens[1] && get_projects[index].imagens[1].lastIndexOf('deleted') == -1) {
                                    imageID = `image_${gp}_1`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${get_projects[index].imagens[1]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[1]}')">
                                    </div>`

                                    photosNum++
                                }
                                if (get_projects[index].imagens[2] && get_projects[index].imagens[2].lastIndexOf('deleted') == -1 && photosNum < 2) {
                                    imageID = `image_${gp}_2`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${get_projects[index].imagens[2]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[2]}')">
                                    </div>`

                                    photosNum++
                                }
                                if (get_projects[index].imagens[3] && get_projects[index].imagens[3].lastIndexOf('deleted') == -1 && photosNum < 2) {
                                    imageID = `image_${gp}_3`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${get_projects[index].imagens[3]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${get_projects[index].imagens[3]}')">
                                    </div>`

                                    photosNum++
                                }
                            } else {
                                lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="image_${gp}_loading" class="image_of_loading"/>
                                        <img src="/assets/images/semImagem.png" id="image_${gp}" class="image_of_project" onload="document.getElementById('image_${gp}_loading').style.display = 'none'; document.getElementById('image_${gp}').style.display = 'flex';">
                                    </div>`
                            }

                            anuncioLoading.remove()

                            has = true;
                        }
                    }

                    if (!has) {
                        anuncioContainer.style.backgroundColor = 'white'
                        anuncioContainer.innerHTML += `<div class="sem_anuncios">Você ainda não possui anúncios, anuncie agora.</div>`

                        anuncioLoading.remove()

                        console.log("Este usuário ainda não criou nenhum projeto")
                    }
                })

                project_executed = true
            }
        });
    }

    function get_project(projectID) {
        const userID = cookieAccess.valor('userID')

        const project = firebase.database().ref("Projetos").child(projectID)

        let project_executed = false

        project.on('value', (snapshot) => {
            if (!project_executed) {
                projectInfo = snapshot.val()

                if (projectInfo) {
                    if (projectInfo.IDdono == userID) {
                        document.getElementById('projectEditor').style.display = 'inline'
                        document.getElementById('type').value = projectInfo.tipo
                        document.getElementById('title').value = projectInfo.titulo
                        document.getElementById('smallDescription').value = projectInfo.descricaoPequena
                        document.getElementById('fullDescription').value = projectInfo.descricaoCompleta
                        document.getElementById('value').value = projectInfo.valor
                        document.getElementById('videoAnuncio').value = projectInfo.linkVideo

                        let index = 0

                        if (projectInfo.imagens) {
                            projectInfo.imagens.forEach(item => {
                                var image_path = item.lastIndexOf(userID)
                                image_path = item.substring(image_path)
                                image_path = image_path.split('?')
                                image_path = image_path[0]

                                images_array.push({ fileName: image_path, url: item })

                                let image_slot = document.getElementById(`image_box_${index}`)

                                image_slot.innerHTML = `<div>
                                                            <img id="image-${index}-trash" class="trash" src="/assets/images/lixeira.png"/>
                                                            <img id="image-${index}" 
                                                                alt="SemImagem"
                                                                class="image_anuncio" 
                                                                onerror="caseNotImage(${index})"
                                                                src="${item}" 
                                                                onclick="removeImage(this.id)" 
                                                                onload="document.getElementById('image-${index}-loading').style.display = 'none'; document.getElementById('image-${index}').style.display = 'flex';" 
                                                                onmouseover="document.getElementById('image-${index}-trash').style.display = 'flex';" 
                                                                onmouseout="document.getElementById('image-${index}-trash').style.display = 'none';"/>
                                                            
                                                            <img id="image-${index}-loading" class="image_loading_box"/>
                                                        </div>`
                                index++
                            })
                        }
                    }
                } else {
                    document.location.replace('/meusanuncios/index.html')
                }

                project_executed = true
            }
        })
    }

    function remove_project(projectID) {
        const userID = cookieAccess.valor('userID')

        const project = firebase.database().ref("Projetos").child(projectID)

        let project_executed = false
        project.on('value', (snapshot) => {
            if (!project_executed) {
                const projectInfo = snapshot.val()

                if (projectInfo && userID == projectInfo.IDdono) {
                    project.remove().then(function () {
                        const comments = firebase.database().ref("Comentarios")

                        let num = 0 //*NÚMERO DE COMENTÁRIOS SELECIONADOS PARA EXCLUSÃO
                        let count = 0 //*NÚMERO DE COMENTÁRIOS EXCLUÍDOS

                        let comment_executed = false

                        comments.on('value', (snapshot2) => {
                            if (!comment_executed) {
                                const commentInfo = snapshot2.val()

                                for (c in commentInfo) {
                                    if (commentInfo[c].projetoID == projectID) {
                                        const comment = firebase.database().ref("Comentarios").child(c)
                                        num++

                                        comment.remove().then(function() {
                                            console.log("Comentário excluído")
                                            count++
                                        }).catch(function() {
                                            console.log("Ocorreu um erro ao tentar excluir a resposta")
                                            count++
                                        })
                                    }
                                }

                                function check() {
                                    if (num == count) {
                                        const imageStorage = firebase.storage().ref(`Project images/${projectInfo.IDArmazenamento}/`)

                                        let deletes = 0

                                        imageStorage.child(`${projectInfo.IDdono}_0`).delete().then(function () { deletes++ }).catch(function () { deletes++ })
                                        imageStorage.child(`${projectInfo.IDdono}_1`).delete().then(function () { deletes++ }).catch(function () { deletes++ })
                                        imageStorage.child(`${projectInfo.IDdono}_2`).delete().then(function () { deletes++ }).catch(function () { deletes++ })
                                        imageStorage.child(`${projectInfo.IDdono}_3`).delete().then(function () { deletes++ }).catch(function () { deletes++ })

                                        function deleteCompleted() {
                                            if (deletes == 4) {
                                                document.location.reload()
                                            } else {
                                                setTimeout(function () {
                                                    deleteCompleted()
                                                }, 250)
                                            }
                                        }

                                        deleteCompleted()
                                    } else {
                                        setTimeout(function () {
                                            check()
                                        }, 500)
                                    }
                                }

                                check()

                                comment_executed = true
                            }
                        })
                    })
                }

                project_executed = true
            }
        })
    }

    function update_project(projectID, type, title, smallDescription, fullDescription, value, video, imageArray, deletedIndexes) {
        const userID = cookieAccess.valor('userID')

        const project = firebase.database().ref("Projetos").child(projectID)
        const user = firebase.database().ref("Usuarios").child(userID)
        const errorElement = document.getElementById('errorElement')
        var user_executed = false
        var project_executed = false

        user.on('value', (snapshot) => {
            if (!user_executed) {
                var userInfo = snapshot.val()

                project.on('value', (snapshot2) => {
                    if (!project_executed) {
                        var projectInfo = snapshot2.val()

                        if (projectInfo && userInfo && projectInfo.IDdono == userID) {
                            const upload = firebase.storage().ref(`Project images/${projectInfo.IDArmazenamento}/`)

                            let image_executed = 0
                            let imgNum = 0
                            projectInfo.imagens = []

                            imageArray.forEach(img => {
                                if (img.url && img.fileName) {
                                    projectInfo.imagens.push(img.url)

                                    image_executed++
                                    imgNum++
                                } else {
                                    upload.child(`${userID}_${imgNum}`).put(img).then(function (a) {
                                        idURL = a.metadata.contentDisposition.lastIndexOf(userID)
                                        idURL = a.metadata.contentDisposition.substring(idURL)

                                        upload.child(idURL).getDownloadURL().then(function (url_imagem) {
                                            projectInfo.imagens.push(url_imagem)

                                            image_executed++
                                        })
                                    }).catch(function() {
                                        projectInfo.imagens.push('')
                                        image_executed++

                                        console.log('Erro ao tentar upar imagem')
                                    })
                                    imgNum++
                                }
                            })


                            function finalUpload() {

                                if (image_executed == imageArray.length) {
                                    projectInfo.imagens = projectInfo.imagens.sort()

                                    deletedIndexes.forEach(i => {
                                        projectInfo.imagens[i] = `${projectInfo.imagens[i].split('?')[0]}_deleted`
                                    })

                                    projectInfo.tipo = type
                                    projectInfo.titulo = title.replace("'", "´").replace('"', "´"),
                                    projectInfo.descricaoPequena = smallDescription
                                    projectInfo.descricaoCompleta = fullDescription
                                    projectInfo.valor = value ? parseFloat(value) : ''
                                    projectInfo.linkVideo = video

                                    project.update(projectInfo).then(function() {
                                        document.location.replace('/meusanuncios/index.html')

                                        console.log('Projeto atualizado com sucesso!')

                                        project_executed = true
                                    })
                                        .catch(function() {
                                            errorElement.innerText('Erro interno, por favor tente novamente!')

                                            console.log('Ocorreu um erro ao tentar atualizar o anuncio')

                                            project_executed = true
                                        })

                                } else {
                                    setTimeout(function () {
                                        finalUpload()
                                    }, 250)
                                }
                            }

                            finalUpload()
                        }

                        project_executed = true
                    }
                })
                user_executed = true
            }
        })
    }

    function get_project_details(projectID) {
        const userID = cookieAccess.valor('userID')

        const project = firebase.database().ref("Projetos").child(projectID)

        let project_executed = false
        let user_executed = false

        project.on('value', (snapshot) => {
            if (!project_executed) {
                let projectInfo = snapshot.val()

                if (projectInfo) {
                    const user = firebase.database().ref("Usuarios").child(projectInfo.IDdono)
                    const comments = firebase.database().ref("Comentarios")

                    user.on('value', (snapshot2) => {
                        if (!user_executed) {
                            ownerData = snapshot2.val()

                            let type = ''

                            switch (projectInfo.tipo) {
                                case '1': type = 'Compra e venda de empresas e negócios'; break;
                                case '2': type = 'Formação de Startups, projetos e vagas de emprego'; break;
                                case '3': type = 'Oportunidade de investimento, sociedade e parceria'; break;
                            }

                            document.getElementById('title').innerText = projectInfo.titulo
                            document.getElementById('smallDescription').innerText = projectInfo.descricaoPequena
                            document.getElementById('fullDescription').innerText = projectInfo.descricaoCompleta
                            document.getElementById('type').innerText = type
                            document.getElementById('ownerName').innerText = ownerData.nome
                            document.getElementById('ownerAddress').innerText = `${ownerData.cidade} - ${ownerData.uf}`

                            if (projectInfo.valor) {
                                document.getElementById('value').innerText = `R$${projectInfo.valor.toFixed(2).toString().replace('.', ',')}`
                            } else {
                                document.getElementById('value-label').style.display = 'none'
                            }

                            let lista = document.getElementById('image-list')

                            //*ADIÇÃO DE VÍDEO
                            if (projectInfo.linkVideo) {
                                lista.innerHTML += `<div class="video-box">
                                                        <img class="play-button" src="/assets/images/play.png" onclick='window.open("${projectInfo.linkVideo}")'
                                                    </div>`
                            }

                            //*ADIÇÃO DE IMAGENS
                            if (projectInfo.imagens) {
                                if (projectInfo.imagens[0] && projectInfo.imagens[0].lastIndexOf('deleted') == -1) {
                                    imageID = `imagem_${projectID}_0`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${projectInfo.imagens[0]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${projectInfo.imagens[0]}')">
                                    </div>`
                                }
                                if (projectInfo.imagens[1] && projectInfo.imagens[1].lastIndexOf('deleted') == -1) {
                                    imageID = `imagem_${projectID}_1`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${projectInfo.imagens[1]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${projectInfo.imagens[1]}')">
                                    </div>`
                                }
                                if (projectInfo.imagens[2] && projectInfo.imagens[2].lastIndexOf('deleted') == -1) {
                                    imageID = `imagem_${projectID}_2`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${projectInfo.imagens[2]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${projectInfo.imagens[2]}')">
                                    </div>`
                                }
                                if (projectInfo.imagens[3] && projectInfo.imagens[3].lastIndexOf('deleted') == -1) {
                                    imageID = `imagem_${projectID}_3`

                                    lista.innerHTML += `<div class="imagem1">
                                        <img src="/assets/images/Loading.gif" id="${imageID}_loading" class="image_of_loading"/>
                                        <img src="${projectInfo.imagens[3]}" id="${imageID}" class="image_of_project" onload="document.getElementById('${imageID}_loading').style.display = 'none'; document.getElementById('${imageID}').style.display = 'flex';" onclick="open_modal('${projectInfo.imagens[3]}')">
                                    </div>`
                                }
                            }

                            if(lista.innerHTML == ''){
                                lista.innerHTML = `<div class="imagem1">
                                            <img src="/assets/images/Loading.gif" id="image_${projectID}_loading" class="image_of_loading"/>
                                            <img src="/assets/images/semImagem.png" id="image_${projectID}" class="image_of_project" onload="document.getElementById('image_${projectID}_loading').style.display = 'none'; document.getElementById('image_${projectID}').style.display = 'flex';">
                                        </div>`
                            }

                            let comment_executed = false

                            comments.on('value', (snapshot3) => {
                                if (!comment_executed) {
                                    const comments_container = document.getElementById('comentarios-container')
                                    comments_container.innerHTML = ''

                                    let commentInfo = snapshot3.val()

                                    if (commentInfo) {
                                        for (gc in commentInfo) {
                                            if (commentInfo[gc].projetoID == projectID && !commentInfo[gc].respostaDe) {
                                                comments_container.innerHTML += `<div class="comentarios">
                                                                                        <img class="ft-detalhe" src="${commentInfo[gc].usuarioImagem}">
                                                                                        <div class="cont-comentario-detalhe">
                                                                                            <div id="text-comentario-${gc}" class="text-comentario" style="display:flex;justify-content:space-between">
                                                                                                ${commentInfo[gc].conteudo}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>`

                                                if (projectInfo.IDdono == userID && userID != commentInfo[gc].usuarioID) {
                                                    comments_container.innerHTML += `<div class="responder" id="responder_${gc}">
                                                                                            <div id="no_answer_box_${gc}" class="no_answer_box">
                                                                                                <div id="see_answers_${gc}" class="see_answers" onclick="see_answers('${gc}')" style="display: none">▶ Ver respostas</div>
                                                                                                <div id="resp_${gc}" class="responder-button" onclick="document.getElementById('resp_${gc}').style.display = 'none';document.getElementById('input_resp_${gc}').style.display = 'flex';document.getElementById('buttons_resp_${gc}').style.display = 'flex'; document.getElementById('input_resp_${gc}').focus()">Responder</div>
                                                                                            </div>
        
                                                                                            <div id="answers_box_${gc}" class="answers_box"></div>
                                                                                            <input id="input_resp_${gc}" type="text" class="text-comentar" style="display: none"/>
        
                                                                                            <div id="buttons_resp_${gc}" class="resp-buttons-container" style="display: none">
                                                                                                <div id="button_answer_${gc}" class="enviar-comentario" onclick="send_answer('${gc}')">▶</div>
                                                                                                <div id="loading-button-${gc}" class="loading-button">
                                                                                                    <img src="../assets/images/Loading.gif" class="loading"/>
                                                                                                </div>
        
                                                                                                <div class="enviar-comentario" style="background-color: red" onclick="document.getElementById('resp_${gc}').style.display = 'flex';document.getElementById('input_resp_${gc}').style.display = 'none';document.getElementById('buttons_resp_${gc}').style.display = 'none'">X</div>
                                                                                            </div>
                                                                                        </div>
                                                                                        `
                                                }
                                                if (projectInfo.IDdono != userID) {
                                                    comments_container.innerHTML += `<div class="responder" id="responder_${gc}" style="display: none">
                                                                                            <div id="no_answer_box_${gc}" class="no_answer_box">
                                                                                                <div id="see_answers_${gc}" class="see_answers" onclick="see_answers('${gc}')">▶ Ver respostas</div>
                                                                                            </div>
        
                                                                                            <div id="answers_box_${gc}" class="answers_box"></div>
                                                                                        </div>
                                                                                        `
                                                }

                                                if (document.getElementById(`answers_box_${gc}`)) {
                                                    document.getElementById(`answers_box_${gc}`).innerHTML = ''
                                                }

                                            } else if (commentInfo[gc].projetoID == projectID && commentInfo[gc].respostaDe) {
                                                const answers_box = document.getElementById(`answers_box_${commentInfo[gc].respostaDe}`)

                                                if (document.getElementById(`responder_${commentInfo[gc].respostaDe}`) && document.getElementById(`no_answer_box_${commentInfo[gc].respostaDe}`) && document.getElementById(`see_answers_${commentInfo[gc].respostaDe}`)) {
                                                    document.getElementById(`responder_${commentInfo[gc].respostaDe}`).style.display = 'flex'
                                                    document.getElementById(`responder_${commentInfo[gc].respostaDe}`).style.opacity = '1'
                                                    document.getElementById(`no_answer_box_${commentInfo[gc].respostaDe}`).style.display = 'flex'
                                                    document.getElementById(`no_answer_box_${commentInfo[gc].respostaDe}`).style.justifyContent = 'space-between'
                                                    document.getElementById(`see_answers_${commentInfo[gc].respostaDe}`).style.display = 'flex'
                                                }

                                                if (answers_box) {
                                                    answers_box.innerHTML += `<div class="comentarios" style="width:100%">
                                                                                    <img class="ft-detalhe" src="${commentInfo[gc].usuarioImagem}">
                                                                                    <div class="cont-comentario-detalhe">
                                                                                        <div id="text-comentario-${gc}" class="text-comentario" style="display:flex;justify-content:space-between">
                                                                                            ${commentInfo[gc].conteudo}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>`
                                                }

                                            }

                                            if (document.getElementById(`text-comentario-${gc}`) && commentInfo[gc].usuarioID == userID) {
                                                document.getElementById(`text-comentario-${gc}`).innerHTML += `<div class="remove-comentario" onclick="removeComment('${gc}')"></div>`
                                            }
                                        }
                                    }

                                    comment_executed = true
                                }
                            })
                            user_executed = true
                        }
                    })
                    project_executed = true
                } else {
                    document.location.replace('/cadastro/Home.html')
                }
            }
        })
    }

    project_database.new = new_project;
    project_database.getAll = get_all_projects;
    project_database.getAllOfUser = get_all_project_user;
    project_database.getProject = get_project;
    project_database.remove = remove_project;
    project_database.update = update_project;
    project_database.getProjectDetails = get_project_details;
})()