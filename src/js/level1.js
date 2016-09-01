$(document).ready(function() {
    var $el = $('#ship'),
        cssPosition = $el.css('position');

    function moveUp() {
        var offset = $el.offset();

        $el.css({
            "top": "350px"
        }, 500)
    };

    function moveDown() {
        var offset = $el.offset();

        $el.css({
            "top": "450px"
        }, 500)
    };

    function moveRight() {
        var offset = $el.offset();

        $el.css({
            "left": "100px"
        }, 500)
    };

    function moveLeft() {
        var offset = $el.offset();

        $el.css({
            "left": "0px"
        }, 500)
    };

    // keyboard shortcuts

    $(document).bind('keydown', function(e) {
        if (e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 87) { // up, w, spacebar
            moveUp();
        }

        if (e.keyCode == 37 || e.keyCode == 65) { // left, a
            moveLeft();
        }

        if (e.keyCode == 39 || e.keyCode == 68) { // right, d
            moveRight();
        }

        if (e.keyCode == 40 || e.keyCode == 83) { // down, s
            moveDown();
        }
    });

});
