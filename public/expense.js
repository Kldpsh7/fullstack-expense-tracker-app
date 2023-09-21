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
    let headline = document.createElement('h3');
    headline.innerHTML='Your Expenses';
    document.getElementById('list').appendChild(headline)
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
                localStorage.setItem('token',res.data.token)
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
    const token=localStorage.getItem('token');
    const decodedToekn = parseJwt(token);
    if(decodedToekn.prime==true){
        document.getElementById('buy-premium-div').innerHTML='';
        const pageHeading = document.getElementById('page-heading');
        pageHeading.innerHTML += `<h3>Welcome ${decodedToekn.name}</h3>`;
        pageHeading.innerHTML += 'You are a premium member';
        let leaderboardbtn = document.createElement('button');
        leaderboardbtn.id='leaderboardBtn'
        leaderboardbtn.innerHTML='Show Leaderboard';
        let reportBtn = document.createElement('button');
        reportBtn.id='reportBtn';
        reportBtn.innerHTML='Generate Report'
        pageHeading.appendChild(leaderboardbtn);
        pageHeading.appendChild(reportBtn);
        pageHeading.innerHTML += '<br><br>'
        document.getElementById('leaderboardBtn').onclick = showLeaderboard;
        document.getElementById('reportBtn').onclick = generateReport;
    }
}

async function showLeaderboard(){
    try{
        let res = await axios.get('http://localhost:5000/premium/leaderboard')
        console.log(res.data)
        let LBlist = document.getElementById('LB-list');
        LBlist.innerHTML='';
        let lbheading = document.createElement('h3');
        lbheading.innerHTML='Leaderboard';
        LBlist.appendChild(lbheading);
        for(entry of res.data){
            let LBlist = document.getElementById('LB-list');
            let li = document.createElement('li');
            li.className = 'LB-entry';
            li.innerHTML = entry.name+' --> '+entry.totalExpenses;
            LBlist.appendChild(li)
        }
    }
    catch(err){
        console.log(err)
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function generateReport(){
    let reportDiv = document.getElementById('report-div');
    reportDiv.hidden=''
    console.log('Repor;t Generation Started')
}