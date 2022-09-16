let productInfo;
let productComments;

let user = document.getElementById("user-name");
user.innerHTML = `${sessionStorage.getItem('currentloggedin_email')}`;

function showImages(){
    let images = productInfo.images;
    let list = document.getElementById("images");
    let htmlContentToAppend = ``;
    for (let image of images){
        htmlContentToAppend += `
            <li><img class="img-thumbnail" src=${image}></li>
        `;
    }
    list.innerHTML = htmlContentToAppend;
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
    comments.innerHTML += htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL + `${localStorage.getItem('prodID')}` + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            productInfo = resultObj.data;
            console.log(productInfo);
            showImages();
            showProductInfo();
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL + `${localStorage.getItem('prodID')}` + EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            productComments = resultObj.data;
            console.log(productComments);
            showComments();
        }
    });
});

document.getElementById("enviar").addEventListener("click", ()=>{
    document.getElementById("opinion").value = '';
    document.getElementById("puntacion").selectedIndex = 0;
});