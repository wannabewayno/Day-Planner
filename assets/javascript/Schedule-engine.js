
//-----------global variables-----------
const Storage ={};


// --------------Actions-----------------
$( document ).ready(function() {
    loadToDo();
    displayLocal();
});


// --------------triggers----------------

// Save button trigger.
$('.container').click(function toggleSaveBtn(event){
    target = $(event.target)
    if(target.is(".saveBtn, .saveBtnLocked")){
        toggleLock(target);
    }
    if (target.is('i')){
        target = target.parent();
        toggleLock(target)
    }
});

// -------------functions---------------
function toggleLock(target){
    target.toggleClass("saveBtn saveBtnLocked");
    target.children('i').toggleClass("far fas fa-lock fa-save")

    //targets textarea associated with button
    const textareaEl = target.siblings().children("textarea");
    saveText(textareaEl) // sends the textarea element to the saveText function

    //toggles the textarea to read only or not
    textareaEl.attr('readonly', function(index, attr){
        return attr === 'readonly' ? null : '';
    });  
}

// receives target, stores the target's value as a string and retreives the id for key pairing.
function saveText(target){
    key = target.attr('id')
    Storage[key] = target.val();
    localStorage.setItem("planner",JSON.stringify(Storage));
}

// loads saved hourly entries, appends them back to their time slots and locks them down by calling the lock function.
function loadToDo(){
    storage = JSON.parse(localStorage.getItem("planner"));
    for (key in storage){
        if (storage[key]===""){
            return;
        }
        id = "#"+key;
        $(id).text(storage[key]);
        lock = $(id).parent().siblings('.saveBtn');
        toggleLock(lock);
    }
}

// updates the jumbotron to display the current day
function displayLocal(){
    today = findDay();
    timeOfDay = findTimeOfDay();
    $('#currentDay').html(today+" "+timeOfDay)
}
// get's the current local time in hours, starts a timer to update on the hour, every hour without re-loading the page
function getTime(){
    const hour = moment().hour();
    const minute = moment().minute();
    const second = moment().second();
    const millisecond = moment().millisecond();
    hours = hour + minute/60 + second/3600 + millisecond/3600000;
    console.log(hours);
    refreshWhen(hours);
    return hours;
}
// check's the time, updates the colour scheme;
function refresh(){
    const hours = Math.floor(getTime());
    console.log("hours: "+hours);
    const hourArray = generateHourArray();
    const IdArray = generateIdArray();
   
    const pastIds = IdArray.filter(function(element,index,array){
                 if(hourArray[index] < hours){
                     return element;
                 }
            });
    const presentIds = IdArray.filter(function(element,index,array){
                if(hourArray[index] === hours){
                    return element;
                };
            });
    const futureIds = IdArray.filter(function(element,index,array){
                if(hourArray[index] > hours){
                    return element;
                };
            }); 
    console.log(pastIds);
    console.log(futureIds);
    console.log(presentIds);
    
}

function generateHourArray(){
    const hourArray = [];
    for (let i = 0; i < 24; i++) {
        hourArray[i] = i;
    }
    return hourArray;
}

    function generateIdArray(){
        const prefix = rowHeirarchy.rowLabel.cyclicObject.prefix // as defined in the html-generator to generate id's
        const IdArray = ["12AM"];
        for (let i = 0; i < 23; i++) {
            IdArray[i+1] = cyclicN(IdArray[i],rowHeirarchy.rowLabel.cyclicObject);       
        }
        for (let i = 0; i < length.IdArray; i++) {
            IdArray[i] += prefix;
        }
    return IdArray;
    }


// The timer function that getTime() calls. This will call refresh(), every hour, on the hour, forever.
function refreshWhen(hours){
    refreshIntervalHours = Math.ceil(hours) - hours;
    console.log(refreshIntervalHours);
    refreshIntervalMilliseconds = refreshIntervalHours*3600000;
    console.log(refreshIntervalMilliseconds);
    interval = setInterval(function(){
        startUp();
        getTime();
    },refreshIntervalMilliseconds);
}

function startUp(){
    console.log("STARTUP IS FIRING");
}

function findDay(){
    const dayNames = {
        Sunday:0,
        Monday:1,
        Tuesday:2,
        Wednesday:3,
        Thursday:4,
        Friday:5,
        Saturday:6,
    }
    const dayNumber = moment().day();
    for (days in dayNames){
        if (dayNames[days] === dayNumber){
            return days;
        }
    }
}

// finds the time of day and returns it with an icon.
function findTimeOfDay(){
    const hour = moment().hour();
     
    if(hour > 5 && hour < 12){
        return "morning"+" <i class=\"fas fa-coffee\"></i>";
    } 
    if(hour > 12 && hour < 17){
        return "afternoon"+" <i class=\"fas fa-sun\"></i>";
    } 
    if(hour > 17 && hour < 21){
        return "evening"+" <i class=\"fas fa-moon\"></i>";
    } 
    if(hour > 21 || hour < 4){
        return "night"+ " <i class=\"fas fa-star\"></i>";
    } 
}