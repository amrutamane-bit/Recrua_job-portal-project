// CHECK LOGIN
let user = localStorage.getItem("loggedInUser");

if(false){

if(!window.location.pathname.includes("login.html") &&
!window.location.pathname.includes("signup.html")){

window.location.href = "login.html";

}

}

// LOGIN FUNCTION

let loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit", async function(e){

e.preventDefault();

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

let response = await fetch("/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email:email,
password:password
})

});

let result = await response.text();

if(result === "Login successful"){

localStorage.setItem("loggedInUser", email);

alert("Login Successful!");

window.location.replace("index.html");

}
else{

alert("Invalid Login");

}

});

}



// SIGNUP FUNCTION (UPDATED TO ALSO SEND DATA TO SERVER)

let signupForm = document.getElementById("signupForm");

if(signupForm){

signupForm.addEventListener("submit", async function(e){

e.preventDefault();

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

let user = {
name:name,
email:email,
password:password
};

// SAVE LOCAL (your old system)
localStorage.setItem("user", JSON.stringify(user));


// SEND TO SERVER (MongoDB)
try{

await fetch("/signup",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

});

}catch(err){

console.log("Server not connected yet");

}

alert("Signup Successful! Please Login");

window.location.href = "login.html";

});

}



function logout(){

localStorage.removeItem("loggedInUser");

window.location.href="login.html";

}



// JOB DATABASE

const jobs = [

{company:"Google",category:"Developer",location:"California",salary:"$9000/month",type:"Full Time"},
{company:"Microsoft",category:"Developer",location:"California",salary:"$8500/month",type:"Full Time"},
{company:"Amazon",category:"Developer",location:"New York",salary:"$8000/month",type:"Full Time"},
{company:"Meta",category:"Developer",location:"New York",salary:"$8700/month",type:"Full Time"},
{company:"Adobe",category:"Developer",location:"Delhi",salary:"₹90000/month",type:"Full Time"},
{company:"Oracle",category:"Developer",location:"Bangalore",salary:"₹85000/month",type:"Full Time"},
{company:"IBM",category:"Developer",location:"Tokyo",salary:"$7500/month",type:"Full Time"},

{company:"Samsung",category:"Designer",location:"Seoul",salary:"$5000/month",type:"Part Time"},
{company:"Netflix",category:"Designer",location:"California",salary:"$7500/month",type:"Contract"},
{company:"Spotify",category:"Designer",location:"New York",salary:"$6500/month",type:"Full Time"},
{company:"Airbnb",category:"Designer",location:"Paris",salary:"$6000/month",type:"Full Time"},
{company:"Canva",category:"Designer",location:"Delhi",salary:"₹70000/month",type:"Full Time"},

{company:"Infosys",category:"Tester",location:"Bangalore",salary:"₹60000/month",type:"Full Time"},
{company:"TCS",category:"Tester",location:"Pune",salary:"₹55000/month",type:"Full Time"},
{company:"Capgemini",category:"Tester",location:"Delhi",salary:"₹52000/month",type:"Full Time"},
{company:"Sony",category:"Tester",location:"Tokyo",salary:"$6000/month",type:"Full Time"},

{company:"HubSpot",category:"Marketing",location:"New York",salary:"$7000/month",type:"Full Time"},
{company:"Meta Ads",category:"Marketing",location:"California",salary:"$7200/month",type:"Full Time"},
{company:"Zomato",category:"Marketing",location:"Delhi",salary:"₹60000/month",type:"Full Time"},

{company:"Tesla",category:"Sales",location:"California",salary:"$6800/month",type:"Full Time"},
{company:"Flipkart",category:"Sales",location:"Bangalore",salary:"₹65000/month",type:"Full Time"},
{company:"Amazon Sales",category:"Sales",location:"New York",salary:"$7000/month",type:"Full Time"},

{company:"TCS",category:"HR",location:"Pune",salary:"₹50000/month",type:"Full Time"},
{company:"Infosys HR",category:"HR",location:"Bangalore",salary:"₹52000/month",type:"Full Time"},
{company:"Google HR",category:"HR",location:"California",salary:"$6500/month",type:"Full Time"}

];



// SEARCH JOB FUNCTION

function searchJobs(){

let category = document.getElementById("category").value;
let location = document.getElementById("location").value;

let list = document.getElementById("jobList");

list.innerHTML="";

let results = jobs.filter(job =>
job.category === category && job.location === location
);

if(results.length === 0){
list.innerHTML = "<p>No jobs found for this criteria</p>";
return;
}

results.forEach(job=>{

let div = document.createElement("div");

div.className = "job-card";

div.innerHTML = `
<h3>${job.company}</h3>
<p><b>Role:</b> ${job.category}</p>
<p><b>Location:</b> ${job.location}</p>
<p><b>Salary:</b> ${job.salary}</p>
<p><b>Type:</b> ${job.type}</p>
<button onclick="applyJob('${job.company}','${job.category}')">Apply</button>
`;

list.appendChild(div);

});

}



// APPLY BUTTON CLICK

function applyJob(company,role){

let form = document.getElementById("applyFormContainer");

form.style.display = "block";

localStorage.setItem("currentJob", company + " - " + role);

form.scrollIntoView({
behavior:"smooth"
});

}



// FORM SUBMIT

document.addEventListener("DOMContentLoaded", function(){

let form = document.getElementById("applyForm");

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

let name = document.getElementById("name").value;

let job = localStorage.getItem("currentJob");

let user = localStorage.getItem("loggedInUser");

try{

await fetch("/apply",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:name,
job:job,
resume:user
})

});

}catch(err){

console.log("Server not connected");

}

let history = JSON.parse(localStorage.getItem("applications_" + user)) || [];

history.push({
name:name,
job:job,
date:new Date().toLocaleDateString()
});

localStorage.setItem("applications_" + user, JSON.stringify(history));

alert("Application Submitted Successfully!");

form.reset();

});
}



let historyList = document.getElementById("historyList");

if(historyList){

let user = localStorage.getItem("loggedInUser");

let history = JSON.parse(localStorage.getItem("applications_" + user)) || [];

history.forEach(item=>{

let li = document.createElement("li");

li.textContent = item.job + " | " + item.date;

historyList.appendChild(li);

});

}

});