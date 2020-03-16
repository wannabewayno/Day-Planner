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
    //toggles the textarea to read only or not
    textareaEl.attr('readonly', function(index, attr){
        return attr === 'readonly' ? null : '';
    });  
}

function getText()