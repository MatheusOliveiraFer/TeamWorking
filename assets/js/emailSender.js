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

    emailSend.password = passwordRecover
    emailSend.init = init
})()