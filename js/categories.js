const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let initialCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

navbarConfig();

function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCategoriesArray.length; i++){
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    showCategoriesList();
}

localStorage.setItem('sortAsc','false');
localStorage.setItem('sortDesc','false');
localStorage.setItem('sortByCount','false');

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            initialCategoriesArray = resultObj.data;
            currentCategoriesArray = JSON.parse(JSON.stringify(initialCategoriesArray));
            showCategoriesList()
        }
    });
});

document.getElementById("sortAsc").addEventListener("click", function(){
    if (localStorage.getItem('sortAsc') == 'false'){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
        localStorage.setItem('sortAsc','true');
        localStorage.setItem('sortDesc','false');
        localStorage.setItem('sortByCount','false');
    }
    else{
        currentCategoriesArray = JSON.parse(JSON.stringify(initialCategoriesArray));
        showCategoriesList();
        localStorage.setItem('sortAsc','false');
    }
});

document.getElementById("sortDesc").addEventListener("click", function(){
    if (localStorage.getItem('sortDesc') == 'false'){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
        localStorage.setItem('sortAsc','false');
        localStorage.setItem('sortDesc','true');
        localStorage.setItem('sortByCount','false');
    }
    else{
        currentCategoriesArray = JSON.parse(JSON.stringify(initialCategoriesArray));
        showCategoriesList();
        localStorage.setItem('sortDesc','false');
    }
});

document.getElementById("sortByCount").addEventListener("click", function(){
    if (localStorage.getItem('sortByCount') == 'false'){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
        localStorage.setItem('sortAsc','false');
        localStorage.setItem('sortDesc','false');
        localStorage.setItem('sortByCount','true');
    }
    else{
        currentCategoriesArray = JSON.parse(JSON.stringify(initialCategoriesArray));
        showCategoriesList();
        localStorage.setItem('sortByCount','false');
    }
});

document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";

    minCount = undefined;
    maxCount = undefined;

    showCategoriesList();
});

document.getElementById("rangeFilterCount").addEventListener("click", function(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    //de productos por categoría.
    minCount = document.getElementById("rangeFilterCountMin").value;
    maxCount = document.getElementById("rangeFilterCountMax").value;

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    }
    else{
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    }
    else{
        maxCount = undefined;
    }

    showCategoriesList();
});