// particles.js
if (screen.width > 968) {
  particlesJS.load('particles-js', 'json/particles.json', function () {});
  particlesJS.load('particles-js-knowledge', 'json/particles.json', function () {});
  particlesJS.load('particles-js-bot', 'json/particles.json', function () {});
}

$(document).ready(function () {

  //menu burger
  $('.nav-icon').click(function () {
    $('.nav-list').toggleClass('show');
  });

  if (screen.width <= 968) {
    $('.nav-list-item a').click(function () {
      $('.nav-list').toggleClass('show');
    });
  }

  //circle-bg scaling
  if (screen.width > 1400) {
    $('.who').viewportChecker({
      callbackFunction: function (elem, action) {
        (function swell() {
          if ($('.leftbar .circle-bg').hasClass('swell')) {
            $('.leftbar .circle-bg').removeClass('swell');
          } else {
            $('.leftbar .circle-bg').addClass('swell');
          }
          setTimeout(swell, 30000);
        })();
      }
    });
  }

  //progress circles
  $('.order').circleProgress({
    value: 0,
    size: 65,
    emptyFill: 'transparent',
    insertMode: 'append',
    thickness: 10
  });

  $('.education-list-item').hover(function () {
    $(this).find('.order').circleProgress({
      value: 1,
      fill: {
        color: '#2277ef'
      },
      emptyFill: 'transparent',
      animationStartValue: 0.0,
    });
  }, function () {
    $(this).find('.order').circleProgress({
      value: 0,
      animationStartValue: 1.0
    });
  });

  // slider for comments
  $('.slider').slick({
    infinite: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 10000
  });

  //scroll animation for links and buttons
  $('.btn, .link').click(function () {
    var scroll_el = $(this).attr('href');
    if ($(scroll_el).length != 0) {
      $('html, body').animate({
        scrollTop: $(scroll_el).offset().top - 70 //move to element minus height of header
      }, 800);
    }
    return false;
  });

  if (screen.width > 1750) {
    //mechanism circle
    var pointDeg = {
      p1: {
        sun: 45 * 0,
        countersun: 0
      },
      p2: {
        sun: 45,
        countersun: -315
      },
      p3: {
        sun: 45 * 2,
        countersun: -315 * 2
      },
      p4: {
        sun: 45 * 3,
        countersun: -315 * 3
      },
      p5: {
        sun: 45 * 4,
        countersun: -315 * 4
      },
      p6: {
        sun: 45 * 5,
        countersun: -315 * 5
      },
      p7: {
        sun: 45 * 6,
        countersun: -315 * 6
      },
      p8: {
        sun: 45 * 7,
        countersun: -315 * 7
      }
    }

    function turnMove(elem) {
      var elClass = $(elem).attr('class').split(' ')[1];
      $('.arrow').css('transform', 'rotate(' + pointDeg[elClass].sun + 'deg)');
      $('.circle-white').css('transform', 'rotate(' + (pointDeg[elClass].sun + 135) + 'deg)');
      $('.circle-orange').css('transform', 'rotate(' + (pointDeg[elClass].countersun + 135) + 'deg)');
    }

    $('.point').hover(function () {
      turnMove($(this));
      $('.point').removeClass('point-active');
      $(this).addClass('point-active');
    });

    var start = $('.circle .point:first-child');

    function frame() {
      var el = $('.circle .point-active');
      var nextEl = el.next('.point');

      if ($('.circle').is(':hover')) {
        return;
      } else if (nextEl.length) {
        turnMove(nextEl);
        nextEl.addClass('point-active');
        el.removeClass('point-active');
      } else {
        turnMove(start);
        el.removeClass('point-active');
        start.addClass('point-active');
      }
    }
    setInterval(frame, 2000);
  }
});