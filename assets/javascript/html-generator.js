$('document').ready(function(){
  

});

var rowInformation = {
    numberOfRows:9,
    rowClasses:"row no-gutters timeblock",
    rowLabel:{
        startingIndex:9,
        prefix:"time",
        suffix:["AM","PM"]
    }
};
var columnHTMLelements = {
    column1:{
        columnClasses:"col-1 hour d-flex justify-content-center",
        columnElements:{
            elements:["<p>"],
            elementClasses:{
            "<p>":"align-self-center"
            }
        }
    },
    column2:{
        columnClasses:"col-10",
        columnElements:{
            elements:["<textarea>"],
            elementClasses:{}
        }
    },
    column3:{
        columnClasses:"col-1 saveBtn d-flex justify-content-center",
        columnElements:{
            elements:["<i>"],
            elementClasses:{
            "<i>":"far fa-save align-self-center"
            }
        }
    }
}

function generateHTML(rowInformation,columnHTMLelements,appendTo){
    let containerEl = $(appendTo);
    let time = rowInformation.rowLabel.startingIndex;
    let suffix = rowInformation.rowLabel.suffix[0];
    for (let i = 0; i < rowInformation.numberOfRows; i++) {
        let rowEl = $('<div>');
        rowEl.addClass(rowInformation.rowClasses);

        for (column in columnHTMLelements){
            let colEl = $('<div>');
            colEl.addClass(columnHTMLelements[column].columnClasses);

            columnHTMLelements[column].columnElements.elements.forEach(element => {
                let individualEl = $(element);

                if ( individualEl.is("p")) {
                    let timeLabel = time+suffix
                    individualEl.text(timeLabel);
                }
                individualEl.addClass(columnHTMLelements[column].columnElements.elementClasses[element]);    
                colEl.append(individualEl);
            });

            rowEl.append(colEl);
        }
        containerEl.append(rowEl); 
        time = cyclicN(12,time,suffix,true)[0];
        suffix = cyclicN(12,time,suffix,true)[1]; 
    }
}

generateHTML(rowInformation,columnHTMLelements,".container");


    function cyclicN(N,findNextCyclicOf,suffix,ifAscending){
        var cyclicArray =[];
        cyclicArray.length = N*suffix.length
        for (let i = 0; i < N; i++) {
            cyclicArray[i] = (i+1); 
        }
        index = cyclicArray.indexOf(findNextCyclicOf);

        if (index === -1){
        throw "number needs to be an integer between 1 and "+N;
        }
        if (ifAscending === true){
            if (index === (N-1)){
                if (suffix === "AM"){
                    return [1,"PM"];
                } else {
                    return [1,"AM"];
                }
            }
            return [cyclicArray[index+1],suffix];
        } else {
             if (index === 0){
                if (suffix === "AM"){
                    return [12,"PM"];
                } else {
                    return [12,"AM"];
                }
            }
            return [cyclicArray[index-1],suffix];
        }
    }