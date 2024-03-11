
$(document).ready(()=>{

    createFilterBar()
    getProductData('GET', 'https://fakestoreapi.com/products')
        .then((dataSet) => { 
            console.log(dataSet)             
            filter(createCatalog(dataSet))
        })
        .catch((e)=>{
            console.log(e)
        })
        
})
      
function getProductData (method, url){
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        xhr.responseType = 'json'
        xhr.onload = ()=>{
            if(xhr.status >= 300) {
                reject('Error obtaining data...')
                return
            }
            resolve(xhr.response)
        }
        xhr.send()
    })
}

function createFilterBar(){
    $('main')
    .append($('<div>').addClass('filter-bar').append(
        `
        <label >Filter by Category: <input id = "category-value" list = "category">
            <datalist id="category">
                <option value="men's clothing"></option>
                <option value="women's clothing"></option>
                <option value="jewelery"></option>
                <option value="electronics"></option>
            </datalist>
        </label>
        `
    )
    .append(`<label >Filter by Price: <p id="price" style ="display:inline"></p> <input id="price-range" value = "1000" type = "range" min= "0" max="1000" step="100"></label>  `)
    .append(
        `
        <label >Sort by Price: <input id = "sort" list = "sortBySalary">
            <datalist id="sortBySalary">
                <option value="Ascending"></option>
                <option value="Descending"></option>
            </datalist>
        </label>
        `
    )
    .append('<input value="Filter" type="button">')
    )
    getPriceFilterValue()
}

function getPriceFilterValue(){
    return new Promise((resolve)=>{
        setInterval(()=>{
            var priceRange = $('#price-range').val()
            //console.log(priceRange)
            $('#price').html(`$${priceRange}`)
            resolve(priceRange)
        },100)
    })
}
  

function createCatalog(dataSet){
    let catalog  = []
    dataSet.forEach(product =>{
        let productCard = {
            body:
            $('<div>').addClass('container').append(
                `        
                <h2>${product.title}</h2>
                <img src="${product.image}">
                <ul class="product-details">
                    <li>Price: $${product.price.toFixed(2)}</li>
                    <li>
                        Description:\n
                        <p>${product.description}</p>              
                    </li>
                    <li>Category: ${product.category}</li>
                    <li>Rating: ${product.rating.rate} &nbsp&nbsp&nbsp&nbsp&nbsp Votes: ${product.rating.count}</li>
                </ul>
            `
            ),
            price : product.price.toFixed(2),
            category : product.category,
            rating :{ rate: product.rating.rate, count: product.rating.count},
            image : product.image
        }
        catalog.push(productCard)
        $('main').append(productCard.body)
    })
    return catalog
}

function filter (catalog){
//How to reset datalistvalues automatically???

    $('input[type="button"]').click(()=>{
        if($('#sort').val() === 'Descending'){
            catalog.sort((a,b)=>{
                let priceA = a.price
                let priceB = b.price
                if(priceA > priceB) return -1
                else if (priceA < priceB) return 1
                else return 0
            })
            catalog.forEach((card)=>{
                $('main').remove(card.body)
            })     
            catalog.forEach((card)=>{ 
                $('main').append(card.body)
            })  
        }
        else if($('#sort').val() === 'Ascending'){
            //$('main').empty()
            catalog.sort((a,b)=>{
                let priceA = a.price
                let priceB = b.price
                if(priceA < priceB) return -1
                else if (priceA > priceB) return 1
                else return 0
            })
            catalog.forEach((card)=>{
                $('main').remove(card.body)
            })   
            catalog.forEach((card)=>{
                $('main').append(card.body)
            })  
        }

        getPriceFilterValue().then((price)=>{

            catalog.forEach((card)=>{ 
                let categoryFilter = (card.category === $('#category-value').val())
                let priceFilter = (parseInt(card.price) <= parseInt(price))
                if(priceFilter && categoryFilter)
                    $(card.body).show()                  
                else if($('#category-value').val() === '' && priceFilter)                  
                    $(card.body).show()
                else $(card.body).hide()
            }) 
        })
    })       
    
}

