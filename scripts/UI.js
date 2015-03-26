var perc = 0.6;
var sleeveLoaded = false;
var UI = {
  showPlayWithFriendModal: function() {
    var $overlay = $('<div id="overlay"></div>');
    $('.in-da-fg').addClass('blur-dat');
    $('.in-da-bg').addClass('blur-dat');
    var $sheet = UI._buildShareSheet();
    $sheet.css({
      'margin-left' : -($sheet.width() / 2),
      'margin-top' : -($sheet.height() / 2)
    }).fadeIn('slow');
  },

  hidePlayWithFriendModal: function() {
    $('.in-da-fg').removeClass('blur-dat');
    $('.in-da-bg').removeClass('blur-dat');
    $('#modal-bg').fadeOut('slow', function() {
      $(this).remove();
    });
    $('#modal').fadeOut('slow', function() {
      $(this).remove();
    });

  },

  updateTurnCount: function(number, outOf) {
    $('#turn-count').html(number + " of " + outOf);
  },

  reveal: function(turn) {
    var width = window.outerWidth / 2 + (window.outerHeight * perc);
    $('.sleeve').css({
      '-webkit-transform' : 'translate3d('+ -width +'px, 0px, 0px) rotateZ(-10deg)',
      '-moz-transform' : 'translate3d('+ -width +'px, 0px, 0px) rotateZ(-10deg)',
      '-o-transform' : 'translate3d('+ -width +'px, 0px, 0px)',
      'transform' : 'translate3d('+ -width +'px, 0px, 0px) rotateZ(-10deg)',
    });

    $('input').blur();

    $('.cover').css({
      '-webkit-transform' : 'scale(1)',
      'transform' : 'scale(1)'
    });

    var $container = $(".container");
    $container.removeClass('active');
    var $info = $container.find('.album-info');
    $info.find('.album-name').html(turn.record.name);
    $info.find('.album-artist').html(turn.record.artist);
    var height = $info.height() + 12;
    $info.css({
      '-webkit-transform' : 'translate3d(0px, -'+ height +'px, 0px)',
      '-moz-transform' : 'translate3d(0px, -'+ height +'px, 0px)',
      '-o-transform' : 'translate3d(0px, -'+ height +'px, 0px)',
      'transform' : 'translate3d(0px, -'+ height +'px, 0px)'
    });
    turn.state = PlayingState.REVEAL;
  },

  cleanup: function() {
    var width = window.outerWidth / 2;
    var height = window.innerHeight / 2;
    var containerWidth = window.innerHeight * perc;
    var $not = $('.container').not('.active');
    var done = false;
    $not.bind('webkitTransitionEnd transitionend oTransitionEnd', function(e) {
      if (!done) {
        done = true
        $(e.target).remove();
      }
    });
    $not.css({
      '-webkit-transform' : 'translate3d('+ -(width * 3 + (containerWidth / 2)) +'px, 0px, 0px) rotateZ(-10deg)',
      '-moz-transform' : 'translate3d('+ -(width * 3 + 250) +'px, 0px, 0px) rotateZ(-10deg)',
      '-o-transform' : 'translate3d('+ -(width * 3 + (containerWidth / 2)) +'px, 0px, 0px)',
      'transform' : 'translate3d('+ -(width * 3 + (containerWidth / 2)) +'px, 0px, 0px) rotateZ(-10deg)',
    });
  },

  reset: function() {
    var height = window.innerHeight / 2.0;
    var containerHeight = window.innerHeight * perc;
    var doIt = function() {
      var $container = $('<div class="container active"></div>');
      var $info = $('<div class="album-info"><p class="album-name"></p><p class="album-artist"></p></div>');
      var $cover = $('<div class="cover"></div>');
      var $sleeve = $('<div class="sleeve"><img src="images/albumsleeve_sm.png" /></div>');
      $container.append($info).append($cover).append($sleeve);
      $container.css({
        'top' : height - (containerHeight / 2),
        'left' : window.outerWidth,
      });

      $('#content').append($container);

      var width = window.outerWidth / 2;
      setTimeout(function() {
        $('.container.active').css({
          '-webkit-transform' : 'translate3d('+ -(width + (containerHeight / 2)) +'px, 0px, 0px) scale(1.0)',
          '-moz-transform' : 'translate3d('+ -(width + 250) +'px, 0px, 0px) scale(1.0)',
          '-o-transform' : 'translate3d('+ -(width + 250) +'px, 0px, 0px) scale(1.0)',
          'transform' : 'translate3d('+ -(width + (containerHeight / 2)) +'px, 0px, 0px) scale(1.0)',
        });
        $('.container.active').find('.cover').not('.active').css('background-image', 'url(' + game.turn.record.art + ')').css('opacity', '1');
      }, 100);
    }

    UI.preloadImage('images/albumsleeve_sm.png', function() {
      doIt();
    });

    $('#guess').val('').focus();
  },

  animatePoints: function($points, currPoints, pts, i) {
    setTimeout(function() {
      $points.text(currPoints + 1 + i +" pts");
    }, i * 30);
  },

  addPoints: function(pts) {
    var $points = $('#points');
    var currPoints = parseInt($('#points').html());
    setTimeout(function() {
      for (var i = 0; i < pts; i++) {
        UI.animatePoints($points, currPoints, pts, i);
      }
    }, 200);

    $points.addClass('bloop');
    setTimeout(function() {
      $points.removeClass('bloop');
    }, 800);
  },

  preloadImage: function(image, callback) {
    var i = new Image();
    i.onload = callback;
    i.src = image
  },

  _buildShareSheet: function() {
     var $container = $('<div id="modal-bg"></div>');
     var $div = $('<div id="modal"></div>');
     var $header = $('<h4>Share this with a friend</h4>');
     var $code = $('<p>' + Code.random(4) + '</p>');
     $('body').append($container).append($div.append($header).append($code));
     $container.bind('click', function() {
       UI.hidePlayWithFriendModal();
     });
     return $div;
  }

}

