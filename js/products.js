const ORDER_ASC_BY_PRICE = "min_max$";
const ORDER_DESC_BY_PRICE = "max_min$";
const ORDER_BY_RELEVANCE = "sold_amount";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;

let user = document.getElementById("user-name");
user.innerHTML = `${sessionStorage.getItem('currentloggedin_email')}`;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
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
    window.location = "products-info.html"
}

function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){

            htmlContentToAppend += `
            <div onclick="setProdID(${product.id}) class="list-group-item list-group-item-action cursor-active">
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


document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL + `${localStorage.getItem('catID')}` + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data.products;
            showProductsList();
        }

        document.getElementById('first-child').innerHTML = `
        <div class="text-center p-4">
            <h2>Productos</h2>
            <p class="lead">Verás aquí todos los productos de la categoría ${resultObj.data.catName}</p>
        </div>`;
    });

    
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_RELEVANCE);
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
});