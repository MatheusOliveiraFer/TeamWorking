const emailSend = {};

(function(){
    function passwordRecover(email,code,username,page){
        var emailParams = {
            username: username,
            to_name: email,
            message: code
        }

        emailjs.send('service_r8w9thr','template_r74fyyr',emailParams).then(function(res){
            console.log(res)

            if(page.includes('confirmacao')){
                window.location.href = `${page}/?email=${email}&button=enable`
            }else{
                window.location.href = `${page}/?email=${email}`
            }
        })
    }
    function init(){
        emailjs.init("DQv9YRXGKty4ghBhV");
    }

    function notification(email, senderName, content, projectName){
        console.log("senderName:",senderName)

        var emailParams = {
            senderName: senderName,
            to_email: email,
            content: content,
            projectName: projectName
        }

        console.log(emailParams)

        // try{
            emailjs.send('service_r8w9thr','template_dnedfi8',emailParams).then(function(res){
                console.log(res)
    
                document.location.reload()
            }).catch(function(){
                console.log(res)
    
                document.location.reload()
            })
        // }catch(e){
        //     console.log(e)
    
        //     document.location.reload()
        // }
    }

    emailSend.password = passwordRecover
    emailSend.init = init
    emailSend.notification = notification
})()