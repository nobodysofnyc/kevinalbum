var PlayingState = {
  GUESSING: 0,
  REVEAL: 1
};

function Turn(onAlbumReceived, completion) {
  this.record = {};
  this.guess;
  this.points;
  this.song;
  this.state = PlayingState.GUESSING;

  this.getAlbum(onAlbumReceived, completion);
}

Turn.prototype = {
  guess: function(guess, completion) {
    var fuzz = this.fuzz();
    if (fuzz === null) {
      return;
    }
    var results = fuzz.get(guess);
    if (results && results.length && results[0].length) {
      console.log(results[0][0]);
      if (results[0][0] > THRESHOLD) {
        var match = results[0][1];
        var pts = 0;
        if (match === [this.record.name, this.record.title].join(" ")) {
          pts = Points.ALL;
        } else if (match === this.record.title) {
          pts = Points.BIG;
        } else if (match === this.record.artist) {
          pts = Points.SMALL;
        } else {
          console.log('WRONG');
          completion(null);
          return;
        }
        completion(pts);
      }
    }
  },

  fuzz: function() {
    if (Object.keys(this.record).length == 0 ) {
      return null;
    } else {
      return new FuzzySet([
        this.record.artist,
        this.record.name,
        [this.record.artist, this.record.name].join(" ")
      ]);
    }
  },

  getAlbum: function(onAlbumReceived, completion) {
    var self = this;
    LastFM.getAlbum(function(album) {
      console.log("got album from last.fm");
      var i = album.image[album.image.length - 1];
      var src = i[Object.keys(i)[0]];
      if (onAlbumReceived) {
        onAlbumReceived(src);
      }
      album.art = src;
      self.record = album;
      Spotify.getAlbum(album, function(spotifyAlbum) {
        if (spotifyAlbum) {
          console.log('got album from spotify');
          Spotify.getSongs(spotifyAlbum, function(songs) {
            console.log('got songs from spotify');
            audio = new Audio();
            audio.setAttribute("loop", "loop");
            audio.src = songs[0].preview_url;
            self.song = audio;
            if (completion) {
              completion();
            }
          });
        } else {
          console.log('not on spotify');
          if (completion) {
            completion();
          }
        }
      });
    });
  },

  playAudioPreview: function() {
    if (this.song) {
      this.song.play();
    }
  },

  pauseAudioPreview: function() {
    if (this.song != null) {
      this.song.pause();
    }
  }
}
