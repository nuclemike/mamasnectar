
    JSONTest = function() {
    var resultDiv = $("#resultDivContainer");
        
        
        // url: "https://docs.google.com/a/www.mamasnectar.com/forms/d/1FAIpQLSeCCI4TI1CVp-6FgzFk4_XRsgUa9cTDVzUK0dg_1U-gHFzkzQ/formResponse",
        
    $.ajax({
        url: "http://docs.google.com/forms/d/e/1FAIpQLSeCCI4TI1CVp-6FgzFk4_XRsgUa9cTDVzUK0dg_1U-gHFzkzQ/formResponse",    
        "Access-Control-Allow-Origin": "http://www.mamasnectar.com",
        "Origin": "http://www.mamasnectar.com",
        type: "POST",
        data: 
          {        
          "entry.1565555327": $("#liquidOrderCustomerName").text(),
          "entry.1619189758":$("#liquidOrderCustomerEmail").text(),
          "entry.904873223":"http://graph.facebook.com/"+$("#liquidOrderCustomerName").attr("fbid")+"/picture?width=800&height=800",
          "entry.1380378158":"http://www.facebook.com/"+$("#liquidOrderCustomerName").attr("fbid")
            }        
        ,                
        dataType: "xml",
        statusCode:{
            0: function(){
                alert('bully');
             },
            200:function(){
                alert('bully');
             }
        }    ,
        success: function (result) {
            switch (result) {
                case true:
                    console.log("success true :" +result);
                    break;
                default:
                    console.log("success true :" +result);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("status: "+xhr.status+" | error: "+thrownError);
        
        }
    });
};
