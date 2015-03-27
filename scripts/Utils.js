var Utils = {
  getParameterByName: function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  randomString: function(length) {
    var str = "";
    for (var i = 0; i < length; i++) {
      var arr = Utils._c();
      str += arr[Math.floor(Math.random() * arr.length)];
    }
    return str;
  },

  _c: function() {
    var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
      "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
      "u", "v", "w", "q", "y", "z", "A", "B", "C", "D",
      "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
      "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
      "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return arr;
  }
}
