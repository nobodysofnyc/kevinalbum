var UI = {
  reveal: function() {
    $('#cover').animate({ 'left': '240px' });
    $('#sleeve').animate({ 'left': '-240px' });
  },
  reset: function() {
    $('#cover').css({ 'left': '0', 'opacity' : '0', 'background-image': 'none' });
    $('#sleeve').css({ 'left': '0px' });
    $('#guess').val('').focus();
  }
}

