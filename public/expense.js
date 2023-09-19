document.addEventListener('DOMContentLoaded',()=>{
    getRecords()
    checkPrime()
});
document.getElementById('list').addEventListener('click',deleteExpense);

axios.defaults.headers.common['auth'] = localStorage.getItem('token')

function getRecords(){
    axios.get('http://localhost:5000/expense/data')
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
    try{
        let res = await axios.post('http://localhost:5000/expense/data',obj)
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
            let result = await axios.delete(`http://localhost:5000/expense/delete?id=${e.target.parentElement.id}`)
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

document.getElementById('buy-premium-btn').onclick = async (e)=>{
    let response = await axios.get('http://localhost:5000/payment/buypremium')
    let options = {
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async (response)=>{
            try{
                let res = await axios.post('/payment/paid',{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                })
                alert('You Are a Premium User Now')
                localStorage.setItem("primeStatus",res.data.primeStatus)
                checkPrime()
            }catch(err){
                console.log(err)
            }
        }
    }
    let rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',res=>{
        console.log(res.error.metadata.order_id)
        alert('Something Went Wrong')
        axios.post('http://localhost:5000/payment/failed',{order_id:res.error.metadata.order_id})
        .then(()=>console.log('status set to failed'))
        .catch(e=>console.log(e))
    })
}
function checkPrime(){
    const primeStatus=localStorage.getItem('primeStatus');
    if(primeStatus=='true'){
        document.getElementById('buy-premium-div').innerHTML='';
        const pageHeading = document.getElementById('page-heading');
        pageHeading.innerHTML += '<h3>Welcome Prime Member</h3>';
        let leaderboardbtn = document.createElement('button');
        leaderboardbtn.id='leaderboardBtn'
        leaderboardbtn.innerHTML='Show Leaderboard';
        pageHeading.appendChild(leaderboardbtn);
        pageHeading.innerHTML += '<br>'
        document.getElementById('leaderboardBtn').onclick = showLeaderboard;
    }
}

async function showLeaderboard(){
    try{
        let res = await axios.get('http://localhost:5000/expense/leaderboard')
        let LBlist = document.getElementById('LB-list');
        LBlist.innerHTML='';
        let lbheading = document.createElement('h3');
        lbheading.innerHTML='Leaderboard';
        LBlist.appendChild(lbheading);
        for(entry in res.data){
            let LBlist = document.getElementById('LB-list');
            let li = document.createElement('li');
            li.className = 'LB-entry';
            li.innerHTML = entry+' --> '+res.data[entry];
            LBlist.appendChild(li)
        }
    }
    catch(err){
        console.log(err)
    }
}