const cats = '/books/category/'

            document.addEventListener('DOMContentLoaded', () => {
                get_category(cats);
            });

            function get_category(url){
                fetch(url)
                    .then(response =>{
                        if (!response.ok) {
                            throw new response.Error('')
                        }
                        return response.json()
                    })
                    .then(data => {
                        console.log(data)
                        add_category(data)
                    })
                    .catch(error => {
                        console.error(error)
                    })
            }

            function add_category(data){
            
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
                    
                    pPrice.dir = 'rtl';

                    const divCardFooter = document.createElement('div');
                    divCardFooter.className = 'card-footer p-4 pt-0 border-top-0 bg-transparent';

                    const divFooterTextCenter = document.createElement('div');
                    divFooterTextCenter.className = 'text-center';

                    const viewOptionsLink = document.createElement('a');
                    viewOptionsLink.className = 'btn btn-outline-dark mt-auto';
                    viewOptionsLink.href = "/books/cats/detail/?id="+element.id +'&title='+element.title;
                    viewOptionsLink.textContent = 'مشاهده کتاب ها';

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