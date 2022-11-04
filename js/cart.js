navbarConfig();

let user_id = 25801;
let url = CART_INFO_URL + `${user_id}` + EXT_TYPE
let subtotalAll = document.getElementById("productCostValue");
let shippingValue = document.getElementById("shippingValue");
let shippingMethod;
let shippingOptions = document.getElementsByClassName("radioShippingMethods");
let totalCost = document.getElementById("totalCostValue");


function shippingMethodSelected(){
    for (let option of shippingOptions){
        if (option.checked){
            shippingMethod = parseInt(option.value);
        }
    }
}

function subtotalValues(valuesForEach){
    let exchange = 40;
    let sum = 0;
    for (let string of valuesForEach){
        let currencyOfCost = string.innerText.slice(0,3);
        let cost = parseInt(string.innerText.slice(4));
        console.log(cost);
        if (currencyOfCost == "USD"){
            sum += cost;
        } else {
            sum += Math.round((cost/exchange));
        }
    }
    shippingMethodSelected()
    subtotalAll.innerText = `USD ${sum}`;
    shippingValue.innerText = `USD ${Math.round(sum*(shippingMethod/100))}`;
    totalCost.innerText = `USD ${sum + Math.round(sum*(shippingMethod/100))}`;
}

document.addEventListener("DOMContentLoaded", function(){
    getJSONData(url).then(result =>{
        activeCart = JSON.parse(localStorage.getItem("cartList"));
        let cartList = [];
        if(activeCart == null || activeCart == []){
            cartList = result.data.articles;
        }
        else{
            cartList = activeCart;
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
                <td class="count"><input class="monitorValue" value="${count}" type="number" min="1"></td>
                <td class="subtotalForEach">${currency} ${unitCost*count}</td>`;
            tableBody.appendChild(currentRow);
            currentRow.getElementsByTagName("input")[0].addEventListener("input",function(e){
                this.setAttribute("value",parseInt(this.value));
                let subTotal = currentRow.getElementsByClassName("subtotalForEach")[0];
                subTotal.innerHTML = `${currency} ${parseInt(this.value)*parseInt(unitCost)}`;
                elem.count = this.value;
                localStorage.setItem("cartList", JSON.stringify(cartList));
            })
        })
        let valuesForEach = document.getElementsByClassName("subtotalForEach");
        let inputs = document.getElementsByClassName("monitorValue");
        subtotalValues(valuesForEach);
        for (let input of inputs){
            input.addEventListener("input",function(e){
                valuesForEach = document.getElementsByClassName("subtotalForEach");
                subtotalValues(valuesForEach);
            })
        }
        for (let option of shippingOptions){
            option.addEventListener("change",function(e){
                subtotalValues(valuesForEach);
            })
        }
    })

})
