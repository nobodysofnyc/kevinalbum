var Spotify = {
  getAlbum: function(album, callback) {
    var title = encodeURIComponent(album.name.toLowerCase());
    var artist = encodeURIComponent(album.artist.toLowerCase());
    var url = "https://api.spotify.com/v1/search?q=album:" + title + "%20artist:" + artist + "&type=album";
    $.ajax({
      url: url,
      type: 'get',
      success: function(response) {
        callback(response.albums.items[0]);
      },
      error: function(error) {
        console.log(error);
      }
    });
  },

  getSongs: function(album, callback) {
    var url = "https://api.spotify.com/v1/albums/" + album.id + "/tracks"
    $.ajax({
      url: url,
      type: 'get',
      success: function(response) {
        callback(response.items);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
};
