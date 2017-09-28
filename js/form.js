var constants = {};
var leadCountryId = {};
var urlParams = {};

$(document).ready(function () {

  $.when($.getJSON('json/constants.json')).then(function (data) {
    constants = data;
    constants.landingPage = window.location.origin;
    $('#topForm').attr('action', data['redirectUrl']);
    $('#bottomForm').attr('action', data['redirectUrl']);
  });

  //parse GET params
  function updateGetParams() {
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
  updateGetParams();

  // make GET string from object
  function serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  };

  //parse url params
  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

  // send info to server and get result
  function sendData_s(params) {
    $('button').attr('disabled', 'disabled');
    if (!params) {
      return false;
    }
    var http = new XMLHttpRequest();

    var url = constants.apiUrl;
    params.projectId = constants.projectId;
    params.landingPage = constants.landingPage;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function () {
      if (http.readyState == 4) {
        if (http.status != 200 && http.status != 201) {
          return true;
        } else {
          var result = JSON.parse(http.responseText);
          if (result.operation_status === 'succeed') {
            $('#myModal').modal();
            var getParamObj = {};
            location.href = '/FxProfitCodeBot.zip';
            if (result.data.token) {
              getParamObj.token = result.data.token;
            }
            if (Number.isInteger(result.data)) {
              getParamObj.id = result.data;
            }
            if (params.firstName) {
              getParamObj.firstName = params.firstName;
            }
            if (params.email) {
              getParamObj.email = params.email;
            }
            var getParamString = serialize(getParamObj);
            //location.href = params.action + '?' + getParamString;
            yaLead();
            gaLead();
            $('button').removeAttr("disabled");
          } else {
            $('button').removeAttr("disabled");
          }
          return true;
        }
      }
    }
    http.send(JSON.stringify(params));
  };

  //script of validation
  window.applyValidation = function (validateOnBlur, forms, messagePosition, xtraModule) {

    $.validate({
      form: forms,
      language: {
        requiredFields: 'Required field'
      },
      validateOnBlur: true,
      errorMessagePosition: 'top',
      scrollToTopOnError: true,
      lang: 'ru',
      modules: 'html5',
      onModulesLoaded: function () {

      },
      onValidate: function ($f) {

        //console.log('about to validate form ' + $f.attr('id'));

        var $callbackInput = $('#callback');
        if ($callbackInput.val() == 1) {
          return {
            element: $callbackInput,
            message: 'This validation was made in a callback'
          };
        }

        return false;

      },
      onError: function ($form) {
        //alert('Invalid ' + $form.attr('id'));
        return false;
      },
      onSuccess: function ($form) {
        updateGetParams();
        var fields = $form.serializeArray();
        var params = {};
        params = urlParams;

        params.landingPage = constants.landingPage
        $.each(fields, function (index, val) {
          params[val.name] = val.value;
        });

        if (params.leadPhone) {
          params.leadPhone = params.leadPhone.replace(/[^0-9]+/g, "");
        }

        params.action = constants.redirectUrl;
        params.leadPassword = '00000000';
        params.lastName = 'LeadUser';
        params.leadCurrency = 'USD';
        sendData_s(params);
        return false;
      }
    });
  };

  window.applyValidation(true, 'form', $('#error-container'));

});