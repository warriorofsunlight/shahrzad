const new_books = '/books/premiumbooks/'

document.addEventListener('DOMContentLoaded', () => {
    
    add_title('کتاب های خریداری شده')
    get_new_books(new_books);
    
});

function add_title(title){
    const div = document.getElementById('titler')
    const h = document.createElement('h1')
    h.textContent = title
    div.appendChild(h)
}

function get_new_books(url){
    fetch(url)
        .then(response =>{
            if (!response.ok) {
                throw new response.Error('')
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
            add_new_book(data)
        })
        .catch(error => {
            console.error(error)
        })
}

function add_new_book(data){
    
    const book_div = document.getElementById('bookview')

    data.forEach(element => {

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
        pPrice.textContent = `${element.authour}`;
        pPrice.dir = 'rtl';

        const divCardFooter = document.createElement('div');
        divCardFooter.className = 'card-footer p-4 pt-0 border-top-0 bg-transparent';

        const divFooterTextCenter = document.createElement('div');
        divFooterTextCenter.className = 'text-center';

        const viewOptionsLink = document.createElement('a');
        viewOptionsLink.className = 'btn btn-outline-dark mt-auto';
        viewOptionsLink.href = "/books/prs/pr/?id="+element.id;
        viewOptionsLink.textContent = 'مطالعه';

        divTextCenter.appendChild(h5);
        divTextCenter.appendChild(pPrice);
        divCardBody.appendChild(divTextCenter);
        divCardFooter.appendChild(divFooterTextCenter);
        divFooterTextCenter.appendChild(viewOptionsLink);
        divCard.appendChild(img);
        divCard.appendChild(divCardBody);
        divCard.appendChild(divCardFooter);
        divCol.appendChild(divCard);
        book_div.appendChild(divCol);

    });
}