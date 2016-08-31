$(document).ready(function() {
    var $el = $('#ship'),
        cssPosition = $el.css('position');

    function moveUp() {
        var offset = $el.offset();

        $el.animate({
            "top": "350px"
        }, 500)
    };

    function moveDown() {
        var offset = $el.offset();

        $el.animate({
            "top": "450px"
        }, 500)
    };

    function moveRight() {
        var offset = $el.offset();

        $el.animate({
            "left": "100px"
        }, 500)
    };

    function moveLeft() {
        var offset = $el.offset();

        $el.animate({
            "left": "0px"
        }, 500)
    };

    $(document).bind('keydown', function(e) {
        if (e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 87) { // up
            moveUp();
        }

        if (e.keyCode == 37 || e.keyCode == 65) { // left
            moveLeft();
        }

        if (e.keyCode == 39 || e.keyCode == 68) { // right
            moveRight();
        }

        if (e.keyCode == 40 || e.keyCode == 83) { // down
            moveDown();
        }
    });

});
