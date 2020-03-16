
//-----------global variables-----------
const Storage ={};

// -------------functions---------------

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

// receives target, stores the targets value as a string and retreives the id for key pairing.
function saveText(target){
    key = target.attr('id')
    console.log(key);
    Storage[key] = target.val();
    console.log(Storage[key]);
    localStorage.setItem("planner",JSON.stringify(Storage));
}