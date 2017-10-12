$(document).ready(function () {
  var constants = {};
  var urlParams = {};
  var leadCountryId = {};

  //get json constants
  $.getJSON('json/constants.json', function (data) {
    constants = data;
    constants.landingPage = window.location.origin;
  });

  //get country phone codes
  $.getJSON('json/countries.json', function (json, textStatus) {
    $.each(json, function (index, val) {
      leadCountryId[val.id] = val.name;
      leadCountryId[val.id].dataCode = val.dataCode;
      $('#country-ru').append('<option value=' + val.id + '>' + val.name.ru + '</option>');
      $('#country-en').append('<option value=' + val.id + '>' + val.name.en + '</option>');
    });
  });

  //select current country by IP
  $.getJSON('https://freegeoip.net/json/', function (data) {
    var current_country;
    $.each(leadCountryId, function (index, val) {
      if (val.en == data.country_name) {
        current_country = index;
        ourLeadCountry = current_country;
      }
    });
    $('#country-ru, #country-en').val(current_country);
    $('#country-ru, #country-en').trigger('change');
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

  // make GET string from object
  function serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  };

  function updateUrlParams() {
    var match,
      pl = /\+/g, // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "));
      },
      query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2]);
  };
  updateUrlParams();

  // get parameters for request
  function getRequestParams() {
    var fields = $('form').serializeArray();
    var params = {};

    updateUrlParams();

    params = urlParams;
    params.landingPage = constants.landingPage;
    params.projectId = constants.projectId;
    params.lastName = constants.lastName;
    params.leadPassword = constants.leadPassword;
    params.leadCurrency = constants.leadCurrency;

    $.each(fields, function (index, val) {
      params[val.name] = val.value;
    });
    return params;
  };

  // send ajax request to a server
  function sendRequest(params) {
    $('button').attr('disabled');
    var http = new XMLHttpRequest();
    var url = constants.apiUrl;

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function () {
      if (http.readyState == 4) {
        if (http.status != 200 && http.status != 201) {
          //IT IS ERROR RESPONSE
          $('button').removeAttr('disabled');
          return true;
        } else {
          //IT IS SUCCESS RESPONSE
          var result = JSON.parse(http.responseText);
          if (result.operation_status === 'succeed') {
            // GET STRING FOR REDIRECT
            // var getParamObj = {};
            // if (result.data.token) {
            //   getParamObj.token = result.data.token;
            // }
            // if (Number.isInteger(result.data)) {
            //   getParamObj.id = result.data;
            // }
            // if (params.firstName) {
            //   getParamObj.firstName = params.firstName;
            // }
            // if (params.email) {
            //   getParamObj.email = params.email;
            // }
            // var getParamString = serialize(getParamObj);
            //location.href = params.action + '?' + getParamString;

            $('button').removeAttr('disabled');
          } else {
            $('button').removeAttr('disabled');
          }
        }
      }
    }
    http.send(JSON.stringify(params));
  }

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
    },
    errorElement: 'span',
    submitHandler: function (form) {
      sendRequest(getRequestParams());
    }
  });
});