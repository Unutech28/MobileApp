/* eslint-disable */
const validateEmail = val => {
  let isRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    val,
  );
  if (isRegex) {
    let parts = val.split('@');
    let partOne = parts[0].length;
    let partTwo = parts[1].split('.')[0].length;
    return partOne > 0 && partTwo > 1;
  }
  return false;
};

const validateEmoji = text => {
  let reg = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;
  return reg.test(text);
};

const validateMobile = text => {
  // return /^(?:[0-9] ?){6,14}[0-9]$/.test(text);
  if (text.length < 10) {
    return false;
  } else {
    return true;
  }
  /*let mobileRegex = /^(\+|00)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)(\s?\d){1,15}$/ ;
      if(mobileRegex.test(text.trim()) && text.trim().length<15 && text.trim().length>=12)
          return true
      return false*/
};

const validateMobileWithoutCC = val => {
  return /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(
    val,
  );
};

const validateString = val => {
  return /^[a-zA-Z\x20]{3,25}$/.test(val);
};

const validateStringMinimumLength2 = val => {
  return /^[a-zA-Z\x20]{2,25}$/.test(val);
};
// (!,@,#,$,%,^,&,*)
const validatePassword = val => {
  // return /^.{8,}$/.test(val);
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*&#^()])[a-zA-Z\d$@$!%*?&#^()]{8,}$/.test(
    val,
  );
  // return /^(?=.*[A-Za-z])(?=.*d)(?=.*[$@$!%*#?&])[A-Za-zd$@$!%*#?&]{8,}$/.test(val);
  //var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  //return /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*_]\S{5,16}$/.test(val);
  //return^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(val);
  //return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(val);
  // return /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/.test(val);
  //$@$!%*?&
};

const validateNumbers = val => {
  return /^[0-9]{0,}$/.test(val);
};

const validateName = val => {
  return /^.{3,}$/.test(val);
};

const validateOtp = val => {
  return /^.{6,}$/.test(val);
};

const validateYear = val => {
  return /^.{4,}$/.test(val);
};

const validateURL = url => {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
    url,
  );
};

const validatePrice = val => {
  return /^(\d*([.,](?=\d{1}))?\d+)?$/.test(val);
};

const validateAlphaNumberic = val => {
  return /^[a-zA-Z0-9]*$/.test(val);
};

const getNumbericValuesFromString = val => {
  return val.match(/^\d+|\d+\b|\d+(?=\w)/g);
};

const validateDecimalNumbers = val => {
  return /^((\d|[1-9]\d+)(\.\d{0,1})?|\.\d{0,1})$/.test(val);
};

const validateAddress = text => {
  return text.length > 200 ? false : true;
};
/**
 * Method used to remove trailing zeros after decimal point.
 */

const removeTrailingZeros = amount => {
  amount = amount.toString();
  let regEx1 = /^[0]+/; // remove zeros from start.
  let regEx2 = /[0]+$/; // to check zeros after decimal point
  let regEx3 = /[.]$/; // remove decimal point.
  if (amount.indexOf('.') > -1) {
    amount = amount.replace(regEx2, ''); // Remove trailing 0's
    amount = amount.replace(regEx3, '');
  }
  return parseFloat(amount).toFixed(2);
};

function validateIsEmpty(text) {
  var result = false;
  if (text === '' || text === undefined) {
    result = true;
  }
  return result;
}

export {
  validateEmail,
  validateEmoji,
  validateMobile,
  validateMobileWithoutCC,
  validateString,
  validateStringMinimumLength2,
  validatePassword,
  validateNumbers,
  validateIsEmpty,
};
