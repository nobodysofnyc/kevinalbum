var HIGH_THRESHOLD = 0.7;
var LOW_THRESHOLD = 0.33;

var Points = {
  ALL: 10,
  BIG: 7,
  SMALL: 3
}

var PlayingState = {
  GUESSING: 0,
  REVEAL: 1
};

function Turn(onAlbumReceived, completion, remoteData) {
  this.guess;
  this.points;
  this.state = PlayingState.GUESSING;
  this.record = remoteData ? remoteData.record : {};
  this.song = remoteData ? (remoteData.song ? this.createTurnAudio(remoteData.song) : null) : null;
  this.opponentGuess;

  if (remoteData === undefined) {
    this.getAlbum(onAlbumReceived, completion);
  }
}

Turn.prototype = {
  guess: function(guess, completion) {
    if (guess === "") {
      completion(null);
      return;
    }
    var fuzz = this.fuzz();
    if (fuzz === null) {
      return;
    }
    var results = fuzz.get(guess);
    if (results && results.length && results[0].length) {
      if (results[0][0] > HIGH_THRESHOLD) {
        var match = results[0][1];
        if (match) {
          completion(Points.BIG);
        } else {
          completion(null);
        }
      } else {
        var match = this.fuzzyMatch(guess);
        if (match && match > LOW_THRESHOLD) {
          completion(Points.SMALL);
        } else {
          completion(null);
        }
      }
    } else {
      var match = this.fuzzyMatch(guess);
      if (match && match > LOW_THRESHOLD) {
        completion(Points.SMALL);
      } else {
        completion(null);
      }
    }
  },

  fuzz: function() {
    if (Object.keys(this.record).length == 0 ) {
      return null;
    } else {
      return new FuzzySet([
        this.record.name
      ]);
    }
  },

  fuzzyMatch: function(guess) {
    var words = guess.split(" ");
    var match = this.record.name.toLowerCase().split(' ');
    var matches = 0;
    for (var i = 0; i < words.length; i++) {
      if (match.indexOf(words[i]) !== -1) {
        matches++;
      }
    }
    return matches / match.length;
  },

  getAlbum: function(onAlbumReceived, completion) {
    var self = this;
    LastFM.getAlbum(function(album) {
      var i = album.image[album.image.length - 1];
      var src = i[Object.keys(i)[0]];
      if (onAlbumReceived) {
        onAlbumReceived(src);
      }
      album.art = src;
      self.record = album;
      Spotify.getAlbum(album, function(spotifyAlbum) {
        if (spotifyAlbum) {
          Spotify.getSongs(spotifyAlbum, function(songs) {
            self.song = self.createTurnAudio(songs[0].preview_url);
            if (completion) {
              completion();
            }
          });
        } else {
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
  },

  createTurnAudio: function(src) {
    audio = new Audio();
    audio.setAttribute("loop", "loop");
    audio.src = src;
    return audio;
  },

  asJSON: function() {
    return {
      song: this.song ? this.song.getAttribute('src') : null,
      record: {
        name: this.record.name,
        artist: this.record.artist,
        art: this.record.art
      }
    }
  }
}
