/****** FILE: themes/neromotion/assets/js/script.js *****/
jQuery(document).ready(function ($) {
    $("[header-theme]").each(function () {
        if ($(window).scrollTop() > $(this).offset().top - $(".header").height() / 2) {
            $(".header").attr('theme', $(this).attr("header-theme"))
        }
    });
   

    $("input[type=email]").on("change", function () {
        if ($(this).val().length) {
            if (validateEmail($(this).val())) {
                $(this).removeClass("invalid");
                $(this).parent().find(".error").html("")
            } else {
                $(this).addClass("invalid");
                $(this).parent().find(".error").html("invalid email address")
            }
        } else {
            $(this).removeClass("invalid");
            $(this).parent().find(".error").html("")
        }
    });
    $(".toggle-menu").click(function () {
        $(".menu-full").show(0, function () {
            $(this).addClass("is-active")
        })
    });
    $(".menu-close").click(function () {
        $(".menu-full").removeClass("is-active");
        setTimeout(function () {
            $(".menu-full").hide()
        }, 250)
    });
    getAllImagesDonePromise().then(function () {
        $("html, body").scrollTop(0);
        var h1l = parseInt($(".hero .front h1").css('left'));
        $(window).scroll(function () {
            if ($(this).scrollTop() > 20) {
                $(".header").addClass("header-mini")
            } else {
                $(".header").removeClass("header-mini")
            }
            $("[header-theme]").each(function () {
                if ($(window).scrollTop() > $(this).offset().top - $(".header").height() / 2) {
                    $(".header").attr('theme', $(this).attr("header-theme"))
                }
            });
            $("[display-type]").each(function () {
                if ($(this).offset().top <= $(window).scrollTop() + $(window).height() + 100) {
                    $(this).addClass($(this).attr("display-type"))
                }
            })
        })
    })
});

function getAllImagesDonePromise() {
    var d = $.Deferred();
    var imgs = $("img");
    imgs.one("load.allimages error.allimages", function () {
        imgs = imgs.not(this);
        if (imgs.length == 0) {
            d.resolve()
        }
    });
    var complete = imgs.filter(function () {
        return this.complete
    });
    complete.off(".allimages");
    imgs = imgs.not(complete);
    complete = undefined;
    if (imgs.length == 0) {
        d.resolve()
    }
    return d.promise()
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
};
/****** FILE: themes/neromotion/assets/js/home.js *****/
jQuery(document).ready(function ($) {
    var percentY = [],
        beginningPoint = [],
        endingPoint = [],
        $target = [];
    $(document).scroll(function () {
        var currY = $(this).scrollTop();
        if (currY >= $('#words').offset().top) {
            $('#words').addClass('fixed')
        } else {
            $('#words').removeClass('fixed')
        }
        if (currY >= $('#projects').offset().top) {
            $('#projects').addClass('fixed')
        } else {
            $('#projects').removeClass('fixed')
        }
        $('.stage-indicator .stage').each(function () {
            var $index = $(this).index();
            beginningPoint[$index] = $(this).offset().top;
            endingPoint[$index] = $(this).height() + beginningPoint[$index];
            percentY[$index] = (currY - beginningPoint[$index]) / (endingPoint[$index] - beginningPoint[$index]);
            if (currY < beginningPoint[$index]) {
                percentY[$index] = 0
            }
            if (currY >= endingPoint[$index]) {
                percentY[$index] = 1
            }
            if ($(this).attr('delay-target')) {
                $(this).css('height', $($(this).attr('delay-target')).outerHeight())
            }
            if (currY < endingPoint[$index] && currY >= beginningPoint[$index]) {
                $(this).addClass("is-current")
            } else {
                $(this).removeClass("is-current")
            }
            if ($(this).find('.stage-item').length) {
                if ($target[$index] === undefined)
                    $target[$index] = [];
                $(this).find('.stage-item').each(function () {
                    if (currY >= $(this).offset().top) {
                        if ($target[$index][$(this).index()] === undefined)
                            $target[$index][$(this).index()] = [];
                        var target = $target[$index][$(this).index()];
                        target.percentY = (currY - $(this).offset().top) / ($(this).offset().top + $(this).height());
                        if (target.percentY >= 1) {
                            target.percentY = 1
                        }
                        if (target.percentY <= 0) {
                            target.percentY = 0
                        }
                        if (target.elem === undefined) {
                            target.elem = $($(this).attr('target'));
                            target.css = []
                        }
                        if ($(this).attr('target-action') == 'to-right') {
                            if (target.css.right === undefined) {
                                target.css.right = parseInt(target.elem.css('right'))
                            }
                            target.elem.css('right', target.css.right - (target.css.right * target.percentY))
                        }
                        if ($(this).attr('target-action') == 'shadow-in') {
                            target.elem.css('box-shadow', '0px 0px 0px ' + 15 * percentY[$index] + 'px #222 inset')
                        }
                        if ($(this).attr('target-action') == 'fade-in') {
                            target.elem.css('opacity', percentY[$index])
                        }
                        if ($(this).attr('target-action') == 'fade-in-quote') {
                            target.elem.css('opacity', percentY[$index])
                        }
                        if ($(this).attr('target-action') == 'fade-out') {
                            target.elem.css('opacity', 1 - percentY[$index])
                        }
                        if ($(this).attr('target-action') == 'fade-out-quote') {
                            target.elem.css({
                                'opacity': 1 - percentY[$index],
                                'transform': 'scale(' + (1 + 1 * percentY[$index]) + ')'
                            })
                        }
                        if ($(this).attr('target-action') == 'fade-up') {
                            target.elem.css({
                                'opacity': 1 - target.percentY,
                                'margin-top': 1 - (200 * target.percentY)
                            })
                        }
                        if ($(this).attr('target-action') == 'scroll-up') {
                            target.elem.css({
                                'top': 0 - (currY - $(this).parent().offset().top)
                            })
                        }
                        if ($(this).attr('target-action') == 'fade-up-photo') {
                            if (target.css.top === undefined) {
                                target.css.top = parseInt(target.elem.css('top'))
                            }
                            target.elem.css({
                                'opacity': percentY[$index],
                                'top': target.css.top - target.css.top * percentY[$index]
                            })
                        }
                        if ($(this).attr('target-action') == 'move-left') {
                            if (target.css.left === undefined) {
                                target.css.left = parseInt(target.elem.css('left'))
                            }
                            target.elem.css('left', target.css.left - (($(window).height() + $(window).width())) * percentY[$index])
                        }
                        if ($(this).attr('target-action') == 'move-right') {
                            if (target.css.right === undefined) {
                                target.css.right = parseInt(target.elem.css('right'))
                            }
                            target.elem.css('right', target.css.right - (($(window).height() + $(window).width())) * percentY[$index])
                        }
                    } else {
                        if ($(this).attr('target-action') == 'shadow-in') {
                            $($(this).attr('target')).css('box-shadow', 'none')
                        }
                        if ($(this).attr('target-action') == 'fade-in') {
                            $($(this).attr('target')).css('opacity', 0)
                        }
                        if ($(this).attr('target-action') == 'fade-in-quote') {
                            $($(this).attr('target')).css('opacity', 0)
                        }
                        if ($(this).attr('target-action') == 'scroll-up') {
                            $($(this).attr('target')).css('top', 0)
                        }
                        if ($(this).attr('target') == '.hero .front h1') {
                            $($(this).attr('target')).css({
                                'margin-top': 0,
                                'opacity': 1
                            })
                        }
                    }
                })
            }
            if (currY >= $(this).offset().top) {
                if ($(this).attr('stage-background-size')) {
                    if ($(this).attr('stage-background-size') == 'half-to-full') {
                        $('.stage-background').css('width', 50 + 50 * percentY[$index] + '%')
                    }
                }
                if ($(this).attr('stage-background-color-begin') && $(this).attr('stage-background-color-end')) {
                    var beginningColor = new $.Color($(this).attr('stage-background-color-begin')),
                        endingColor = new $.Color($(this).attr('stage-background-color-end'));
                    var colorR = beginningColor.red() + ((endingColor.red() - beginningColor.red()) * percentY[$index]),
                        colorG = beginningColor.green() + ((endingColor.green() - beginningColor.green()) * percentY[$index]),
                        colorB = beginningColor.blue() + ((endingColor.blue() - beginningColor.blue()) * percentY[$index]);
                    var colorRGB = new $.Color(colorR, colorG, colorB);
                    $('.stage-background .color-background').animate({
                        backgroundColor: colorRGB
                    }, 0)
                }
            }
            if (currY == 0) {
                $('.stage-background .color-background').removeAttr('style')
            }
        })
    })
});