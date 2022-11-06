navbarConfig();

let user_id = 25801;
let url = CART_INFO_URL + `${user_id}` + EXT_TYPE

let street = document.getElementById("inputCalle");
let number = document.getElementById("inputNumero");
let secondStreet = document.getElementById("inputEsquina");

let subtotalAll = document.getElementById("productCostValue");
let shippingValue = document.getElementById("shippingValue");
let shippingMethod;
let shippingOptions = document.getElementsByClassName("radioShippingMethods");
let totalCost = document.getElementById("totalCostValue");

let paymentOptions = document.getElementsByClassName("paymentOptions");
let optionSelected = document.getElementById("metodoSeleccionado");
let creditCard = document.getElementById("inputTarjeta");
let securityCode = document.getElementById("inputCodigo");
let expirationDate = document.getElementById("inputVencimiento");
let accountNo = document.getElementById("inputCuenta");

let confirmation = document.getElementById("finalizar");
let successful = document.getElementById("successful");
let error = document.getElementById("error");

let trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>`;

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
        if (currencyOfCost == "USD"){
            sum += cost;
        } else {
            sum += Math.round((cost/exchange));
        }
    }
    shippingMethodSelected();
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
        function addRefresh(){
            cartList.forEach((elem,i)=>{
                let {id,image,name,unitCost,count,currency} = elem;
                let tableBody = document.getElementById("tableBody");
                let currentRow = document.createElement("tr");
                currentRow.setAttribute("id",`${id}`);
                currentRow.innerHTML =`
                    <td class="image"><img height=50px src="${image}"></img></td>
                    <td class="name">${name}</td>
                    <td class="unitcost">${currency} ${unitCost}</td>
                    <td class="count"><input class="monitorValue" value="${count}" type="number" min="1"></td>
                    <td class="subtotalForEach">${currency} ${unitCost*count}</td>
                    <td><button type="button" class="btn btn-outline-danger deleteItem" name=${id}>${trashIcon}</button></td>
                    `;
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

            let deleteItems = document.getElementsByClassName("deleteItem");
            for (let item of deleteItems){
                item.addEventListener("click",function(e){
                    for (let prod of cartList){
                        if (prod.id == this.name){
                            let prodIndex = cartList.indexOf(prod);
                            cartList.splice(prodIndex,1);
                            localStorage.setItem("cartList",JSON.stringify(cartList));
                            document.getElementById("tableBody").innerHTML = ``;
                            addRefresh();
                            deleteItems = document.getElementsByClassName("deleteItem");
                        }
                    }
                })
            }
        }

        addRefresh();

        paymentOptions[0].addEventListener("change",function(e){
            if (this.checked){
                creditCard.disabled = false;
                securityCode.disabled = false;
                expirationDate.disabled = false;
                accountNo.disabled = true;

                creditCard.required = true;
                securityCode.required = true;
                expirationDate.required = true;
                accountNo.required = false;

                optionSelected.innerText = "Tarjeta de crédito";
            } else{
                creditCard.disabled = true;
                securityCode.disabled = true;
                expirationDate.disabled = true;
                accountNo.disabled = false;

                creditCard.required = false;
                securityCode.required = false;
                expirationDate.required = false;
                accountNo.required = true;

                optionSelected.innerText = "Transferencia bancaria";
            }
        })

        paymentOptions[1].addEventListener("change",function(e){
            if (this.checked){
                creditCard.disabled = true;
                securityCode.disabled = true;
                expirationDate.disabled = true;
                accountNo.disabled = false;

                creditCard.required = false;
                securityCode.required = false;
                expirationDate.required = false;
                accountNo.required = true;

                optionSelected.innerText = "Transferencia bancaria";
            } else{
                creditCard.disabled = false;
                securityCode.disabled = false;
                expirationDate.disabled = false;
                accountNo.disabled = true;
                
                creditCard.required = true;
                securityCode.required = true;
                expirationDate.required = true;
                accountNo.required = false;

                optionSelected.innerText = "Tarjeta de crédito";
            }
        })

        confirmation.addEventListener("click",function(e){
            document.getElementById('formCart').classList.add("was-validated");
            document.getElementById('paymentModal').classList.add('was-validated');

            if (!paymentOptions[0].checked && !paymentOptions[1].checked){
                document.getElementById('div-texto-check').classList.remove('visually-hidden');
            } else{
                document.getElementById('div-texto-check').classList.add('visually-hidden');
            }

            paymentOptions[0].addEventListener("change",function(e){
                if (this.checked && !paymentOptions[1].checked){
                    document.getElementById('div-texto-check').classList.add('visually-hidden');
                } else {
                    document.getElementById('div-texto-check').classList.remove('visually-hidden');
                }
            })

            paymentOptions[1].addEventListener("change",function(e){
                if (this.checked && !paymentOptions[0].checked){
                    document.getElementById('div-texto-check').classList.add('visually-hidden');
                } else {
                    document.getElementById('div-texto-check').classList.remove('visually-hidden');
                }
            })

            function checkInputs(inputs){
                let isInvalid = false;
                for (let input of inputs){
                    if ((input.value <= 0) || (input.value == NaN)){
                        isInvalid = true;
                    }
                }
                return isInvalid;
            }

            function checking(checks){
                let output = true;
                for (let check of checks){
                    if (check.value.length === 0){
                        output = false;
                    }
                }
                return output;
            }

            let inputs = document.getElementsByClassName("monitorValue");
            let invalidCounts = checkInputs(inputs);

            if (paymentOptions[0].checked){
                let checks1 = [street,number,secondStreet,creditCard,securityCode,expirationDate];
                let result1 = checking(checks1);
                if (!invalidCounts && result1){
                    console.log("holi");
                    successful.classList.remove("visually-hidden");
                    setTimeout(()=>{successful.classList.add("visually-hidden")},4000);
                } else{
                    error.classList.remove("visually-hidden");
                    setTimeout(()=>{error.classList.add("visually-hidden")},4000);
                }
            } else if (paymentOptions[1].checked){
                let checks2 = [street,number,secondStreet,accountNo];
                let result2 = checking(checks2);
                if (!invalidCounts && result2){
                    successful.classList.remove("visually-hidden");
                    setTimeout(()=>{successful.classList.add("visually-hidden")},4000);
                } else{
                    error.classList.remove("visually-hidden");
                    setTimeout(()=>{error.classList.add("visually-hidden")},4000);
                }
            } else {
                error.classList.remove("visually-hidden");
                setTimeout(()=>{error.classList.add("visually-hidden")},4000);
            }

        })
    })

})