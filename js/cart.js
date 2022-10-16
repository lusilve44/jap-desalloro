navbarConfig();

let user_id = 25801;
let url = CART_INFO_URL + `${user_id}` + EXT_TYPE

document.addEventListener("DOMContentLoaded", function(){
    getJSONData(url).then(result =>{
        console.log(result);
        activeCart = JSON.parse(localStorage.getItem("cartList"));
        let cartList = [];
        if(activeCart == null || activeCart == []){
            cartList = result.data.articles;
        }
        else{
            cartList = [...result.data.articles,...activeCart];
        }
        cartList.forEach((elem,i)=>{
            let {image,name,unitCost,count} = elem;
            let tableBody = document.getElementById("tableBody");
            let currentRow = document.createElement("tr");
            currentRow.setAttribute("id",`row_${i}`);
            currentRow.innerHTML =`
                <td class="image"><img height=50px src="${image}"></img></td>
                <td class="name">${name}</td>
                <td class="unit-cost">${unitCost}</td>
                <td class="count"> <input value="${count}" type="number" min="1"></td>
                <td class="subtotal">${unitCost*count}</td>`
            tableBody.appendChild(currentRow);
            currentRow.getElementsByTagName("input")[0].addEventListener("change",function(e){
                let subTotal = currentRow.getElementsByClassName("subtotal")[0];
                let unitCost = currentRow.getElementsByClassName("unit-cost")[0];
                subTotal.innerHTML = `${parseFloat(this.value)*parseFloat(unitCost.innerHTML)}`;
            })
        })
    })
})