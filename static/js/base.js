const users = 'users/'


window.onscroll = function() {
    showBackToTopButton();
  };
////////////////////////////////////////////////////////////////////////////////////////
  
function showBackToTopButton() {
    const button = document.getElementById("backToTopBtn");
  
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  }
  
  function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
////////////////////////////////////////////////////////////////////////////////////////

function openPopup(popupId) {
    if (popupId == 'loginPopup') {
      closePopup('signupPopup')
    }
    
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });

    
    document.getElementById(popupId).style.display = 'block';
}
////////////////////////////////////////////////////////////////////////////////////////

function closePopup(popupId) {
    
    document.getElementById(popupId).style.display = 'none';
}


////////////////////////////////////////////////////////////////////////////////////////

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
}
////////////////////////////////////////////////////////////////////////////////////////

function signup(){
    var username = document.getElementById('signupUsername').value;
    var phoneNumber = document.getElementById('signupPhoneNumber').value;
    var password1 = document.getElementById('signupPassword1').value;
    var password2 = document.getElementById('signupPassword2').value;

    if (password1 !== password2) {
        displayAlert('رمز عبور‌ها مطابقت ندارند.', 'danger');
        return;
      }

    var data = {
        phone_number: phoneNumber,
        username: username,
        password: password1
      };

    var csrftoken = getCookie('csrftoken');

    fetch('/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRFToken': csrftoken 
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
            displayAlert('ثبت نام موفقیت‌آمیز بود.', 'success');
            window.location.href = '/';
        } else {
            displayAlert('ثبت نام ناموفق بود. لطفا دوباره امتحان کنید.', 'danger');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        displayAlert('ثبت نام ناموفق بود. لطفا دوباره امتحان کنید.', 'danger');
      });
}
////////////////////////////////////////////////////////////////////////////////////////

function displayAlert(message, type) {
    var alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-' + type + ' alert-dismissible fade show';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = message + 
    '<a class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"><img src="../static/assets/close.svg" width="30px"></span></a>';
    document.getElementById('alertContainer').appendChild(alertDiv);
  }
////////////////////////////////////////////////////////////////////////////////////////

function login() {
    var phoneNumber = document.getElementById('loginPhoneNumber').value;
    var password = document.getElementById('loginPassword').value;
  
    var data = {
      phone_number: phoneNumber,
      password: password
    };
  
    var csrftoken = getCookie('csrftoken');
  
    fetch('/users/signin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRFToken': csrftoken 
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        displayAlert('ورود موفقیت‌آمیز بود.', 'success');
        window.location.href = '/';
      } else {
        displayAlert('ورود ناموفق بود. لطفا دوباره امتحان کنید.', 'danger');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      displayAlert('ورود ناموفق بود. لطفا دوباره امتحان کنید.', 'danger');
    });
}
////////////////////////////////////////////////////////////////////////////////////////
function changepass() {
  var oldpass = document.getElementById('oldpassword').value;
  var newpassword1 = document.getElementById('newpassword1').value;
  var newpassword2 = document.getElementById('newpassword2').value;

  if (newpassword2 !== newpassword1) {
    displayAlert('رمز عبور‌ها مطابقت ندارند.', 'danger');
    return;
  }

  var data = {
    old_password: oldpass,
    new_password: newpassword1
  };

  var csrftoken = getCookie('csrftoken');

  fetch('/users/change-pass/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRFToken': csrftoken 
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      displayAlert('رمز عبور با موفقیت تغییر کرد', 'success');
      window.location.reload();
    } else {
      displayAlert('متاسفانه خطایی رخ داده است ،دوباره تلاش کنید', 'danger');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    displayAlert('متاسفانه خطایی رخ داده است ،دوباره تلاش کنید', 'danger');
  });
}
////////////////////////////////////////////////////////////////////////////////////////

function signout(){
  var csrftoken = getCookie('csrftoken');

  fetch('/users/signout/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRFToken': csrftoken 
    },
  
  })
  .then(response => {
    window.location.href = '/'
    if (response.ok) {
      displayAlert('خروج از حساب موفقیت آمیز بود', 'success');
      window.location.reload();
    } else {
      displayAlert('خروج ناموفق بود. لطفا دوباره امتحان کنید.', 'danger');
      // window.location.href = '/';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    displayAlert('خروج ناموفق بود. لطفا دوباره امتحان کنید.', 'danger');
    // window.location.href = '/';
  });
  // window.location.href = '/';
}
////////////////////////////////////////////////////////////////////////////////////////
function togglePasswordVisibility(passwordFieldId) {
  var passwordField = document.getElementById(passwordFieldId);
  var toggleButton = document.querySelector('#' + passwordFieldId + ' ~ .toggle-password');

  if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleButton.innerHTML = `<img src="/static/assets/hide.svg" width="30px">`
  } else {
      passwordField.type = "password";
      toggleButton.innerHTML = `<img src="/static/assets/show.svg" width="30px">`
  }
}
////////////////////////////////////////////////////////////////////////////////////////
