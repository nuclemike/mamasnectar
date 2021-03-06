function systemMessage(message, className) {
  $(
    "<p id='systemMessage' class='" + className + "' >" + message + "</p>"
  ).insertAfter("#header");

  setTimeout(function () {
    $("#systemMessage").remove();
  }, 8000);
}

function buyNectar(element) {
  if (
    accessNeeded(function () {
      buyNectar(element);
    })
  ) {
    return false;
  }

  var productTitle, productHeadInfo, productTags, imgUrl;

  productTitle = $(element).children(".nectarName").html();
  productHeadInfo = $(element).children(".nectarInfo").html();
  productTags = $(element).attr("props").replace(/ /g, " • ");
  imgUrl = $(element).find("img.nectarFlask").attr("src");

  openMenu(false);
  $("#pageLoader").show();
  $("#pageLoader").html("loading <b>" + productTitle + "</b>");
  $("#pageContent").hide();
  $("#scrollContent").scrollTop(0);

  //var nectarSimpleString = productTitle.replace(/[^a-z0-9]/gi,'').toLowerCase();
  //gtag('config', 'UA-104168459-1', {'page_path': '/'+productTitle});
  //location.hash = location.hash+'/'+nectarSimpleString;

  $("#pageContent").load(getPage("nectarorder"), function () {
    pageLoaded();

    document
      .getElementById("orderProductImage")
      .setAttribute("src", imgUrl.toLowerCase());
    document.getElementById("orderProductTitle").innerHTML = productTitle;
    document.getElementById("orderProductHeadInfo").innerHTML = productHeadInfo;
    document.getElementById("orderProductTags").innerHTML = productTags;
    document.getElementById(
      "orderProductSlip_CUSTOMTEXT"
    ).value = sessionStorage.getItem("name");
  });
}

function buyHardware(element) {
  if (
    accessNeeded(function () {
      buyHardware(element);
    })
  ) {
    return false;
  }

  var productSubtitle,
    productTitle,
    productPrice,
    productOldPrice,
    productSlipInfo,
    imgUrl,
    productColors = [],
    productSizes = [];

  productSubtitle = $(element).children(".product-item-brand").html();
  productTitle = $(element).children(".product-item-title").html();
  var outOfStock = $(element).hasClass("oos");
  productPrice = $(element).find(".product-item-price").html().substring(1);
  productSlipInfo = $(element).find(".product-item-info").html();

  var productOldPriceElement = $(element).find(".product-item-oldprice");
  if (productOldPriceElement.length) {
    productOldPrice = productOldPriceElement.html().substring(1);
  }

  if (element.hasAttribute("colors")) {
    productColors = element.getAttribute("colors").split(",");
  }

  if (element.hasAttribute("sizes")) {
    productSizes = element.getAttribute("sizes").split(",");
  }

  imgUrl = $(element).find("img.product-item-image").attr("src");

  openMenu(false);
  $("#pageLoader").show();
  $("#pageLoader").html("loading <b>" + productTitle + "</b>");
  $("#pageContent").hide();
  $("#scrollContent").scrollTop(0);

  $("#pageContent").load(getPage("hardwareorder"), function () {
    pageLoaded();

    document
      .getElementById("orderProductImage")
      .setAttribute("src", imgUrl.toLowerCase());
    document.getElementById("orderProductTitle").innerHTML = productTitle;
    document.getElementById("orderProductSubtitle").innerHTML = productSubtitle;
    document
      .getElementById("orderProductSlipPricing")
      .setAttribute("price", productPrice);
    $("#orderProductSlipPurchase")
      .html(outOfStock ? "Place Backorder" : "Place Order")
      .toggleClass("tomato", outOfStock);

    document.getElementById("orderProductSlipPrice").innerHTML =
      "€" + productPrice;
    document.getElementById("orderProductSlipInfo").innerHTML =
      productSlipInfo != null
        ? "<b>Quick Specs</b><p>" + productSlipInfo + "</p>"
        : "";

    if (productOldPrice != undefined) {
      document
        .getElementById("orderProductSlipPricing")
        .setAttribute("oldprice", productOldPrice);
      document.getElementById("orderProductSlipOldPrice").innerHTML =
        "€" + productOldPrice;
      var percentOff =
        ((productOldPrice - productPrice) / productOldPrice) * 100;
      document.getElementById("orderProductSlipEarn").innerHTML =
        "This product is on <b>" + Math.round(percentOff) + "%</b> Discount!";
    } else {
      $("#orderProductSlipOldPrice, #orderProductSlipEarn").remove();
    }

    if (productColors.length > 0) {
      var colorSelectionElement = document.getElementById(
        "orderProductSlip_COLOR"
      );

      productColors.forEach(function (color) {
        var option = document.createElement("option");
        option.text = color;
        colorSelectionElement.add(option);
      });
    } else {
      $("#orderProductSlipRow_COLORS").remove();
    }

    if (productSizes.length > 0) {
      var sizeSelectionElement = document.getElementById(
        "orderProductSlip_SIZE"
      );

      productSizes.forEach(function (size) {
        var option = document.createElement("option");
        option.text = size;
        sizeSelectionElement.add(option);
      });
    } else {
      $("#orderProductSlipRow_SIZE").remove();
    }
  });
}

function selectOption(element) {
  $(element).addClass("selected").siblings().removeClass("selected");
  recalcNectar();
}

function recalcHardware() {
  var pricingElement = document.getElementById("orderProductSlipPricing");
  var UnitPrice = pricingElement.getAttribute("price");

  var qty = document.getElementById("orderProductSlip_QTY").value;
  var totalPrice = UnitPrice * qty;

  document.getElementById("orderProductSlipPrice").innerHTML =
    "€" + totalPrice.toFixed(2);

  if (pricingElement.hasAttribute("oldPrice")) {
    var UnitOldPrice = pricingElement.getAttribute("oldprice");
    var totalOldPrice = UnitOldPrice * qty;
    document.getElementById("orderProductSlipOldPrice").innerHTML =
      "€" + totalOldPrice.toFixed(2);
  }
}

function recalcNectar() {
  var nicDose = document.getElementById("orderProductSlip_NICOTINE").value;

  //show nictype only when dose is more than zero mg
  $("#orderProductSlipRow_NICTYPE").toggle(nicDose > 0);

  //if nicotine is Zero, default the type to freebase
  if ($("#orderProductSlipRow_NICTYPE").is(":hidden"))
    $(".orderProductSlip_NICTYPE[value=F]")
      .addClass("selected")
      .siblings()
      .removeClass("selected");

  var size = $(".orderProductSlip_SIZE.selected").attr("value");

  var nicType = $(".orderProductSlip_NICTYPE.selected").attr("value");

  //hide 120 and 200mls when selecting salt
  $(
    ".orderProductSlip_SIZE[value=120], .orderProductSlip_SIZE[value=200]"
  ).toggle(nicType == "F");

  //default to 60ml if hydra was selected at 120ml
  if (size > 60 && nicType == "S") {
    $(".orderProductSlip_SIZE[value=60]")
      .addClass("selected")
      .siblings()
      .removeClass("selected");
    size = 60;
  }

  var size = $(".orderProductSlip_SIZE.selected").attr("value");
  var qty = +document.getElementById("orderProductSlip_QTY").value;

  var price = 0.0;
  var total = 0.0;

  var backPointsValue = 0;

  if (size && nicDose > -1) {
    if (nicType == "F") {
      if (size == 30) {
        price = 6;
      } else if (size == 60) {
        price = 10.5;
      } else if (size == 120) {
        price = 19.5;
      } else if (size == 200) {
        price = 30.0;
      }
    } else {
      if (size == 30) {
        price = 7;
      } else if (size == 60) {
        price = 12.5;
      }
      //else if (size == 120) {price = 23.50; }
    }

    //if unflavored, reduce price by 10%
    if ($("#orderProductTitle").text() == "Unflavored") {
      price = +(price * 0.9).toFixed(2); //the plus avoids returning a string by toFixed
    }

    //calculations
    var myPoints = 0;

    if (sessionStorage.getItem("points") != null) {
      myPoints = sessionStorage.getItem("points");
    }

    total = price * +qty;
    var backPointsValue = Math.floor((15 - nicDose) * total);
    var hasEnoughPoints = myPoints >= total * 100;

    //calculate points back or points to redeem
    if ($("#orderProductSlipRedeemButton").is(":checked") && hasEnoughPoints) {
      //$('#orderContainer').addClass('redeemMode');
      document.getElementById("orderProductSlipPrice").innerHTML = "€0.00";
      document.getElementById("orderProductSlipEarn").innerHTML = ""; //"you'll use <b>"+100 * total +"</b> points for this purchase!";
      $("#orderProductSlipEarn").show();
    } else {
      //$('#orderContainer').removeClass('redeemMode');
      $("#orderProductSlipRedeemButton").prop("checked", false);
      document.getElementById("orderProductSlipPrice").innerHTML =
        "€" + total.toFixed(2);
      document.getElementById("orderProductSlipEarn").innerHTML =
        "you'll earn <b>" + backPointsValue + "</b> points with this purchase!";
      $("#orderProductSlipEarn").toggle(backPointsValue > 0);
    }

    document.getElementById("orderProductSlipRedeemButtonCaption").innerHTML =
      "Use " + Math.round(+total * 100) + " points!";
    document.getElementById("orderProductSlipPointsBalance").innerHTML =
      "You have " + myPoints + " points in your account";

    //if user has enough points
    if (hasEnoughPoints) {
      $("#orderProductSlipRedeem").removeClass("notEnough");
    } else {
      $("#orderProductSlipRedeem").addClass("notEnough");
    }
  }

  $("#orderProductSlipPricing, #orderProductSlipRedeem").toggle(
    size != undefined && nicDose > -1
  );
}
