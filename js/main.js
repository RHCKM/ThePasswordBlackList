function jsonTask (){
            console.log('test2');
            var jsonSrc = "passwords.json";
            $.getJSON(jsonSrc,function () {
                console.log("test3");
            })
            .done(function(data){
                console.log("Fetch Success");
                var passwords = Object.keys(data['passwords']).sort();
                console.log('Number Of Passwords: ' + passwords.length);

                var passwordsHtml = [];

                $.each(passwords,function(i,val){
                    var passVal = val.replace(/\s+/g, '');
                    var href = "#infoPage?password=" + passVal;
                    passwordsHtml.push("<li><a href='" + href + "'>" + passVal + "</a></li>");
                });

                $("#listCustom").append(passwordsHtml).listview('refresh');
            })
            .fail(function(){
                console.log('Fetch Fail');
            });
        };
