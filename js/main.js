// particles.js
particlesJS.load('particles-js', 'libs/particles/particles.json', function () {
  console.log('callback - particles.js config loaded');
});
particlesJS.load('particles-js-bot', 'libs/particles/particles.json', function () {
  console.log('callback - particles.js config loaded');
});

$(document).ready(function () {
  // validation
  $('form').validate({
    rules: {
      firstName: {
        required: true,
        minlength: 3,
        maxlength: 30
      },
      email: {
        required: true
      },
      leadPhone: {
        required: true,
        minlength: 9,
        maxlength: 20

      }
    }
  });

  // intl-tel-input
  $('#phone').intlTelInput({
    initialCountry: 'auto',
    autoPlaceholder: true,
    separateDialCode: false,
    autoHideDialCode: false,
    formatOnDisplay: false,
    nationalMode: false,
    geoIpLookup: function (callback) { // phonecode by IP
      $.get('https://ipinfo.io', function () {}, 'jsonp').always(function (resp) {
        var countryCode = (resp && resp.country) ? resp.country : '';
        callback(countryCode);
      });
    }
  });

  // slider for comments
  $('.slider').slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 15000
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

  var leadCountryId = {};

  //getting country phone codes
  if ($('#country').length) {
    $.getJSON('json/countries.json', function (json, textStatus) {
      $.each(json, function (index, val) {
        leadCountryId[val.id] = val.name;
        leadCountryId[val.id].dataCode = val.dataCode;
        $('#country').append('<option value=' + val.id + '>' + val.name.ru + '</option>');
      });
    });

    //select current country
    $.getJSON('https://freegeoip.net/json/', function (data) {
      var current_country;
      $.each(leadCountryId, function (index, val) {
        if (val.en == data.country_name) {
          current_country = index;
          ourLeadCountry = current_country;
        }
      });
      $('#country').val(current_country);
      $('#country').trigger('change');
    })
  };

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
      console.log(el);
      turnMove(nextEl);
      nextEl.addClass('point-active');
      el.removeClass('point-active');
    } else {
      turnMove(start);
      el.removeClass('point-active');
      start.addClass('point-active');
    }
  }

  setInterval(frame, 3000);
});