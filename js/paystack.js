function payWithPaystack(type) {
  var handler = PaystackPop.setup({
    key: "pk_live_f965a127e5302249fa512b2aed86082068624490",
    email: scrapemailstring(),
    amount: cashmapper(type) * 100,
    currency: "NGN",
    ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    metadata: {
      custom_fields: [
        {
          display_name: "Mobile Number",
          variable_name: "mobile_number",
          value: "+2348012345678"
        }
      ]
    },
    callback: function(response) {
      subscribe(type);
    },
    onClose: function() {}
  });
  handler.openIframe();
}
//maps the right price to the string
function cashmapper(type) {
  if (type === "trial") {
    return 500;
  } else {
    return 2000;
  }
}
//scraps from html markup then returns
function scrapemailstring() {
  var tag = document.querySelector("#dashboard");
  var email = tag.getAttribute("data-name");
  return email;
}
//subscribes the user
function subscribe(type) {
  var req = new XMLHttpRequest();
  if (type == "trial") {
    req.open("POST", "backend/users/subscribe.php");
    req.send(type);
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200) {
        if (req.responseText == 1) {
          window.location.hash = "#/service";
        }
      }
    };
  } else {
    req.open("POST", "backend/users/subscribe.php");
    req.send(type);
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200) {
        if (req.responseText == 1) {
          window.location.hash = "#/service";
        }
      }
    };
  }
}
