function localbegin(){if(localStorage.usersData)
    {
    let usersData=JSON.parse(localStorage.usersData);
    return usersData;
}
else{
    let usersData=[];
    return usersData;
}
}
let usersData=localbegin();
const addForm=document.querySelector("#addform");
const tableBody=document.querySelector("tbody");
let inputFields=[{name:"customername",value:"value"},
                {name:"customeraddress",value:"value"},
                {name:"phonenumber",value:"value"},
                {name:"initialbalance",value:"value"}];
if(addForm){
addForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const user={};
    inputFields.forEach(function(input){
        user.id=(usersData.length)+5000;
        user[input.name]=addForm.elements[input.name][input.value];
    });
    usersData.push(user);
    window.localStorage.setItem("usersData",JSON.stringify(usersData));
})
}
if(tableBody){
    if(localStorage.usersData){
    usersData.forEach((user,i)=>{
        const tr = create("tr",document.querySelector("tbody"));
        create("td",tr,user.id);
        inputFields.forEach((input)=>{
            const td=create("td",tr,user[input.name]);
        })
        const action=create("td",tr);
        const addOrWithdraw=create("button",action,"add/withdraw","btn btn-primary mx-3");
        const show=create("button",action,"show","btn btn-primary mx-3");
        const edit=create("button",action,"edit","btn btn-primary mx-3");
        const delette=create("button",action,"delete","btn btn-primary mx-3");
        show.addEventListener("click",()=>{
            let arrayoftrans=(JSON.parse(localStorage.transactions))[i];
            if(document.querySelector(".newtable")){document.querySelector(".newtable").remove();}
            let table2=create("table",document.querySelector("section"),"","table table-bordered data newtable");
            let body2=create("tbody",table2)
            arrayoftrans.forEach((process=>{
                let tcSingle=create("tr",body2);
                create("td",tcSingle,process)
            }))
        })
        delette.addEventListener("click",()=>{
            document.querySelector("#data").children[i].remove();
            usersData=JSON.parse(localStorage.usersData);
            usersData.splice(i,1);
            localStorage.setItem("usersData",JSON.stringify(usersData));
        })
        edit.addEventListener("click",()=>{
            window.location.href="edit.html";
            localStorage.setItem("i",i);
        })
        addOrWithdraw.addEventListener("click",(e)=>{
            window.location.href="addorwithdraw.html";
            localStorage.setItem("i",i);
        })
    })
}
else{
    const tr = create("tr",document.querySelector("tbody"),"no users yet ");
}
}
function create(element,parent,textcontent,classes){
    if(parent){
    const ele=document.createElement(element);
    if(textcontent)ele.textContent=textcontent;
    if(classes)ele.classList=classes;
    parent.appendChild(ele);
    return ele;
    }
}
//withdraw-add
let sum=document.querySelector("#sum");
let add=document.querySelector(".addmoney");
let withdraw=document.querySelector(".withdrawmoney");
if(withdraw){
    add.addEventListener("click",()=>{
        let money=parseInt(usersData[parseInt(JSON.parse(localStorage.i))].initialbalance);
        money += parseInt(sum.value);
        usersData[parseInt(JSON.parse(localStorage.i))].initialbalance=money;
        localStorage.setItem("usersData",JSON.stringify(usersData));
        sign("+");
    })
    withdraw.addEventListener("click",()=>{
        let money=parseInt(usersData[parseInt(JSON.parse(localStorage.i))].initialbalance);
        money -= parseInt(sum.value);
        usersData[parseInt(JSON.parse(localStorage.i))].initialbalance=money;
        localStorage.setItem("usersData",JSON.stringify(usersData));
        sign("-");
    })
    const sign=(sign)=>{
        if((localStorage.getItem("transactions"))){
            let transactions=JSON.parse(localStorage.getItem("transactions"));
            let index=parseInt(JSON.parse(localStorage.i));
            if(!transactions[index]){
                let singleCustomer=[];
                singleCustomer.push(`+${sum.value}`);
                transactions[index]=singleCustomer;
            }
            else{
                transactions[index].push(`${sign}${sum.value}`)
            }
            localStorage.setItem("transactions",JSON.stringify(transactions))
        }
        else{
            let transactions=[];
            let singleCustomer=[];
            singleCustomer.push(`+${sum.value}`)
            let index=parseInt(JSON.parse(localStorage.i));
            transactions[index]=singleCustomer;
            localStorage.setItem("transactions",JSON.stringify(transactions))
        }
    }
}
const editform=document.querySelector("#editform");
if(editform){
        let indexx=0;
        let elements=[...editform.elements];
        elements.pop();
        elements.forEach((element)=>{
            element.value=JSON.parse(localStorage.usersData)[parseInt(JSON.parse(localStorage.i))][inputFields[indexx].name];
            indexx++;
    })
    console.log(usersData);
    editform.addEventListener("submit",(e)=>{
    e.preventDefault();
    inputFields.forEach((input)=>{
        usersData[parseInt(JSON.parse(localStorage.i))][input.name]=editform.elements[input.name][input.value];
        localStorage.setItem("usersData",JSON.stringify(usersData));
    })
})
}
