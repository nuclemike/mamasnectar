function nectarRequest() {
  if (
    $(".orderProductSlip_SIZE.selected").attr("value") == undefined ||
    $("#orderProductSlip_NICOTINE").val() < 0 ||
    $("#orderProductSlip_VG").val() == ""
  ) {
    $("#orderProductSlipTable").addClass("error");

    setTimeout(function () {
      $("#orderProductSlipTable").removeClass("error");
    }, 50);

    return false;
  }

  $("#orderProductSlipPurchase, #orderProductSlipExit").hide();
  $("#orderProductSlip").addClass("sending");

  var requestObj = {
    userid: sessionStorage.getItem("userid"),
    seid: sessionStorage.getItem("seid"),
    qty: $("#orderProductSlip_QTY").val(),
    flavor: $("#orderProductTitle").text(),
    size: $(".orderProductSlip_SIZE.selected").attr("value"),
    nicotine: $("#orderProductSlip_NICOTINE").val(),
    nicType: $(".orderProductSlip_NICTYPE.selected").attr("value"),
    vg: $("#orderProductSlip_VG").val(),
    vaper: $("#orderProductSlip_CUSTOMTEXT").val(),
    usePoints: $("#orderProductSlipRedeemButton").is(":checked"),
  };

  // $.ajax({
  // url: "https://script.google.com/macros/s/AKfycbxUe1Q_qURugb5z39rb_HzTxaL_9vWo2hXofb8GoEFMn1fsj2E/exec",
  // type: "POST",
  // data: requestObj,
  // success: function(response) {
  // orderRequestCb(JSON.parse(response));
  // },
  // error: function(response) {
  // systemMessage(JSON.parse(response), 'red');
  // }

  // })

  $.ajax({
    crossDomain: true,
    url: "https://script.google.com/macros/s/AKfycbxUe1Q_qURugb5z39rb_HzTxaL_9vWo2hXofb8GoEFMn1fsj2E/exec?callback=orderRequestCb",
    type: "GET",
    dataType: "jsonp",
    data: requestObj,
  });
}

function hardwareRequest() {
  var colorSelection = $("#orderProductSlip_COLOR");
  var selectedColor = colorSelection.length ? colorSelection.val() : "";

  var sizeSelection = $("#orderProductSlip_SIZE");
  var selectedSize = sizeSelection.length ? sizeSelection.val() : "";

  $("#orderProductSlipPurchase, #orderProductSlipExit").hide();
  $("#orderProductSlip").addClass("sending");

  var requestObj = {
    userid: sessionStorage.getItem("userid"),
    seid: sessionStorage.getItem("seid"),
    type: window.location.hash.substring(1),
    product:
      $("#orderProductSubtitle").text() + " " + $("#orderProductTitle").text(),
    price: document
      .getElementById("orderProductSlipPrice")
      .innerHTML.substring(1),
    color: selectedColor + selectedSize,
    vaper: sessionStorage.getItem("name"),
    qty: $("#orderProductSlip_QTY").val(),
  };

  $.ajax({
    crossDomain: true,
    url: "https://script.google.com/macros/s/AKfycby3MyYMASGfo0HERY5DM4NN2ZxgKrLfN1LG0ZmABAajLSwDMx0/exec?callback=orderRequestCb",
    type: "GET",
    dataType: "jsonp",
    data: requestObj,
  });
}

function orderRequestCb(response) {
  if (response.success) {
    systemMessage(
      "<b>Thanks a Bunch!</b><br> View more in <u onclick=preloadContent('mylab')>myLAB</u>",
      "green"
    );
    sessionStorage.setItem("points", response.points);
  } else {
    systemMessage(response.error, "red");
  }
  loadContent(window.location.hash.substring(1));

  // setTimeout(function(){

  // $( "#systemMessage" ).hide();
  // }, 5000);
}

function login(submit) {
  if (submit) {
    $("#loginPopupShadow").addClass("loading");

    $("#loginPopupTitle").text("Authorizing...");

    var loginObj = {
      email: $("#loginPopupEmail").val(),
      pass: $("#loginPopupPassword").val(),
      userid: null,
      seid: null,
    };

    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzVgUmPLBBeNXNcxbZ-Jhfqht8rY_n19KSx8T04618AbCKDio4N3AUZqbO56n3RHN0w/exec",
      type: "GET",
      data: loginObj,
      success: function (response) {
        loginCb(JSON.parse(response));
      },
      error: function (response) {
        loginCb(JSON.parse(response));
      },
    });
  } else {
    $(".credPopupData.register").hide();
    $(".credPopupData.login").show();
  }
}

function register(submit) {
  if (submit) {
    $("#loginPopupShadow").addClass("loading");

    $("#registerPopupTitle").text("Sending Request...");

    var registerObj = {
      name: $("#registerPopupName").val(),
      surname: $("#registerPopupSurname").val(),
      email: $("#registerPopupEmail").val(),
      mobile: $("#registerPopupMobile").val(),
      friendId: $("#registerPopupFriend").val(),
    };

    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbxWNDURdp6d1ttSV8bkrKh5WxSP5OG-0EGt8__VN6sxqguLtKiEFMmL92JyD346Ak_X/exec",
      type: "GET",
      data: registerObj,
      success: function (response) {
        registerCb(response);
      },
      error: function (response) {
        registerCb(response);
      },
    });
  } else {
    $(".credPopupData.register").show();
    $(".credPopupData.login").hide();
  }
}

function loginCb(response) {
  if (response.success) {
    sessionStorage.setItem("userid", response.userid);
    sessionStorage.setItem("name", response.name);
    sessionStorage.setItem("email", response.email);
    sessionStorage.setItem("points", response.points);
    sessionStorage.setItem("seid", response.seid);

    //if remember me, save session into localStorage
    if (document.getElementById("rememberMe").checked) {
      localStorage.setItem("userid", response.userid);
      localStorage.setItem("seid", response.seid);
    }

    if (afterLoginFunction != undefined) afterLoginFunction();
    $("#loginPopupShadow").removeClass("loading");
    closeCredPopup("loginPopupShadow");

    $(".credPopupData.login").remove();
    //$("#pageContent").addClass("member");
  } else {
    $("#loginPopupError").text(response.error);
    afterLoginFunction = undefined;
    $("#loginPopupShadow").removeClass("loading");
    $("#loginPopupEmail").focus();
  }

  populateUser(response.success);
}

function registerCb(response) {
  $("#loginPopupShadow").removeClass("loading");
  $("#registerPopupTitle").text("Account Login");

  closeCredPopup("loginPopupShadow");

  if (response.success) {
    const content = {
      title: "Registration Received!",
      subtitle: "Your new account is awaiting verification...",
      info: "We'll send your login details as soon as we approve your submitted details.",
      footer: "See you soon!<br /><b>The Mama's Nectar Team.</b>",
    };
    infoPopup(content, "#4ab74a");
  } else {
    systemMessage(
      "<b>Submission Failed.</b><br>There was an error, please try again later.",
      "red"
    );
  }
}

function proceedChangePass() {
  $("#changePassPopupShadow").addClass("loading");

  $("#changePassPopupTitle").text("Please wait...");

  var loginObj = {
    email: sessionStorage.getItem("email"),
    pass: $("#changePassCurrent").val(),
    newpass: $("#changePassConfirm").val(),
  };

  var request = jQuery.ajax({
    crossDomain: true,
    url: "https://script.google.com/macros/s/AKfycbznCuQa2FgLDUmmV309rQMJZIpDCfu585NfB55tdYyrJ2GaVQOB/exec?callback=changePassCb",

    method: "GET",
    dataType: "jsonp",
    data: loginObj,
  });
}

function changePassCb(response) {
  if (response.success == true) {
    alert(
      "Password Changed Successfully. Please login again using your new password."
    );
    logout();
  } else {
    $("#changePassPopupError").text(response.error);
    afterLoginFunction = undefined;
    $("#changePassPopupShadow").removeClass("loading");
    $("#changePassPopupTitle").text("Change Password");
  }
}

function changeMarketing(recieveMarketing) {
  var elem = document.getElementById("myAccountMarketing");
  elem.classList = [];
  elem.innerHTML = "Just a moment please, we are processing your request...";

  var loginObj = {
    email: sessionStorage.getItem("email"),
    marketing: recieveMarketing,
  };

  var request = jQuery.ajax({
    crossDomain: true,
    url: "https://script.google.com/macros/s/AKfycbwuXaKmsoIF2Bs4YqOZNyZXCWDNWh7xkmHg5sS-0dd6LWMirVA/exec?callback=changeMarketingCb",

    method: "GET",
    dataType: "jsonp",
    data: loginObj,
  });
}

function changeMarketingCb(response) {
  var elem = document.getElementById("myAccountMarketing");
  if (response.success == true) {
    if (response.value == true) {
      elem.innerHTML =
        "Great! You are currently subscribed to recieve emails regarding discounts, offers, gifts or new products! " +
        '<a id="changeMarketing" onclick="changeMarketing(false); return false;">Click here to Unsubscribe.</a>';
    } else {
      elem.innerHTML =
        "Oh Crap! You are not subscribed to recieve emails regarding discounts, offers, gifts or new products." +
        '<a id="changeMarketing" onclick="changeMarketing(true); return false;"> Click here to Subscribe now!</a>';
    }
    elem.classList = [response.value];
  } else {
    elem.innerHTML = "Error : " + response.error;
  }
}

function loadMyLab() {
  $("#pageLoader").html("loading <b>myLAB</b>");

  var request = jQuery.ajax({
    crossDomain: true,
    url: "https://script.google.com/macros/s/AKfycbyIQs8oagOE3MZfax8MyLx2i8uUdVHMBPr8JMETzw/exec?callback=loadMyLabCb",
    method: "GET",
    dataType: "jsonp",
    data: { userid: sessionStorage.getItem("userid") },
  });
}

function loadMyLabCb(e) {
  if (e.error) {
    alert(e.message);
  } else {
    stateDefs = {
      "": "in-production",
      U: "unpaid",
      R: "ready",
      N: "ready",
      P: "paid",
    };

    var headerHtml = ""; //'<h2 class="myLabRequestTitle">Pending requests</h2>';

    var html = "";
    var totalPrice = 0.0;
    var totalPointsToEarn = 0;

    e.requests.forEach(function (item) {
      if (item.state != "P") {
        totalPrice += item.price;
      }

      totalPointsToEarn += Math.max(item.points, 0); // not counting negative points (free bottles)

      var imageExtension = item.type == "nectars" ? ".png" : ".jpg";
      var imgUrl =
        item.type +
        "/" +
        item.flavor.replace(/[^a-z0-9]/gi, "").toLowerCase() +
        imageExtension;

      html += '<tr class="myLabRequestRow">';

      html += '<td><img src="' + imgUrl.toLowerCase() + '"/></td>';

      html += '<td class="myLabRequestMidCol">';
      html += '<span class="myLabRequestRowFlavor">' + item.flavor + "</span>";

      if (item.type == "nectars") {
        var nicText = "";
        if (item.nicotine > 0) {
          nicText = item.nicType == "F" ? " Freebase" : " Salt";
        }
        var vgText = "";
        if (Math.round(item.vg) == 100) {
          vgText = "MAX-VG";
        } else {
          vgText = Math.round(item.vg) + "/" + Math.round(100 - item.vg);
        }

        html += '<span class="myLabRequestRowInfo">';
        html += "<span>" + item.quantity + "x " + item.size + "ml" + "</span>";
        html += "<span>" + item.nicotine + "mg" + nicText + "</span>";
        html += "<span>" + vgText + "</span>";
        html += "<span>" + item.vaper + "</span>";
        html += "<span>" + item.datetime + "</span>";
        html += "</span>";
      } else {
        html += '<span class="myLabRequestRowInfo">';
        html += "<span>" + item.quantity + "x " + item.size + "</span>";
        html += "<span>" + item.datetime + "</span>";
        html += "</span>";
      }

      html += "</td>";

      html += '<td class="myLabRequestEndCol">';

      if (item.price > 0)
        html +=
          '<span class="myLabRequestRowPrice">€' +
          item.price.toFixed(2) +
          "</span>";
      else html += '<span class="myLabRequestRowPrice free">FREE!</span>';

      if (item.points != "") {
        if (item.points > 0)
          html +=
            '<span class="myLabRequestRowPoints positive">+' +
            item.points +
            " points!</span>";
        else
          html +=
            '<span class="myLabRequestRowPoints negative">' +
            item.points +
            " points</span>";
      }

      if (item.type == "nectars") {
        html +=
          '<div class="myLabRequestGridState state' +
          item.state +
          '">' +
          stateDefs[item.state] +
          "</div>";
      } else {
        html +=
          '<div class="myLabRequestGridState state' +
          item.state +
          '">' +
          stateDefs[item.state] +
          "</div>";
      }
      html += "</td>";

      html += "</tr>";
    });

    if (e.requests.length > 0) {
      var footerHtml = "<div class='myLabRequestTotalSummary'>";
      footerHtml +=
        "<span class='myLabRequestTotalSummaryCost'>Your order total is <b>€" +
        totalPrice.toFixed(2) +
        "</b></span><br>";

      if (totalPointsToEarn > 0)
        footerHtml +=
          "<span class='myLabRequestTotalSummaryPoints'>You'll earn <b>" +
          totalPointsToEarn +
          " Points</b> once your requests are paid and processed!</span>";

      footerHtml += "</div>";

      document.getElementById("myLabRequestContainer").innerHTML =
        headerHtml +
        '<table class="myLabRequestGrid ">' +
        html +
        "</table>" +
        footerHtml;
    } else {
      html = '<h2 class="noLabRequests">you have no lab-requests</h2>';
      document.getElementById("myLabRequestContainer").innerHTML =
        '<div class="myLabRequestGrid fxDisplay fxDirCol">' + html + "</div>";
    }
  }

  pageLoaded();
}

function loadMyAccount() {
  if (sessionStorage.getItem("userid") && sessionStorage.getItem("seid")) {
    var userRef = {
      userid: sessionStorage.getItem("userid"),
      seid: sessionStorage.getItem("seid"),
    };
    var request = jQuery.ajax({
      crossDomain: true,
      url: "https://script.google.com/macros/s/AKfycbwXffCM5Bszinspmq4Gidvq9qyGs_egLaVhmI5ckfxSREbGlxwf/exec/exec?callback=loadMyAccountCb",
      method: "GET",
      dataType: "jsonp",
      data: userRef,
    });

    $("#pageLoader").html("loading account");
  }
}

function loadMyAccountCb(response) {
  if (response.success == true) {
    document.getElementById("myUserID").innerHTML = response.details.userId;

    var date = new Date(response.details.memberFrom);
    document.getElementById("myMembership").innerHTML =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    document.getElementById("myAccountPoints").innerHTML =
      response.details.points;
    document.getElementById("myAccountName").innerHTML =
      response.details.fullName;
    document.getElementById("myAccountEmail").innerHTML =
      response.details.email;
    document.getElementById("myAccountMobile").innerHTML =
      response.details.mobile;

    changeMarketingCb({ success: true, value: response.details.marketing });

    //update session
    sessionStorage.setItem("name", response.details.fullName);
    sessionStorage.setItem("email", response.details.email);
    sessionStorage.setItem("points", response.details.points);
  } else {
    alert(response.error);
  }
  pageLoaded();
}
