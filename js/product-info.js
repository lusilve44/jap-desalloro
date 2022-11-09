navbarConfig();
currentPage("./product-info.html");
checkLoggedUser();

let productInfo;
let productComments;

// Para establecer el carrito
let user_id = 25801;
let url = CART_INFO_URL + `${user_id}` + EXT_TYPE
let firstProduct;

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

function showImages(){ // mas adelante arreglar display de imagenes
    let images = productInfo.images;
    let displayIndicators = document.getElementById('indicators');
    let displayImages = document.getElementById("images");
    let htmlToAppendIndicators = ``;
    let htmlToAppendImages = ``;
    let count = 0;
    for (let image of images){
        if (count == 0){
            htmlToAppendIndicators += `
            <button type="button" data-bs-target="#carouselImages" data-bs-slide-to="${count}" class="active" aria-current="true" aria-label="Slide ${count + 1}"></button>
            `;
            htmlToAppendImages += `
            <div class="carousel-item active">
                <img src="${image}" class="d-block w-100" alt="${productInfo.name}">
            </div>
            `;
            count += 1;
        } else {
            htmlToAppendIndicators += `
            <button type="button" data-bs-target="#carouselImages" data-bs-slide-to="${count}" aria-label="Slide ${count + 1}"></button>
            `;
            htmlToAppendImages += `
            <div class="carousel-item">
                <img src="${image}" class="d-block w-100" alt="${productInfo.name}">
            </div>
            `;
            count += 1;  
        }
    }
    displayIndicators.innerHTML = htmlToAppendIndicators;
    displayImages.innerHTML = htmlToAppendImages;
};

function showProductInfo(){
    let info = document.getElementById("prodInfo");
    let htmlContentToAppend = `
        <div class="p-5 pb-2">
            <h2 class="fw-bold">${productInfo.name}</h2>
            <h3>${productInfo.currency} ${productInfo.cost}</h3>
            <p>${productInfo.soldCount} vendidos</p>
        </div>
        <hr>
        <div class="px-5 py-3">
            <h5 class="fw-bold">Descripción</h5>
            <p>${productInfo.description}</p>
            <h5 class="fw-bold">Categoría</h5>
            <p>${productInfo.category}</p>
        </div>
    `;
    info.innerHTML = htmlContentToAppend;

    let relatedProds = document.getElementById('relatedProds');
    let moreHtmlToAppend = ``;
    for (let product of productInfo.relatedProducts){
        moreHtmlToAppend += `
        <div onclick="setProdID(${product.id})"  style="width: 30%" class="col-md-4 mx-3 list-group-item-action border rounded-3 cursor-active ">
            <div class='container'>
                <img src="${product.image}" alt="${product.name}" class="img-thumbnail p-2" style='border: none;'>
            </div>
            <p class='p-1'>${product.name}</p>
        </div>
        `;
    }
    relatedProds.innerHTML = moreHtmlToAppend;
};

function showComments(){
    let comments = document.getElementById("comentarios");
    htmlContentToAppend = ``;
    for (let comment of productComments){
        let stars = '';
        for (let i = 1; i <= 5; i++){
            if(i <= comment.score){
                stars += `<span class="fa fa-star checked"></span>`
            }
            else{
                stars += `<span class="fa fa-star"></span>`;
            }         
        }
        htmlContentToAppend +=`
            <div class="border cont rounded-3">
                <div class="p-1">
                    <p style="display: inline;">${comment.user} - </p>
                    <p style="display: inline;">${comment.dateTime} - </p>
                    <p style="display: inline;">${stars}</p>
                </div>
                <div class="p-1">
                    <p>${comment.description}</p>
                </div>
            </div>
        `;
    }
    comments.innerHTML = htmlContentToAppend;
};


// Mostrar info del producto
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL + `${localStorage.getItem('prodID')}` + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            productInfo = resultObj.data;
            showImages();
            showProductInfo();
        }
    });

    if (localStorage.getItem('comments of ' + `${localStorage.getItem('prodID')}`) == null){
        getJSONData(PRODUCT_INFO_COMMENTS_URL + `${localStorage.getItem('prodID')}` + EXT_TYPE).then(function(resultObj){
            if (resultObj.status === "ok"){
                productComments = resultObj.data;
                productComments.sort(function (a, b){
                    let dateA = new Date(a.dateTime);
                    let dateB = new Date(b.dateTime);
                    return dateB - dateA
                });
                localStorage.setItem('comments of ' + `${localStorage.getItem('prodID')}`,JSON.stringify(productComments));
                showComments();
            }
        });
    } else{
        productComments = JSON.parse(localStorage.getItem('comments of ' + `${localStorage.getItem('prodID')}`));
        showComments();
    }

});


// Envio comentarios
document.getElementById("enviar").addEventListener("click", ()=>{
    if ((document.getElementById("opinion").value != '') & (document.getElementById("puntacion").selectedIndex != 0)){
        let fecha = new Date(Date.now());
        let comment = {
            dateTime: fecha.toLocaleString("sv-SE"),
            description: document.getElementById("opinion").value,
            product: localStorage.getItem('prodID'),
            score: document.getElementById("puntacion").selectedIndex,
            user: sessionStorage.getItem('currentloggedin_email')
        };
        productComments.unshift(comment);
        localStorage.setItem('comments of ' + `${localStorage.getItem('prodID')}`,JSON.stringify(productComments));
        showComments();
        document.getElementById("opinion").value = '';
        document.getElementById("puntacion").selectedIndex = 0;
    }
});


// Carrito
document.addEventListener("DOMContentLoaded", function(){
    getJSONData(url).then(result =>{
        firstProduct = result.data.articles;
        console.log(firstProduct);
    })
})

document.getElementById("addToCartButton").addEventListener("click",()=>{
    if(productInfo != undefined){
        let activeCart = localStorage.getItem("cartList");    
        activeCart = activeCart ? JSON.parse(activeCart): firstProduct;
        localStorage.setItem("cartList",activeCart);
        let duplicate = activeCart.findIndex(element => element.id == productInfo.id);
        let newProduct = {id:productInfo.id,
            name:productInfo.name,
            count:1,
            unitCost:productInfo.cost,
            currency:productInfo.currency,
            image:productInfo.images[0],
        };
        if(duplicate === -1){
            activeCart = [...activeCart, newProduct];
        }
        else{
            activeCart[duplicate].count = parseInt(activeCart[duplicate].count) + 1;
        }
        console.log(activeCart);
        localStorage.setItem("cartList",JSON.stringify(activeCart));
        
        successful.classList.remove("visually-hidden");
        setTimeout(()=>{successful.classList.add("visually-hidden")},4000);
    }
});