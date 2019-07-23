// private functions

var attributionKeyFirstClickKey = 'fc_attr_v1';
var attributionKeyLastClickKey = 'lc_attr_v1';

var parseQueryString = function (queryString) {
  var params = {}, queries, temp, i, l;
  queries = queryString.split("&");
  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }
  return params;
};

var getAttributionDefaultObject = function () {
  return {
    network: '',
    campaignid: '',
    adgroupid: '',
    adid: '',
    keyword: '',
    adposition: '',
    device: '',
    landing: '',
    gclid: '',
    fbclid: '',
    adposition: '',
    loc_interest_ms: '',
    loc_physical_ms: '',
    landing: window.location.href
  }
}

var setCookie = function (name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

var getCookie = function (name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

var convertObjectToCookieString = function (obj) {
  return encodeURIComponent(JSON.stringify(obj));
}

// create attribution object
var queryString = window.location.search.substring(1);
var queryStringParams = parseQueryString(queryString);
var attributionObject = getAttributionDefaultObject();
var attributionKeys = Object.keys(attributionObject);

attributionKeys.forEach(function (akey) {
  var result = queryStringParams[akey];
  if (result === undefined) { return; }
  attributionObject[akey] = result;
});

// set attribution
var firstClickAttribution = getCookie(attributionKeyFirstClickKey);
if (firstClickAttribution === undefined || firstClickAttribution === null) {
  setCookie(attributionKeyFirstClickKey, convertObjectToCookieString(attributionObject), 30); //expires in 30 days
}

let referrer = document.referrer;
if (referrer.indexOf(location.protocol + "//" + location.host) === 0) {
  var lastClickAttr = getCookie(attributionKeyLastClickKey);
  if (lastClickAttr === undefined || lastClickAttr === null) {
    var defaultAttributionObject = getAttributionDefaultObject();
    setCookie(attributionKeyLastClickKey, convertObjectToCookieString(defaultAttributionObject), 30);
  }
} else {
  setCookie(attributionKeyLastClickKey, convertObjectToCookieString(attributionObject), { expires: 30 });
}

