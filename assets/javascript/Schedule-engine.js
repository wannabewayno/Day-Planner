
//-----------global variables-----------
const Storage ={};


// --------------Actions-----------------
loadToDo();
displayLocal();

// --------------triggers----------------
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

function displayLocal(){
    today = findDay();
    timeOfDay = findTimeOfDay();
    $('#currentDay').html(today+" "+timeOfDay)
}

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