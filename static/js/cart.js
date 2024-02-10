document.addEventListener('DOMContentLoaded', () => {
    cart();
});

function cart() {

    var csrftoken = getCookie('csrftoken');

    fetch('cart')
    .then(response => response.json())
    .then(data => {
        
        updateCartUI(data)
        // add_cart_item()

        // const total = document.getElementById('total')
        // total.innerHTML = ` مجموع : ${data.total} هزار تومان `

        // const offer = document.getElementById('offer')
        // offer.innerHTML = ` تخفیف : ${(1- data.offer) * 100} درصد`

        // const payable = document.getElementById('payable')
        // payable.innerHTML = ` قابل پرداخت : ${data.payable} هزار تومان `
})
    .catch(error => {
        console.error(error)
    })
}



function add_cart_item(data){

    const total = document.getElementById('total')
    total.innerHTML = ` مجموع : ${(data.total).toFixed(1)} هزار تومان `

    const offer = document.getElementById('offer')
    offer.innerHTML = ` تخفیف : ${((1- eval(data.offer)) * 100).toFixed(0)} درصد`

    const payable = document.getElementById('payable')
    payable.innerHTML = ` قابل پرداخت : ${(data.payable).toFixed(1)} هزار تومان `
    
    const book_div = document.getElementById('bookview')

    data.items.forEach(element => {

        const divCol = document.createElement('div');
        divCol.className = 'col mb-5';

        const divCard = document.createElement('div');
        divCard.className = 'card h-100';

        const img = document.createElement('img');
        img.className = 'card-img-top';
        img.src = element.img;
        img.alt = 'Book Image';

        const divCardBody = document.createElement('div');
        divCardBody.className = 'card-body p-4';

        const divTextCenter = document.createElement('div');
        divTextCenter.className = 'text-center';

        const h5 = document.createElement('h5');
        h5.className = 'fw-bolder';
        h5.textContent = element.title;

        const pPrice = document.createElement('p');
        pPrice.textContent = `${element.price}  هزار تومان`;
        pPrice.dir = 'rtl';

        const divCardFooter = document.createElement('div');
        divCardFooter.className = 'card-footer p-4 pt-0 border-top-0 bg-transparent';

        const divFooterTextCenter = document.createElement('div');
        divFooterTextCenter.className = 'text-center';

        const viewOptionsLink = document.createElement('button');
        viewOptionsLink.type = "button"
        viewOptionsLink.className = 'btn mt-auto';
        viewOptionsLink.onclick = () => deleteCartItem(element.id);
        

        const del = document.createElement('img');
        del.className = 'card-img-top';
        del.src = "/static/assets/del.svg";
        del.alt = 'delete';
        del.height = 30


        divTextCenter.appendChild(h5);
        divTextCenter.appendChild(pPrice);
        divCardBody.appendChild(divTextCenter);
        divCardFooter.appendChild(divFooterTextCenter);
        viewOptionsLink.appendChild(del);
        divFooterTextCenter.appendChild(viewOptionsLink);
        divCard.appendChild(img);
        divCard.appendChild(divCardBody);
        divCard.appendChild(divCardFooter);
        divCol.appendChild(divCard);
        book_div.appendChild(divCol);

    });
}

async function deleteCartItem(itemId) {
    try {
        const csrftoken = getCookie('csrftoken');
        const response = await fetch(`/payments/cart/add/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken 
            },
        });

        if (response.ok) {
          
            const responseData = await response.json();
            updateCartUI(responseData);
        } else {
            console.error('Failed to delete item from cart:', response.status);
        }
    } catch (error) {
        console.error('Error deleting item from cart:', error);
    }
}

function updateCartUI(data) {
    const bookDiv = document.getElementById('bookview');
    bookDiv.innerHTML = '';
    const total = document.getElementById('total')
    const offer = document.getElementById('offer')
    const payable = document.getElementById('payable')

    total.innerHTML = ''
    offer.innerHTML = ''
    payable.innerHTML = ''
    
    add_cart_item(data);
    
}

function Offer() {
    
    let offerToken = document.getElementById("token").value;


    if (!offerToken.trim()) {
        
        return false;
    }

    let requestBody = {
        token: offerToken
    };
    const csrftoken = getCookie('csrftoken');
    fetch('/payments/cart/offer/'+offerToken+'/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': csrftoken 
        },
        body: JSON.stringify(requestBody)
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        window.location.reload();
        console.log(data);
        
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
    return false;
}

function deleteOffer() {
    
    const csrftoken = getCookie('csrftoken');
    fetch('/payments/cart/offer/notoffer/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': csrftoken 
        },
        
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        window.location.reload();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    // 
    return false;
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
function pay(){
    const csrftoken = getCookie('csrftoken');
    fetch('/payments/cart/checkout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRFToken': csrftoken 
        },
        
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        window.location.reload();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    // window.location.reload();
    return false;
}