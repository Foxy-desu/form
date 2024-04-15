(function() {
  /* Код компонента пишите здесь */
  const submitBtn = document.querySelector('.submit-btn'),
    SUCCESS_CLASS = 'field-correct',
    ERROR_CLASS = 'field-error';

  function checkPhoneField() {
    const input = document.querySelector('#phone'),
    regex = /^(\+7[ - ]?)?(\(?\d{3}\)?[ - ]?)?[\d\- ]{7,10}$/g;
    function testRegex() {
      const data = input.value,
      result = regex.test(data);

      regex.lastIndex = 0;
      return result;
    }

    function handleClick() {
      const isMatch = testRegex();      
      if(isMatch) {
        input.classList.remove(ERROR_CLASS);
        input.classList.add(SUCCESS_CLASS);
      } else {
        input.classList.remove(SUCCESS_CLASS);
        input.classList.add(ERROR_CLASS);
      }
    }

    submitBtn.addEventListener('click', (e)=> {
      e.preventDefault();
      handleClick();
    });
  }
  checkPhoneField();

  function checkDataField() {
    const checkInField = document.querySelector('#checkin-date'),
    checkOutField = document.querySelector('#checkout-date'),
    minYear = new Date().getFullYear(),
    regexDotted = new RegExp('^([0-9]{2}).([0-9]{2}).([1-2][0-9]{3})$'),
    regexDashed = new RegExp('^([1-2][0-9]{3})-([0-9]{2})-([0-9]{2})$');

    function checkValidity(checkinDate, checkoutDate) {

      function checkDashedDate(date){
        const regexResArr = regexDashed.exec(date),
        year = parseInt(regexResArr[1], 10),
        month = parseInt(regexResArr[2], 10),
        day = parseInt(regexResArr[3], 10);  
        const isValid = dateExistenceCheck(year, month, day);
        return isValid;
      }

      function checkDottedDate(date){
        const regexResArr = regexDotted.exec(date),
        year = parseInt(regexResArr[3], 10),
        month = parseInt(regexResArr[2], 10),
        day = parseInt(regexResArr[1], 10);
        const isValid = dateExistenceCheck(year, month, day);
        return isValid;
      }

      function dateExistenceCheck(year, month, day){
        if(year > minYear || month > 12 || day > 31) {
          return false;
        }        
        const newDate = new Date();
        newDate.setFullYear(year);
        newDate.setMonth(month - 1);
        newDate.setDate(day);

        if(newDate.getFullYear() !== year || newDate.getMonth() !== month - 1 || newDate.getDate() !== day) {
          return false;
        }
        return true;
      }

      function testDateRegex(date) {
        if(date === '') {
          return false;
        }
        if(regexDotted.test(date) === false) {
          if(regexDashed.test(date) === false) {
            return false;
          } else {
            return checkDashedDate(date);
          }
        }
        return checkDottedDate(date);
      }

      function testCheckoutDate() {
        const checkin = getDate(checkinDate),
        checkout = getDate(checkoutDate);        
        function getDate(date) {
          //helps to reverse date string to convert it into date using "new Date()"
          if(date.includes('.')) {
              const reversedDate = date.split('.').reverse().join('.');

              return new Date(reversedDate);
          }
          return new Date(date);
        }

        if(checkin > checkout) {
           return false;
        }     
        const diffTime = Math.abs(checkout - checkin),
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));     
       if (diffDays < 4) {
         return false;
        }
         return true;
      }

      const checkinIsValid = testDateRegex(checkinDate),
      checkoutIsValid = testDateRegex(checkoutDate);
      let checkResult = false;      
      if(checkinIsValid && checkoutIsValid) {
        checkResult = testCheckoutDate(checkinDate, checkoutDate);
      }
      return checkResult
    }

    function handleClick() {
      //apply trim to values in order to get string without whitespaces
      const checkinDate = checkInField.value.trim(),
      checkoutDate = checkOutField.value.trim(),
      isMatch = checkValidity(checkinDate, checkoutDate);      
      if(isMatch) {
        [checkInField,checkOutField].forEach((field) => {
          field.classList.remove(ERROR_CLASS);
          field.classList.add(SUCCESS_CLASS);
        });
      } else {
        [checkInField,checkOutField].forEach((field) => {
          field.classList.remove(SUCCESS_CLASS);
          field.classList.add(ERROR_CLASS);
        });
      }
    }

    submitBtn.addEventListener('click', (e)=> {
      e.preventDefault();
      handleClick();
    });
  }
  checkDataField();

  function checkGuests() {
    const adultsField = document.querySelector('#adults'),
    childrenField = document.querySelector('#children'),
    roomTypes = {
      single: {
        minAdult: 1,
        maxAdult: 1,
        minChildren: 0,
        maxChildren: 1
      },
      double: {
        minAdult: 1,
        maxAdult: 2,
        minChildren: 0,
        maxChildren: 2
      },
      family: {
        minAdult: 2,
        maxAdult: Infinity,
        minChildren: 1,
        maxChildren: Infinity,
      }
    };

    function checkGuestsData() {
      const adultsCount = Number(adultsField.value),
      childrenCount = Number(childrenField.value),
      checkedBtn = document.querySelector('input[name="room-type"]:checked');
      let currRules;

      for(const [key, value] of Object.entries(roomTypes)) {
        if(key === checkedBtn.value) {
          currRules = value;
          break;
        }
      }
      if(Number.isFinite(adultsCount) && Number.isFinite(childrenCount)) {
        if (childrenCount <= adultsCount) {
          if (adultsCount >= currRules.minAdult && adultsCount <= currRules.maxAdult) {
            if (childrenCount >= currRules.minChildren && childrenCount <= currRules.maxChildren) {
              return true;
            }
            return false;
          }
          return false;
        }
        return false;
      }
      return false;
    }

    function handleClick() {
      const isMatch = checkGuestsData();
      if(isMatch) {
        [adultsField, childrenField].forEach((field) => {
          field.classList.remove(ERROR_CLASS);
          field.classList.add(SUCCESS_CLASS);
        });
      } else {
        [adultsField, childrenField].forEach((field) => {
          field.classList.remove(SUCCESS_CLASS);
          field.classList.add(ERROR_CLASS);
        });
      }
    }

    submitBtn.addEventListener('click', (e)=> {
      e.preventDefault();
      handleClick();
    });
  }
  checkGuests();

  function checkboxHandler() {
    const labels = document.querySelectorAll(".custom-radio");

    function handleClick(e){
      labels.forEach((label)=> {
        const currLabel = e.target.closest('label'),
        input = label.previousElementSibling;

        input.removeAttribute('checked');
        if(currLabel.getAttribute('for') === input.id) {
          input.setAttribute('checked', '');
        }
      });
    }

    labels.forEach((label)=> {
      label.addEventListener('click', (e)=> {
        handleClick(e);
      });
    });
  }
  checkboxHandler();

})();
