$(document).ready(function(){
  var token = $(".token").data("token")
  console.log(token);

  $("input:submit").on('click', function(){
    var tagName = $("input:text").val();
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      jsonp : "callback",
      // jsonpCallback: "jsonpcallback",
      url: "https://api.instagram.com/v1/tags/" + tagName + "/media/recent?access_token=" + token + "&callback=callbackFunction",
      success: function(data) {
        var images = data["data"];
        console.log(images);
        var urls = images.map(function(value){return value["images"]["standard_resolution"]["url"]})
        console.log(urls);
      }
    });

  })

})
