$(document).ready(function() {
    var $el = $('#bender'),
        cssPosition = $el.css('position');

    function angry() {
        if ($el.attr('src') == "assets/img/bender_standing-left.png") {
            var imgSrc = "assets/img/bender_angry-left.png",
                standing = "assets/img/bender_standing-left.png";
        } else {
            var imgSrc = "assets/img/bender_angry.png",
                standing = "assets/img/bender_standing.png";
        }

        $el
            .queue(function(next) {
                $(this).attr('src', imgSrc);
                $("#cursing").show();
                next();
            })
            .delay(500)
            .queue(function(next) {
                $(this).attr('src', standing);
                $("#cursing").hide();
                next();
            });
    }

    function jump() {
        var offset = $el.offset(),
            bottom = $(window).height() - $el.height(),
            bottom = bottom - offset.top;

        if ($el.attr('src') == "assets/img/bender_standing-left.png") {
            var imgSrc = "assets/img/bender_jump-left.png",
                standing = "assets/img/bender_standing-left.png";
        } else {
            var imgSrc = "assets/img/bender_jump.png",
                standing = "assets/img/bender_standing.png";
        }

        $el.attr("src", imgSrc).animate({
            "bottom": "251px"
        }, 400, function() {
            $(this).attr("src", standing);
        }).animate({
            "bottom": "131px"
        }, 400);
    }

    function walkLeft() {
        var offset = $el.offset();

        $el.attr("src", "assets/img/bender_left.png").animate({
            "left": offset.left - 75
        }, 400, function() {
            $(this).attr("src", "assets/img/bender_standing-left.png");
        });
    }

    function walkRight() {
        var offset = $el.offset();
        $el.attr("src", "assets/img/bender_right.png").animate({
            "left": offset.left + 75
        }, 400, function() {
            $(this).attr("src", "assets/img/bender_standing.png");
        });

    }

    function idle() {
        $el.attr("src", "assets/img/bending_standing.png");
    }

    // 38 - up
    // 40 - down
    // 37 - left
    // 39 - right

    $(document).bind('keydown', function(e) {
        if (e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 87) { // up
            jump();
        }

        if (e.keyCode == 37 || e.keyCode == 65) { // left
            walkLeft();
        }

        if (e.keyCode == 39 || e.keyCode == 68) { // right
            walkRight();
        }

        if (e.keyCode == 40 || e.keyCode == 83) { // down
            angry();
        }
    });
});
