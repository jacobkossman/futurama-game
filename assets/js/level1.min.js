var bgMusic = document.getElementById('bg-music'),
    score = 0,
    lives = 3,
    $el = $('#ship'),
    cssPosition = $el.css('position'),
    playing = false,
    won = false;

bgMusic.volume = 0.4;

$(document).ready(function() {

    function resetGame() {

        $("#play-game, #game-over, #you-won").hide();

        $("#ship").attr('src', 'assets/img/ship.png')
        $("#planet").css({
            "right": "400px",
            "left": ""
        }).attr('src', 'assets/img/planet.png').show();
        $("#planet2").css({
            "right": "-800px",
            "left": ""
        }).attr('src', 'assets/img/planet.png').show();
        $("#enemy").css({
            "right": "200px",
            "left": ""
        }).attr('src', 'assets/img/omicronian.png').show();

        lives = 3;
        score = 0;

        init();
    }

    function init() {

        playing = true;

        $(".shade, #play-game, #game-over, #you-won").hide();

        setInterval(function() {
            if (playing && !won) {
                gameOver();
            }
        }, 9000);

        function lifeLost() {
            lives--;
            $(".lives-box h3").html(lives);
            $("#ship").css({
                "left": "50px",
                "top": "400px"
            });
            $(".lazer").css({
                "left": "275px",
                "top": "435px"
            });
            $("#ship").show();
        }

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

        function checkCollisions(el) {
            var obj = $("#ship")[0],
                pos = getPositions(obj),
                pos2 = getPositions(el),
                horizontalMatch = comparePositions(pos[0], pos2[0]),
                verticalMatch = comparePositions(pos[1], pos2[1]),
                match = horizontalMatch && verticalMatch;

            if (match) {
                deadExplosion("#ship");
                if (lives > 1) {
                    lifeLost();
                } else {
                    lives = 0;
                    $(".lives-box h3").html(lives);
                    gameOver();
                }
            }
        }

        function gameOver() {
            playing = false;
            $(".shade, #game-over").show();
        }

        function youWon() {
            playing = false;
            won = true;
            $(".shade, #you-won").show();
        }

        function checkCollisions_lazer(el) {
            var obj = $(".lazer"),
                pos = getPositions(obj),
                pos2 = getPositions(el),
                horizontalMatch = comparePositions(pos[0], pos2[0]),
                verticalMatch = comparePositions(pos[1], pos2[1]),
                match = horizontalMatch && verticalMatch;

            if (match) {
                console.log("hit!");
                explosion(el);
            }
        }

        $(".music-controls").click(function() {
            $(this).toggleClass('fa-pause-circle fa-play-circle')
            if ($(this).hasClass('fa-pause-circle')) {
                bgMusic.play();
            } else {
                bgMusic.pause();
            }
        });

        function moveUp() {
            var offset = $el.offset();

            if (offset.top > 100) {
                $el.css({
                    "top": "-=100px"
                }, 500);
                $(".lazer").css({
                    "top": "-=100px"
                }, 500);
            }
        };

        function moveDown() {
            var offset = $el.offset(),
                bottom = $(window).height() - $el.height(),
                bottom = bottom - offset.top;

            if (bottom > 100) {
                $el.css({
                    "top": "+=100px"
                }, 500);
                $(".lazer").css({
                    "top": "+=100px"
                }, 500);
            }
        };

        function moveRight() {
            var offset = $el.offset();

            $el.css({
                "left": "+=50px"
            }, 500)

            $(".lazer").css({
                "left": "+=50px"
            }, 500)
        };

        function moveLeft() {
            var offset = $el.offset();

            if (offset.left > 0) {
                $el.css({
                    "left": "-=50px"
                }, 500);
                $(".lazer").css({
                    "left": "-=50px"
                }, 500);
            }
        };

        function deadExplosion(el) {
            var oldSrc = $(el).attr('src');
            $(el).attr('src', 'assets/img/explosion.gif');

            setTimeout(function() {
                $(el).attr('src', oldSrc);
            }, 500);

            lifeLost();
        };

        function explosion(el) {
            var oldSrc = $(el).attr('src');
            // console.log(oldSrc);
            $(el).attr('src', 'assets/img/explosion.gif');

            $(".lazer").hide().stop(true).css({
                "left": $("#ship").offset().left + 225,
                "top": $("#ship").offset().top + 35,
            });

            score++;
            $("#level-one #hundreds").html(score);

            if (score == 3) {
                youWon();
            }

            setTimeout(function() {
                $(el).hide();
            }, 500);

        };

        function fireLazer() {
            $(".lazer").show().animate({
                "left": "2000px"
            }, 1000, "linear", function() {
                $(".lazer").css({
                    "left": "225px"
                });
            });

            // clearInterval(checkPlanet);
            // clearInterval(checkEnemy);

        }

        var checkPlanet = setInterval(function() {
            if ($(".lazer").is(":visible")) {
                checkCollisions_lazer("#planet");
            }
        }, 150);

        var checkEnemy = setInterval(function() {
            if ($(".lazer").is(":visible")) {
                checkCollisions_lazer("#enemy");
            }
        }, 150);

        var checkPlanet2 = setInterval(function() {
            if ($(".lazer").is(":visible")) {
                checkCollisions_lazer("#planet2");
            }
        }, 150);

        setInterval(function() {
            checkCollisions("#planet");
            checkCollisions("#planet2");
            checkCollisions("#enemy");
        }, 150);

        $("#planet").animate({
            "left": "-300px"
        }, 6000, "linear", function() {
            $(this).hide();
        });

        $("#planet2").animate({
            "left": "-300px"
        }, 6000, "linear", function() {
            $(this).hide();
        });

        $("#enemy").animate({
            "left": "-300px"
        }, 6000, "linear", function() {
            $(this).hide();
        });

        // keyboard shortcuts

        if (playing) {
            $(document).bind('keydown', function(e) {
                if (e.keyCode == 38 || e.keyCode == 87) { // up, w
                    moveUp();
                }

                if (e.keyCode == 40 || e.keyCode == 83) { // down, s
                    moveDown();
                }

                if (e.keyCode == 32) {
                    fireLazer();
                }
            });
        }
    }

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
                    window.location.replace("level2.html");
                } else {
                    init();
                }
            }
            if (e.keyCode == 82) { // r
                resetGame();
            }
        }
    });

    $("#play-game").click(function() {
        init();
    });

    $("#game-over").click(function() {
        resetGame();
    });

    $("#you-won").click(function() {
        window.location.replace("level2.html");
    });

});
