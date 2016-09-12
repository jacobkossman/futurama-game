$(document).ready(function() {
    var bgMusic = document.getElementById('bg-music'),
        score = 0,
        lives = 1,
        $el = $('#bender'),
        cssPosition = $el.css('position'),
        playing = false;

    bgMusic.volume = 0.4;

    function resetGame() {
        $(".barrel").css({
            "left": "1200px"
        }).show();
        $("#bender").css({
            "left": "100px"
        });
        $(".beer").css({
            "left": "400px"
        });
        $(".shade, #game-over").hide();

        playing = true;

        init();
    }

    function init() {
        playing = true;

        $(".shade, #play-game").hide();

        $(".music-controls").click(function() {
            $(this).toggleClass('fa-pause-circle fa-play-circle')
            if ($(this).hasClass('fa-pause-circle')) {
                bgMusic.play();
            } else {
                bgMusic.pause();
            }
        });

        $(".barrel").show().animate({
            "left": "-200px"
        }, 7000);

        function getPositions(box) {
            var $box = $(box);
            var pos = $box.position();
            var width = $box.width();
            var height = $box.height();
            return [
                [pos.left, pos.left + width],
                [pos.top, pos.top + height]
            ];
        }

        function comparePositions(p1, p2) {
            var x1 = p1[0] < p2[0] ? p1 : p2;
            var x2 = p1[0] < p2[0] ? p2 : p1;
            return x1[1] > x2[0] || x1[0] === x2[0] ? true : false;
        }

        function checkCollisions_beer() {
            var obj = $(".beer")[0],
                pos = getPositions(obj),
                pos2 = getPositions("#bender"),
                horizontalMatch = comparePositions(pos[0], pos2[0]),
                verticalMatch = comparePositions(pos[1], pos2[1]),
                match = horizontalMatch && verticalMatch;

            if (match && ($(obj).is(":visible") || $(obj).find(".plus").is(":hidden"))) {
                $(obj).find('.plus').animate({
                    "opacity": "1",
                    "margin-bottom": "30px"
                }, 200).animate({
                        "opacity": "0"
                    }, 500,
                    function() {
                        $(obj).animate({
                            "opacity": "0"
                        }, 400);
                        $(obj).hide();
                    });
                score++;
                $("#hundreds").html(score);
            }
        }

        function checkCollisions_barrel() {
            var obj = $(".barrel")[0],
                pos = getPositions(obj),
                pos2 = getPositions("#bender"),
                horizontalMatch = comparePositions(pos[0], pos2[0]),
                verticalMatch = comparePositions(pos[1], pos2[1]),
                match = horizontalMatch && verticalMatch;

            if (match && $("#bender").attr('src') !== "assets/img/bender_angry.png") {
                angry();
                if (lives > 1) {
                    lifeLost();
                } else {
                    lives = 0;
                    $(".lives-box h3").html(lives);
                    gameOver();
                }
            }

        }

        function lifeLost() {
            lives--;
            $(".lives-box h3").html(lives);
            $("#bender").css({
                "left": "100px"
            });
        }

        function gameOver() {
            console.log("game over");
            $(".shade, #game-over").show();
            playing = false;
        }

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
                    next();
                })
                .delay(500)
                .queue(function(next) {
                    $(this).attr('src', standing);
                    next();
                });
        }


        function checkHeight(bottom) {
            if (bottom > 131) {
                $el.animate({
                    "bottom": "131px"
                }, 500);
            }
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

            $el.attr("src", imgSrc).stop(true).animate({
                "bottom": "300px"
            }, 400, function() {
                $(this).attr("src", standing);
            }).delay(100).animate({
                "bottom": "131px"
            }, 400);
        }

        function walkLeft() {
            var offset = $el.offset(),
                bottom = $(window).height() - $el.height(),
                bottom = bottom - offset.top;


            $el.attr("src", "assets/img/bender_left.png").stop(true).animate({
                "left": "-=50px"
            }, 400, function() {
                checkCollisions_beer();
                $(this).attr("src", "assets/img/bender_standing-left.png");
            });

            checkHeight(bottom);
        }

        function walkRight() {
            var offset = $el.offset(),
                bottom = $(window).height() - $el.height(),
                bottom = bottom - offset.top;

            $el.attr("src", "assets/img/bender_right.png").stop().animate({
                "left": "+=50px"
            }, 400, function() {
                checkCollisions_beer();
                $(this).attr("src", "assets/img/bender_standing.png");
            });

            checkHeight(bottom);
        }

        function idle() {
            $el.attr("src", "assets/img/bending_standing.png");
        }

        $(document).bind('keydown', function(e) {
            if (e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 87) { // up, spacebar, w
                jump();
            }

            if (e.keyCode == 37 || e.keyCode == 65) { // left, a
                walkLeft();
            }

            if (e.keyCode == 39 || e.keyCode == 68) { // right, d
                walkRight();
            }

            if (e.keyCode == 40 || e.keyCode == 83) { // down, s
                angry();
            }
        });

        setInterval(function() {
            checkCollisions_barrel();
        }, 250);
    }

    $("#play-game").click(function() {
        init();
    });


    $("#game-over").click(function() {
        resetGame();
    });


    $(document).bind('keydown', function(e) {
        if (!playing) {
            if (e.keyCode == 80) { // p
                init();
            }

            if (e.keyCode == 82) { // r
                resetGame();
            }
        }
    });
});
