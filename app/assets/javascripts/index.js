var isPaused = false;

function slideshow (slides){
  var counter = 0;
  var i;
  var j;
  for (i = 0, j = 40; i < slides.length; i += 1, j -= 1){
    $(slides[i]).css("z-index", j);
  }
  return {
    intervalId:  0,
    startSlideshow: function () {
      window.setInterval(function () {
      if (!isPaused){
        if (counter === 0) {
          slides.eq(counter).fadeOut();
          counter += 1;
        } else if (counter === slides.length-1) {
            counter = 0;
            slides.eq(counter).fadeIn(function () {
            slides.fadeIn();
          });
          } else {
            slides.eq(counter).fadeOut();
            counter += 1;
          }
        }
      }, 2000);
    },
    pauseSlideshow: function(){
      window.clearInterval(slideshow(slides.intervalId))
    }
  };
};



$(document).ready(function(){
  var token = $(".token").data("token")
  var locationIds;
  $(".location-options").empty();

  $(".current-location-btn").on('click', function(){
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    function showPosition(position) {
      var latLong = "lat=" + position.coords.latitude + "&lng=" + position.coords.longitude;
      console.log('https://api.instagram.com/v1/media/search?' + latLong + "&min_timestamp=" +  (Date.now()/1000-1000*86400) + '&max_timestamp='+ Date.now()/1000 +'&distance=20&count=33&access_token=' + token + "&callback=callbackFunction")
        $.ajax({
          type: "GET",
          dataType: "jsonp",
          jsonp: "callback",
          url: 'https://api.instagram.com/v1/media/search?' + latLong+ '&min_timestamp=' + (Date.now()/1000-1000*86400)+ '&max_timestamp='+ Date.now()/1000 +'&distance=15&count=33&access_token=' + token + "&callback=callbackFunction",
          success: function(data){
            var images = data["data"];
            if(images.length){
              var urls = images.map(function(value){return value["images"]["standard_resolution"]["url"]});
              for(var i = 0; i< urls.length; i++){
                var newPhoto = "<img src=" + urls[i] + " id ='photo"+i +"'/>"
                $(".photos-slideshow").append(newPhoto);
              }
              var slides = $(".photos-slideshow img");
              slideshow(slides).startSlideshow();
            }else{
              alert("No images available in that location");
            }
          }
        })
      }
    getLocation()
  });
  //     $.ajax({
  //       type: "GET",
  //       dataType: "jsonp",
  //       jsonp : "callback",
  //       url: 'https://api.instagram.com/v1/locations/search?' + latLong +'&access_token=' + token + "&callback=callbackFunction",
  //       success: function(data){
  //         locationIds = data["data"].map(function(value){
  //           return {id: value["id"], name: value["name"]};
  //         });
  //         for(var i = 0; i < locationIds.length; i++){
  //           $(".location-options").append("<br><button class='location-button' data-location=" +locationIds[i]["id"]+">" + locationIds[i]["name"] + "</button><br>");
  //         }
  //       }
  //     })
  //   }
  //   getLocation();
  // })
  //
  // $(document).on('click', '.location-button', function(){
  //   $(".photos-slideshow").empty();
  //   console.log('https://api.instagram.com/v1/locations/' + $(this).data("location") +'/media/recent?&access_token=' + token + "&callback=callbackFunction")
  //   $.ajax({
  //     type: "GET",
  //     dataType: "jsonp",
  //     jsonp : "callback",
  //     url: 'https://api.instagram.com/v1/locations/' + $(this).data("location") +'/media/recent?&access_token=' + token + "&callback=callbackFunction",
  //     success: function(data){
  //       var images = data["data"];
  //       if(images){
  //         var urls = images.map(function(value){return value["images"]["standard_resolution"]["url"]});
  //         for(var i = 0; i< urls.length; i++){
  //           var newPhoto = "<img src=" + urls[i] + " id ='photo"+i +"'/>";
  //           $(".photos-slideshow").append(newPhoto);
  //         }
  //         var slides = $(".photos-slideshow img");
  //         slideshow(slides).startSlideshow();
  //       }else{
  //         alert("No images with that tag available");
  //       }
  //     }
  //   })


  $(".photo-search").on('click', function(){
    var tagName = $("input:text").val();
    $(".popupform").hide()
    $(".photos-slideshow").empty();
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      jsonp : "callback",
      // jsonpCallback: "jsonpcallback",
      url: "https://api.instagram.com/v1/tags/" + tagName + "/media/recent?access_token=" + token + "&callback=callbackFunction",
      success: function(data) {
        var images = data["data"];
        if(images){
          var urls = images.map(function(value){return value["images"]["standard_resolution"]["url"]});
          for(var i = 0; i< urls.length; i++){
            var newPhoto = "<img src=" + urls[i] + " id ='photo"+i +"'/>";
            $(".photos-slideshow").append(newPhoto);
          }
          var slides = $(".photos-slideshow img");
          slideshow(slides).startSlideshow();
        }else{
          alert("No images with that tag available");
        }
      }
    });
  })


  var imageToSave;
  var clicks = 0;

  $(document).on('click', '.photos-slideshow img', function(e){
    clicks++;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (clicks%2===0){
      isPaused = false;
      imageToSave = undefined;
      $(".popupform").hide();
    }else{
      isPaused = true;
      $(".popupform").show();
      imageToSave = $(this).attr('src')
      console.log(imageToSave)
    }
  })


  $('select#photo_album_id').change(function(e){
    if ($('#photo_album_id option:selected').text() === 'New Album'){
      $(".create-album").show();
    }
  })

  $(document).on("click", ".save-photo-btn", function(e) {
    console.log("hi");
    e.preventDefault();
    e.stopImmediatePropagation();
    $.ajax({
      type: "POST",
      url: "/user/" + $(".popupform").data('id') + "/photos",
      data: {"photo": {name: $("#photo_name").val(), url: imageToSave, album_id:$("#photo_album_id").val(), album_attributes: {title: $("#photo_album_attributes_title").val(), user_id: $(".popupform").data('id') } } },
      success: function(data){
        $("#photo_name, #photo_album_id, #photo_album_attributes_title").val("")
        console.log("success!");
      }
    })
  });


//when clicked, append to body of div (build form in raw html--using .append)
//change css of popupform to display: block (or .show as function)
//submit as hidden field tag;

})
