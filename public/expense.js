document.addEventListener('DOMContentLoaded',getRecords);
document.getElementById('list').addEventListener('click',deleteExpense);

axios.defaults.headers.common['auth'] = localStorage.getItem('token')

function getRecords(){
    axios.get('/expense/data')
    .then(res=>{
        showOnScreen(res.data);
    }).catch(err=>console.log(err));
}

function showOnScreen(data){
    document.getElementById('list').innerHTML='';
    for(item of data){
        let li = document.createElement('li');
        li.id=item.id;
        let span = document.createElement('span');
        span.innerHTML=`${item.amount} - ${item.description} - ${item.category} `
        li.appendChild(span);
        let delbtn = document.createElement('button');
        delbtn.innerHTML='Delete';
        delbtn.className="delete";
        li.appendChild(delbtn)
        document.getElementById('list').appendChild(li)
    }
}

async function addExpense(e){
    e.preventDefault();
    let obj={
        amount:e.target.amount.value,
        description:e.target.description.value,
        category:e.target.category.value
    }
    console.log(obj)
    try{
        let res = await axios.post('/expense/data',obj)
        getRecords();
        let msg = document.getElementById('msg');
        msg.style='color:green';
        msg.innerHTML=res.data.message;
        setTimeout(() =>msg.innerHTML='' ,2000);
        e.target.amount.value='';
        e.target.description.value='';
        e.target.category.value='';
    }catch(err){
        console.log(err)
        let msg = document.getElementById('msg');
        msg.style='color:red';
        msg.innerHTML=err.response.data.message;
        setTimeout(() =>msg.innerHTML='' ,2000);
    }
}

async function deleteExpense(e){
    console.log(e.target.parentElement)
    if(e.target.className=='delete'){
        try{
            let result = await axios.delete(`/expense/delete?id=${e.target.parentElement.id}`)
            getRecords();
            let msg = document.getElementById('msg');
            msg.style='color:green';
            msg.innerHTML=result.data.message;
            setTimeout(() =>msg.innerHTML='' ,2000);
        }catch(err){
            console.log(err)
            let msg = document.getElementById('msg');
            msg.style='color:green';
            msg.innerHTML=err.response.data.message;
            setTimeout(() =>msg.innerHTML='' ,2000);
        }
    }
}