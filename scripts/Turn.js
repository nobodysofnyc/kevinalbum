var PlayingState = {
  GUESSING: 0,
  REVEAL: 1
};

function Turn() {
  this.record = {};
  this.guess;
  this.points;
  this.song;
  this.state = PlayingState.GUESSING;

  this.getAlbum();
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
        if (match === [this.record.artist, this.record.title].join(" ")) {
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
    console.log(this.record);
    if (Object.keys(this.record).length == 0 ) {
      return null;
    } else {
      return new FuzzySet([
        this.record.artist,
        this.record.title,
        [this.record.artist, this.record.title].join(" ")
      ]);
    }
  },

  getAlbum: function() {
    var self = this;
    LastFM.getAlbum(function(album) {
      self.record.artist = album.artist;
      self.record.title = album.name;
      Spotify.getAlbum(album, function(spotifyAlbum) {
        Spotify.getSongs(spotifyAlbum, function(songs) {
          audio = new Audio();
          audio.setAttribute("loop", "loop");
          audio.src = songs[0].preview_url;
          self.song = audio;
        });
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
