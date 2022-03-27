const cookieAccess = {};

(function(){
    function valor_cookie(nome_cookie) {
        // Adiciona o sinal de = na frente do nome do cookie
        var cname = ' ' + nome_cookie + '=';
        
        // Obtém todos os cookies do documento
        var cookies = document.cookie;
        
        // Verifica se seu cookie existe
        if (cookies.indexOf(cname) == -1) {
            return false;
        }
        
        // Remove a parte que não interessa dos cookies
        cookies = cookies.substr(cookies.indexOf(cname), cookies.length);
    
        // Obtém o valor do cookie até o ;
        if (cookies.indexOf(';') != -1) {
            cookies = cookies.substr(0, cookies.indexOf(';'));
        }
        
        // Remove o nome do cookie e o sinal de =
        cookies = cookies.split('=')[1];
        
        // Retorna apenas o valor do cookie
        return decodeURI(cookies);
    }

    cookieAccess.valor = valor_cookie;
})()
