const ORDER_ASC_BY_PRICE = "min_max$";
const ORDER_DESC_BY_PRICE = "max_min$";
const ORDER_BY_RELEVANCE = "sold_amount";
let currentProductsArray = [];
let initialProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;

navbarConfig();
currentPage("./products.html");
checkLoggedUser();

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_ASC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_RELEVANCE){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){

            htmlContentToAppend += `
            <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
            `;
        }

        document.getElementById('third-child').innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    showProductsList();
}

localStorage.setItem('sortAsc','false');
localStorage.setItem('sortDesc','false');
localStorage.setItem('sortByCount','false');

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL + `${localStorage.getItem('catID')}` + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            initialProductsArray = resultObj.data.products;
            currentProductsArray = JSON.parse(JSON.stringify(initialProductsArray));
            showProductsList();
        }

        document.getElementById('first-child').innerHTML = `
        <div class="text-center p-4">
            <h2>Productos</h2>
            <p class="lead">Verás aquí todos los productos de la categoría ${resultObj.data.catName}</p>
        </div>`;
    });
});

document.getElementById("sortAsc").addEventListener("click", function(){
    if (localStorage.getItem('sortAsc') == 'false'){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
        localStorage.setItem('sortAsc','true');
        localStorage.setItem('sortDesc','false');
        localStorage.setItem('sortByCount','false');
    }
    else{
        currentProductsArray = JSON.parse(JSON.stringify(initialProductsArray));
        showProductsList();
        localStorage.setItem('sortAsc','false');
    }
});

document.getElementById("sortDesc").addEventListener("click", function(){
    if (localStorage.getItem('sortDesc') == 'false'){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
        localStorage.setItem('sortAsc','false');
        localStorage.setItem('sortDesc','true');
        localStorage.setItem('sortByCount','false');
    }
    else{
        currentProductsArray = JSON.parse(JSON.stringify(initialProductsArray));
        showProductsList();
        localStorage.setItem('sortDesc','false');
    }
});

document.getElementById("sortByCount").addEventListener("click", function(){
    if (localStorage.getItem('sortByCount') == 'false'){
        sortAndShowProducts(ORDER_BY_RELEVANCE);
        localStorage.setItem('sortAsc','false');
        localStorage.setItem('sortDesc','false');
        localStorage.setItem('sortByCount','true');
    }
    else{
        currentProductsArray = JSON.parse(JSON.stringify(initialProductsArray));
        showProductsList();
        localStorage.setItem('sortByCount','false');
    }
});

document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterMinPrice").value = "";
    document.getElementById("rangeFilterMaxPrice").value = "";

    minPrice = undefined;
    maxPrice = undefined;

    showProductsList();
});

document.getElementById("rangeFilterPrice").addEventListener("click", function(){
    minPrice = document.getElementById("rangeFilterMinPrice").value;
    maxPrice = document.getElementById("rangeFilterMaxPrice").value;

    if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
        minPrice = parseInt(minPrice);
    }
    else{
        minPrice = undefined;
    }

    if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
        maxPrice = parseInt(maxPrice);
    }
    else{
        maxPrice = undefined;
    }

    showProductsList();
});