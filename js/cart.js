navbarConfig();

let user_id = 25801;
let url = CART_INFO_URL + `${user_id}` + EXT_TYPE
let subtotalAll = document.getElementById("productCostValue");
let shippingMethod = document.getElementById("shippingValue");
let totalCost = document.getElementById("totalCostValue");

function subtotalSum(valuesForEach){
    let exchange = 40;
    let sum = 0;
    for (let string of valuesForEach){
        let currencyOfCost = string.innerText.slice(0,3);
        let cost = parseInt(string.innerText.slice(5));
        if (currencyOfCost == "USD"){
            sum += cost;
        } else {
            sum += Math.round((cost/exchange));
        }
    }
    subtotalAll.innerText = `USD ${sum}`;
}

document.addEventListener("DOMContentLoaded", function(){
    getJSONData(url).then(result =>{
        activeCart = JSON.parse(localStorage.getItem("cartList"));
        let cartList = [];
        if(activeCart == null || activeCart == []){
            cartList = result.data.articles;
        }
        else{
            cartList = [...result.data.articles,...activeCart];
        }
        cartList.forEach((elem,i)=>{
            let {image,name,unitCost,count,currency} = elem;
            let tableBody = document.getElementById("tableBody");
            let currentRow = document.createElement("tr");
            currentRow.setAttribute("id",`row_${i}`);
            currentRow.innerHTML =`
                <td class="image"><img height=50px src="${image}"></img></td>
                <td class="name">${name}</td>
                <td class="unitcost">${currency} ${unitCost}</td>
                <td class="count"><input value="${count}" type="number" min="1"></td>
                <td class="subtotalForEach">${currency} ${unitCost*count}</td>`;
            tableBody.appendChild(currentRow);
            currentRow.getElementsByTagName("input")[0].addEventListener("input",function(e){
                this.setAttribute("value",parseInt(this.value));
                let subTotal = currentRow.getElementsByClassName("subtotalForEach")[0];
                subTotal.innerHTML = `${currency} ${parseInt(this.value)*parseInt(unitCost)}`;
            })
        })
        let valuesForEach = document.getElementsByClassName("subtotalForEach");
        console.log(valuesForEach);
        subtotalSum(valuesForEach);
        for (let value of valuesForEach){
            value.addEventListener("change",function(e){
                subtotalSum(value);
            })
        }
    })

})

