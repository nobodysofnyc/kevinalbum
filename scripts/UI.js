var perc = 0.6;
var sleeveLoaded = false;
var UI = {
  reveal: function() {
    var width = window.outerWidth / 2 + (window.outerHeight * perc);
    $('.sleeve').css({
      '-webkit-transform' : 'translate3d('+ -width +'px, 0px, 0px) rotateZ(-10deg)',
      '-moz-transform' : 'translate3d('+ -width +'px, 0px, 0px) rotateZ(-10deg)',
      '-o-transform' : 'translate3d('+ -width +'px, 0px, 0px)',
      'transform' : 'translate3d('+ -width +'px, 0px, 0px) rotateZ(-10deg)',
    });

    $('.cover').css({
      'transform' : 'scale(1.0)'
    });

    $('.container').removeClass('active');

    game.turn.state = PlayingState.REVEAL;
  },

  cleanup: function() {
    var width = window.outerWidth / 2;
    var height = window.innerHeight / 2;
    var containerWidth = window.innerHeight * perc;
    var $not = $('.container').not('.active');
    $not.bind('webkitTransitionEnd transitionend oTransitionEnd', function(e) {
      $not.unbind('webkitTransitionEnd transitionend oTransitionEnd');
      $(e.target).remove();
    });
    $not.css({
      '-webkit-transform' : 'translate3d('+ -(width * 3 + (containerWidth / 2)) +'px, 0px, 0px) rotateZ(-10deg)',
      '-moz-transform' : 'translate3d('+ -(width * 3 + 250) +'px, 0px, 0px) rotateZ(-10deg)',
      '-o-transform' : 'translate3d('+ -(width * 3 + (containerWidth / 2)) +'px, 0px, 0px)',
      'transform' : 'translate3d('+ -(width * 3 + (containerWidth / 2)) +'px, 0px, 0px) rotateZ(-10deg)',
    });
  },

  reset: function(completion) {
    var height = window.innerHeight / 2.0;
    var containerHeight = window.innerHeight * perc;
    var doIt = function() {
      var $container = $('<div class="container active"></div>');
      var $cover = $('<div class="cover"></div>');
      var $sleeve = $('<div class="sleeve"><img src="images/albumsleeve_sm.png" /></div>');
      $container.append($cover).append($sleeve);
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
        completion();
      }, 100);
    }

    UI.preloadImage('images/albumsleeve_sm.png', function() {
      doIt();
    });

    $('#guess').val('').focus();
  },

  preloadImage: function(image, callback) {
    var i = new Image();
    i.onload = callback;
    i.src = image
  }
}

