const book = '/books/prs/pr/'

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id > 0) {
       
        get_book_view(book+id);
    }
});

function get_book_view(book_id) {

    fetch(book_id)
        .then(response =>{
            if(!response.ok) {
                throw new Error('')
            }
            return response.json()
        })
        .then(data => {
            add_book_detail(data)
        })
        .catch(error => {
            console.error(error)
        })
}

function add_book_detail(data){
    const book_div = document.getElementById('bookdetail')

    const div1 = document.createElement('div')
    div1.className = 'row gx-4 gx-lg-5 align-items-center'

    const div2 = document.createElement('div')
    div2.className = 'col-md-6'

    const img = document.createElement('img')
    img.className = 'card-img-top mb-5 mb-md-0'
    img.src = data.img
    img.alt = 'Book Image'

    const div3 = document.createElement('div')
    div3.className = 'col-md-6'

    const divauth =document.createElement('div')
    divauth.style.display = "flex"
    divauth.style.gap = "10px"

    const div4 = document.createElement('div')
    div4.className = 'small mb-1'
    div4.textContent = data.authour

    const authimg = document.createElement('img')
    authimg.src = "/static/assets/authim.svg"
    authimg.width = 30

    const h1 = document.createElement('h1')
    h1.className = 'display-5 fw-bolder'
    h1.textContent = data.title

    const div5 = document.createElement('div')
    div5.className = 'fs-5 mb-5'

    const span1 = document.createElement('span')
    span1.textContent = `${data.duration}  دقیقه`
    span1.dir = 'rtl'

    const duimg = document.createElement('img')
    duimg.src = "/static/assets/clock.svg"
    duimg.width = 30

    const p =document.createElement('p')
    p.textContent = data.description
    p.dir = 'rtl'

    const div6 = document.createElement('div')
    div6.className = 'd-flex'
    
    const button = document.createElement('a')
    button.className = 'btn btn-outline-dark flex-shrink-0'
    button.type = 'button'
    button.textContent = `پخش`
    button.dir = 'rtl'

    button.addEventListener('click', function() {
        openPopup('playerPopup')
        const audioPlayer = document.getElementById('audioPlayer');
        const speedButton2 = document.getElementById('speedButton2');
        const speedButton15 = document.getElementById('speedButton15');

        const speedButton1 = document.getElementById('speedButton1');

        audioPlayer.innerHTML = `<source src="${data.Audio}"  type="audio/mpeg">`

        function togglePlay() {
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
        function setSpeed2() {
            audioPlayer.playbackRate = 2.0;
        }
        function setSpeed1() {
            audioPlayer.playbackRate = 1.0;
        }
        function setSpeed15() {
            audioPlayer.playbackRate = 1.5;
        }

        audioPlayer.addEventListener('click', togglePlay);
        speedButton2.addEventListener('click', setSpeed2);
        speedButton15.addEventListener('click', setSpeed15);
        speedButton1.addEventListener('click', setSpeed1);

    })

   

    const cart = document.createElement('img')
    cart.src = "/static/assets/play.svg"
    cart.width = 30

    const summ = document.createElement('a')
    summ.className = 'btn btn-outline-dark flex-shrink-0'
    summ.type = 'button'
    summ.textContent = `خلاصه`
    summ.dir = 'rtl'

    summ.addEventListener('click', function() {
        openPopup('summaryPopup')
    })

    const summm = document.createElement('img')
    summm.src = "/static/assets/summ.svg"
    summm.width = 30

    summ.appendChild(summm)
    div6.appendChild(summ)
    button.appendChild(cart)
    div6.appendChild(button)
    div5.appendChild(duimg)
    div5.appendChild(span1)
    divauth.appendChild(authimg)
    divauth.appendChild(div4)
    div3.appendChild(divauth)
    div3.appendChild(h1)
    div3.appendChild(div5)
    div3.appendChild(p)
    div3.appendChild(div6)
    div2.appendChild(img)
    div1.appendChild(div2)
    div1.appendChild(div3)
    book_div.appendChild(div1)
}

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


function openPopup(popupId) {
    
    
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });

    
    document.getElementById(popupId).style.display = 'block';
}