url = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

document.addEventListener('DOMContentLoaded', () => {
    fetch(url).then(response => response.json()).then(data => {
        let main_html = document.getElementsByTagName('main')[0];
        main_html.innerHTML = `
        <div class="text-center p-4">
            <h2>Productos</h2>
            <p class="lead">Verás aquí todos los productos de la categoría ${data.catName}</p>
        </div>
        ` + main_html.innerHTML;
        
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
        document.getElementsByTagName('main')[0].children[1].innerHTML = html_content;
        // Se accede al tag <div class = 'container'>, ya que el primer hijo del tag name es 
        // el div donde se encuentra el titulo
    })
})

