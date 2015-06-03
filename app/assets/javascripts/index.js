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
        if(images){
          var urls = images.map(function(value){return value["images"]["standard_resolution"]["url"]});
          for(var i = 0; i< urls.length; i++){
            var newPhoto = "<img src=" + urls[i] + " id ='photo"+i +"'/>";
            $(".photos").append(newPhoto);
          }
          var slides = $(".photos img");
          slideshow(slides).startSlideshow();
        }else{
          alert("No images with that tag available");
        }
      }
    });
  })

  var clicks = 0;
  $(document).on('click', 'img', function(e){
    clicks++;
    if (clicks%2===0){
      e.preventDefault();
      isPaused = false;
    }else{
      e.preventDefault();
      isPaused = true;

      // popUpLibrary($(".popupform").show());
      $(".token").append($(".popupform").show());
      var imageToSave = $(this).attr('src')
      $(document).on("click", ".form-submit", function(e) {
        console.log("hi")
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: "/user/" + $(".popupform").data('id') + "/photos",
          data: {"photo": {name: $("#photo_name").val(), url: imageToSave, album_id:$("#photo_album_id").val(), album_attributes: {title: $("#photo_album_attributes_title").val(), user_id: $(".popupform").data('id') } } },
          success: function(data){
            console.log("success!");
          }
        })
      });
    }
  })

  $('select').change(function(e){
    if ($('select option:selected').text() === 'New Album'){
      $(".create-album").show()
    }
  })

  // $(document).on("click", ".popupform:submit" function(e) {
  //   e.preventDefault();
  //   $.ajax({
  //     type: "POST",
  //     url: "user/user_id/photos",
  //     data: {"photos": {content: $(".popupform-input").val(), complete: false}},
  //     success: function(data){
  //       $(".popupform-input").val("");
  //("<label for='photo_album_attributes_title'>New Album Title</label><input type='text' name='photo[album_attributes][title]' id='photo_album_attributes_title'>");
  //       $("tbody").append("<tr> <td class = 'content-list'>" + data.content + "</td> <td class = 'complete'>" + data.complete + "</td> <td><button class = 'toggle-complete' data-id = " + data.id + "> Toggle Completion </button></td><td><button class='delete' data-id= "+ data.id+"> Delete </button></td></tr>")
  //     }
  //   })
  // });
//when clicked, append to body of div (build form in raw html--using .append)
//change css of popupform to display: block (or .show as function)
//submit as hidden field tag;

})
