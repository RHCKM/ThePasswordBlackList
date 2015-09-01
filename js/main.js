/*
* Author: Robert Hunter
* Assignment: WI2.0 Mobile Development, Digital Skills Academy
* Date : 2015/07/15
* Ref: 
    https://api.jquery.com/
    http://jquerymobile.com/
    http://devdocs.io/javascript/
    http://tutorialzine.com/2011/09/shuffle-letters-effect-jquery/
    https://themeroller.jquerymobile.com/
    http://stackoverflow.com/questions/tagged/jquery-mobile
    http://realfavicongenerator.net/
    http://www.initializr.com/
*/
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
           // console.log('Number Of Passwords: ' + passwordKeys.length);
            App.passwordData = data['passwords'];
            var passwordsHtml = [];

            $.each(passwordKeys,function(i,val){
                var passVal = val.replace(/\s+/g, '');
                var href = "#infoPage?password=" + passVal;
                passwordsHtml.push("<li data-theme='a' class='passwordItem' data-icon='lock'><a href='" + href + "'>" + passVal + "</a></li>");
            });

            $("#listCustom").append(passwordsHtml).listview('refresh');
            callback();
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

    /*console.log(password);
    console.log(passwordInfo);
    console.log(pageSelector);*/

    var passText = '<span id="pass"><strong>Passed...</strong></span> Utilises ';
    var failText = '<span id="fail"><strong>Failed...</strong></span> Does not contain ';

    var lowercaseText = 'a Lowercase character';
    var uppercaseText = 'a Uppercase character';
    var numbersText   = 'a Numeric character';
    var symbolsText   = 'a Symbolic character';
    var lengthText   = ' the minimum recommended password length';

    var passIcon = '<a class="ui-nodisc-icon ui-btn ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-b ui-btn-inline"></a>';
    var failIcon = '<a class="ui-nodisc-icon ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline"></a>';

    var introDescTemp = "This password came in at <strong>  [[rank]] </strong> on the list of the <strong>100 Most Common Passwords</strong>. It failed <span id='fail'><strong> [[failRate]]</strong></span> of the basic strength test checks";
    if(passwordInfo){

       var $page = $(pageSelector); 

       $('#shuffleInfoText').text(password);

       // update intro desc with password rank and # of tests passed
        var introDesc = introDescTemp.replace("[[rank]]","#" + passwordInfo['Rank']);
        introDesc = introDesc.replace("[[failRate]]", passwordInfo['NumberOfFailedTests']);
       $('#testIntroDesc').html(introDesc);

        // Method to populate html with result of password tests
       function populateResultHtml (selector, message, testKey) {
            
            var passedTest = passwordInfo[testKey];
            var icon = passedTest ? passIcon : failIcon;
            var messageText = passedTest ? passText : failText;
            messageText += message;
            var newHTML = icon + messageText;

            $(selector).html(newHTML);
       }

       // Populate password test results html
       populateResultHtml('.lowercaseTest',lowercaseText,'PassedLowercaseTest');
       populateResultHtml('.uppercaseTest',uppercaseText,'PassedUpperCaseTest');
       populateResultHtml('.numberTest',numbersText,'PassedNumbersTest');
       populateResultHtml('.symbolsTest',symbolsText,'PassedSymbolsTest');
       populateResultHtml('.lengthTest',lengthText,'PassedLengthTest');

       $page.page();

       options.dataUrl = urlObj.href;

       options.transition = 'slide';

       $.mobile.changePage( $page, options );
    }
}

