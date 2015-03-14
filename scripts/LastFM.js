var LastFM = {
  getAlbum: function(callback) {
    var album = Albums.random()
    var title = album.title;
    var artist = album.artist;
    var key = "1731dd359b6102a53687417d6d4159ae";
    var url = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + key + '&artist=' + artist + '&album=' + title + '&format=json';
    $.ajax({
      url: url,
      type: 'get',
      success: function(response) {
        var i = response.album.image[response.album.image.length - 1];
        var src = i[Object.keys(i)[0]];
        if (src == "") {
          LastFM.getAlbum(callback);
        } else {
          var image = new Image();
          var load = function() {
            $('.container.active').find('.cover').not('.active').css('background-image', 'url(' + src + ')').css('opacity', '1');
          }
          image.onload = function() { load(); }
          // in case the load hangs. max out at 2 seconds
          setTimeout(function() { load(); }, 2000);

          image.src = src;
          callback(response.album);
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
};
