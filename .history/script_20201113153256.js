/*
    TODO:
        validate inputs
            phone number
            duration
            baseline percentage
            url

        clean information and store in JSON format
        post that information to a database
*/
function jsonifyData(event)
{
    event.preventDefault();
    var phonenumber = document.getElementById('phonenumber').value;
    var product_name = document.getElementById('product_name').value;
    var url = document.getElementById('url').value;
    var percentage = document.getElementById('percentage').value;
    var duration = document.getElementById('duration').value;

    if(validateURL(url) == null)
    {
        $('#form-status').html("INVALID URL");
        var popup = document.getElementById("popup");
        popup.classList.toggle("show");
        return;
    }  
    if(validatePhonenumber(phonenumber) == null)
    {
        $('#form-status').html("INVALID PHONENUMBER");
        var popup = document.getElementById("popup");
        popup.classList.toggle("show");
        return;
    }  


    var data = {
        "phonenumber": validatePhonenumber(phonenumber),
        "url": validateURL(url),
        "percentage": cleanPercentage(percentage),
        "duration": cleanDuration(duration)
    }

    var query = 'url=' + url + '&phonenumber=' + validatePhonenumber(phonenumber) + '&duration=' + duration + '&baseline_percentage=' + percentage + '&name=' + product_name.replaceAll(' ', '-');
    var http = new XMLHttpRequest();
    //'https://pricescrapertester.azurewebsites.net/api/SQLFormCompleter?'   'http://localhost:7071/api/SQLFormCompleter'
    var url = 'https://pricescraper.azurewebsites.net/api/SQLFormInputter?';
    var params = query;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/multipart/form-data');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(params);
    console.log(url+query);
    console.log(query);

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(data, textStatus, jqXHR)
        {
            console.log("success");
        },
      });
    $('#popup').html("SUCCESS");  
    
    console.log(data);
}


function validatePhonenumber(phonenumber)
{
    var numberType = typeof phonenumber;
    var regExp = /[a-zA-Z]/g; //any letters
            
    if( numberType != "number")
    {
        var noHyphens = phonenumber.replaceAll('-', '');
        console.log(noHyphens + ", length: " + noHyphens.length);
        if((noHyphens).length != 10 || (regExp.test(phonenumber)))
            return null;

        return noHyphens
    }

    
    return phonenumber;
    
    
}

function cleanDuration(duration)
{
    console.log("dur peeps");
    const currentDate = new Date();
    var stopDate = new Date();

    stopDate.setDate(currentDate.getDay() + duration);
    
    return duration;
}


function cleanPercentage(percentage)
{
    if(percentage > 100)
        percentage = percentage % 100;

    return percentage;
}


function validateURL(url)
{
    var request = new XMLHttpRequest();  
    request.open('GET', url, true);
    request.onreadystatechange = function()
    {
        if (request.readyState === 4)
        {
            if (request.status === 404) 
            {  
                return null;
            }  
        }
    };
    
    return url;
}

