
let mealsState = []

const stringToHtml = (s) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(s, 'text/html')

    return doc.body.firstChild
}

const renderItem = (item) => {
 const element = stringToHtml(`<li data-id="${item._id}">${item.name}</li>`)
 
 element.addEventListener('click', () => {
    const mealsList = document.getElementById('meals-list')
    Array.from(mealsList.children).forEach(x => x.classList.remove('selected'))
    element.classList.add('selected')
    const mealsIdInput = document.getElementById('meals-id')
    mealsIdInput.value = item._id
 })

 return element   
}

const renderOrder = (order, meals) => {
    const meal = meals.find(meal => meal._id === order.meal_id)
    const element = stringToHtml(`<li data-id="${order._id}">${meal.name} - ${order.user_id}</li>`) 

    return element
}


window.onload = () => {
    const orderForm = document.getElementById('order')
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const submit = document.getElementById('submit')
        submit.setAttribute('disabled', true)
        const mealId = document.getElementById('meals-id')
        const mealIdValue = mealId.value

        if(!mealIdValue){
            alert('Debe seleccionar un plato')
            return
        }

        const order = {
            meal_id: mealIdValue,
            user_id: 'Jose Antonio',
        }

        fetch('https://node-vercel-liard.vercel.app/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(order)
        }).then(x => x.json())
          .then(respuesta => {
            const renderedOrder = renderOrder(respuesta, mealsState )
            const ordersList = document.getElementById('orders-list')
            ordersList.appendChild(renderedOrder)
            submit.removeAttribute('disabled', true)
          })  
    }

    //MEALS
    fetch('https://node-vercel-liard.vercel.app/api/meals')
    .then(response => response.json())
    .then(data => {
        mealsState = data
        const mealsList = document.getElementById('meals-list')
        const listItems = data.map(renderItem)
        mealsList.removeChild(mealsList.firstElementChild)
        listItems.forEach(element => mealsList.appendChild(element))
        submit.removeAttribute('disabled')
        // ORDERS
        fetch('https://node-vercel-liard.vercel.app/api/orders')
        .then(response => response.json())
        .then(ordersData => {
            const ordersLists = document.getElementById('orders-list')
            const listsOrders = ordersData.map(orderData => renderOrder(orderData, data))
            ordersLists.removeChild(ordersLists.firstElementChild)
            listsOrders.forEach(element => ordersLists.appendChild(element))
        })
    })
}