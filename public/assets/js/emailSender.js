const emailSend = {};

(function(){
    function passwordRecover(email,code,username,page){
        var emailParams = {
            username: username,
            to_name: email,
            message: code
        }

        emailjs.send('service_r8w9thr','template_r74fyyr',emailParams).then(function(){
            console.log("Email com código enviado")

            if(page.includes('confirmacao')){
                window.location.href = `${page}/?email=${email}&button=enable`
            }else{
                window.location.href = `${page}/?email=${email}`
            }
        }).catch(function(){
            console.log("Email com código não enviado")
        })
    }

    function notification(email, senderName, content, projectName){

        var emailParams = {
            senderName: senderName,
            to_email: email,
            content: content,
            projectName: projectName
        }

        emailjs.send('service_r8w9thr','template_dnedfi8',emailParams).then(function(){
            console.log("Notificação enviada")

            document.location.reload()
        }).catch(function(){
            console.log("Notificação não enviada")

            document.location.reload()
        })

    }

    emailSend.password = passwordRecover
    emailSend.notification = notification
})()