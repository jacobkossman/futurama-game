$(document).ready(function() {
    var bgMusic = document.getElementById('bg-music'),
        score = 0,
        lives = 2,
        $el = $('#bender'),
        cssPosition = $el.css('position'),
        playing = false,
        won = false;

    bgMusic.volume = 0.4;

    function resetGame() {
        $("#barrel").css({
            "left": "1200px"
        });
        $("#barrel2").css({
            "left": "2500px"
        });
        $("#bender").css({
            "left": "100px"
        });
        $(".beer").css({
            "left": "400px",
            "opacity": 1
        });
        $("#barrel, #barrel2, .beer").show();
        $(".shade, #game-over").hide();

        lives = 3;
        score = 0;
        playing = true;

        $(".lives-box h3").html(lives);

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

        $("#barrel").show().animate({
            "left": "-200px"
        }, 7000, "linear", function() {
            $("#barrel").hide().css({
                "left": "1200px"
            });
        });

        $("#barrel2").show().animate({
            "left": "-200px"
        }, 11000, "linear", function() {
            $("#barrel2").hide().css({
                "left": "1800px"
            });
        });

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

        function randomizeBeer(i) {
            var loc = Math.floor((Math.random() * $(window).width()) + 100);
            $(".beer").first().clone().css({
                "left": loc,
                "bottom": "132px",
                "opacity": 1,
                "display": "inline-block"
            }).appendTo("body");
        }

        function checkCollisions_beer(i) {
            var obj = $(".beer")[i],
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
                $("#level-2 #hundreds").html(score);
                if (score >= 3) {
                    youWon();
                } else {
                    randomizeBeer(i++);
                }
            }
        }

        function checkCollisions_barrel() {
            var obj = $("#barrel")[0],
                pos = getPositions(obj),
                pos2 = getPositions("#bender"),
                horizontalMatch = comparePositions(pos[0], pos2[0]),
                verticalMatch = comparePositions(pos[1], pos2[1]),
                match = horizontalMatch && verticalMatch;

            if (match && $("#bender").attr('src') !== "assets/img/bender_angry.png") {
                angry();
                if (lives > 1) {
                    lifeLost();
                    $("#barrel").hide();
                } else {
                    lives = 0;
                    $(".lives-box h3").html(lives);
                    gameOver();
                }
            }
        }

        function checkCollisions_barrel2() {
            var obj = $("#barrel2")[0],
                pos = getPositions(obj),
                pos2 = getPositions("#bender"),
                horizontalMatch = comparePositions(pos[0], pos2[0]),
                verticalMatch = comparePositions(pos[1], pos2[1]),
                match = horizontalMatch && verticalMatch;

            if (match && $("#bender").attr('src') !== "assets/img/bender_angry.png") {
                angry();
                if (lives > 1) {
                    lifeLost();
                    $("#barrel2").hide();
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
            $(".shade, #game-over").show();
            playing = false;
        }


        function youWon() {
            playing = false;
            won = true;
            $(".shade, #you-won").show();
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
                checkCollisions_beer(0);
                if ($(".beer").length > 1) {
                    checkCollisions_beer(1);
                }
                if ($(".beer").length > 2) {
                    checkCollisions_beer(2);
                }
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
                checkCollisions_beer(0);
                if ($(".beer").length > 1) {
                    checkCollisions_beer(1);
                }
                if ($(".beer").length > 2) {
                    checkCollisions_beer(2);
                }
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
            checkCollisions_barrel2();
        }, 250);
    }

    $("#play-game").click(function() {
        init();
    });

    $("#game-over").click(function() {
        resetGame();
    });

    $("#you-won").click(function() {
        window.location.replace("level1.html");
    });

    $(document).bind('keydown', function(e) {
        if (e.keyCode == 77) { // m
            if (bgMusic.volume == 0) {
                bgMusic.volume = 0.4;
            } else {
                bgMusic.volume = 0;
            }
        }

        if (!playing) {
            if (e.keyCode == 80) { // p
                if (won) {
                    window.location.replace("level1.html");
                } else {
                    init();
                }
            }

            if (e.keyCode == 82) { // r
                if (!won) resetGame();
            }
        }
    });
});
