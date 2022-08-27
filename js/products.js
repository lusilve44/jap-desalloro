url = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem('catID')}.json`;

let user = document.getElementById("user-name");
user.innerHTML = `${sessionStorage.getItem('currentloggedin_email')}`;

document.addEventListener('DOMContentLoaded', () => {
    fetch(url).then(response => response.json()).then(data => {
        let main_html = document.getElementsByTagName('main')[0];
        main_html.children[0].innerHTML = `
        <div class="text-center p-4">
            <h2>Productos</h2>
            <p class="lead">Verás aquí todos los productos de la categoría ${data.catName}</p>
        </div>`;
        
        list_products = data.products;
        let html_content = '';
        for(i = 0; i < list_products.length; i++){
            let product = list_products[i];
            html_content += `
            <div id='${product.id}' class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <small class="text-muted">${product.soldCount} artículos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
            `;
        }
        main_html.children[2].innerHTML = html_content;
        // Se accede al tag <div class = 'container'>, ya que el primer hijo del tag name es 
        // el div donde se encuentra el titulo
    })
})

