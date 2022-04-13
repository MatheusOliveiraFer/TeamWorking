const emailSend = {};

(function(){
    function passwordRecover(email,code,username,page){
        var emailParams = {
            username: username,
            to_name: email,
            message: code
        }

        emailjs.send('service_ke3c08o','template_8l3zwgj',emailParams).then(function(res){
            console.log(res)

            window.location.href = `${page}/?email=${email}`
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

        emailjs.send('service_ke3c08o','template_r9eieqb',emailParams).then(function(res){
            console.log(res)
        })
    }

    emailSend.password = passwordRecover
    emailSend.init = init
    emailSend.notification = notification
})()