var App = {
    passwordData : null
}

function jsonTask (){
        var jsonSrc = "passwords.json";
        $.getJSON(jsonSrc,function () {
        })
        .done(function(data){
            console.log("Fetch Success");
            var passwordKeys = Object.keys(data['passwords']).sort();
            console.log('Number Of Passwords: ' + passwordKeys.length);
            App.passwordData = data['passwords'];
            var passwordsHtml = [];

            $.each(passwordKeys,function(i,val){
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


$(document).bind( "pagebeforechange", function( eventInfo, data ) {

    if ( typeof data.toPage === "string" ) { //error checking

        var parsedURL = $.mobile.path.parseUrl( data.toPage ),
             urlID = /^#infoPage/;
        if ( parsedURL.hash.search(urlID) !== -1 ) {
            // Ensure our url contains the targeted urlID

            showInfoPage( parsedURL, data.options );

            // tell changePage() we've handled this call
            eventInfo.preventDefault();
        }
    }
});


function showInfoPage ( urlObj, options) 
{

    var password     =   urlObj.hash.replace( /.*password=/, "" );
    var passwordInfo =   App.passwordData[password];
    var pageSelector =   urlObj.hash.replace( /\?.*$/, "" );

    console.log(password);
    console.log(passwordInfo);
    console.log(pageSelector);

    var passText = '<span id="pass"><strong>Passed...</strong></span>';
    var failText = '<span id="fail"><strong>Failed...</strong></span>';

    var lowercaseText = ' The Lowercase character test';
    var uppercaseText = ' The Uppercase character test';
    var numbersText   = ' The Numbers character test';
    var symbolsText   = ' The Symbols character test';
    var lengthText   = ' The password minimum length test';

    var passIcon = '<a class="ui-nodisc-icon ui-btn ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-b ui-btn-inline"></a>';
    var failIcon = '<a class="ui-nodisc-icon ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline"></a>';

    if(passwordInfo){

       var $page = $(pageSelector); 

       $('#shuffleInfoText').text(password);

        // Method to populate html with result of password tests
       function populateResultHtml (selector, message, testKey) {
            
            var passedTest = passwordInfo[testKey];
            var icon = passedTest ? passIcon : failIcon;
            var messageText = passedTest ? passText : failText;
            messageText += message;
            var newHTML = icon + messageText;

            $(selector).html(newHTML);
            console.log('2: ' + newHTML);
       }

       // Populate password test results html
       populateResultHtml('.lowercaseTest',lowercaseText,'PassedLowercaseTest');
       populateResultHtml('.uppercaseTest',uppercaseText,'PassedUpperCaseTest');
       populateResultHtml('.numberTest',numbersText,'PassedNumbersTest');
       populateResultHtml('.symbolsTest',symbolsText,'PassedSymbolsTest');
       populateResultHtml('.lengthTest',lengthText,'PassedLengthTest');

       $page.page();

       options.dataUrl = urlObj.href;

       $.mobile.changePage( $page, options );
    }
    


}