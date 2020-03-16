
// Set the number of rows to create, the classes for the row and the labelling structure.
var rowHeirarchy = {
    numberOfRows:9,
    rowClasses:"row no-gutters timeblock",
    rowLabel:{
        labelTarget:"p",
        startingLabel: "9AM",
        cyclicObject:{
            N:12,
            prefix:["time"],
            suffixArray:["AM","PM"],
            suffixPhase:-1,
            ifAscending:true,
        }
    }
};
// Sets the elements in each column, classes for each column end each element individualy.
// copy pasta the structure to add columns.
var columnHeirarchy = {
    column1:{
        columnClasses:"col-1 hour d-flex justify-content-center",
        columnElements:{
            elements:["<p>"],
            elementClasses:{
            "<p>":"align-self-center "
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

function generateGrid(rowHeirarchy,columnHeirarchy,appendTarget){
    // labelTarget: target to display row label | targetEl: target to append the whole grid to | label: label to start the first row with.
    const labelTarget = rowHeirarchy.rowLabel.labelTarget;
    let targetEl = $(appendTarget);
    let label = rowHeirarchy.rowLabel.startingLabel;
    let prefix = rowHeirarchy.rowLabel.cyclicObject.prefix

    //creates a row element and adds classes defined in rowHeirarchy
    for (let i = 0; i < rowHeirarchy.numberOfRows; i++) {
        let rowEl = $('<div>');
        rowEl.addClass(rowHeirarchy.rowClasses);

        // loops through all column keys in columnHeirarchy and creates column elements and children with associated classes.
        for (column in columnHeirarchy){
            let colEl = $('<div>');
            colEl.addClass(columnHeirarchy[column].columnClasses);

            // loops through all html elements associated with this column and appends them to the column.
            columnHeirarchy[column].columnElements.elements.forEach(element => {
                let individualEl = $(element);
                individualEl.addClass(columnHeirarchy[column].columnElements.elementClasses[element]);

                // selector to append row label to.
                if (individualEl.is(labelTarget)) {
                    individualEl.html(label);
                }
                // selector to append id to.
                if (individualEl.is('textarea')) {
                    individualEl.attr('id', prefix+label);
                }

                colEl.append(individualEl);
            });
            // Appends created columns to the row
            rowEl.append(colEl);
        }
        // Appends the row (with columns and elements) to the target you identified
        targetEl.append(rowEl);
        label = cyclicN(label,rowHeirarchy.rowLabel.cyclicObject);
    }
}

generateGrid(rowHeirarchy,columnHeirarchy,".container");

/* This generates cyclic labels (10AM ,11AM, 12PM, 1PM etc..)
    findNextCyclicOf: is the CURRENT label and you want to find the next label in the series.
        e.g let findNextCyclicOf = 9AM, the next label would be 10AM. 
    N: is the cyclic number.
        e.g 12 -> 1, 2, 3 ....10, 11, 12.
    suffixArray: is an array containing all the suffixes you want to loop through. 
        e.g [AM,PM] -> 1AM, 2AM, 3AM .... 10PM, 11PM, 12AM.
    ifAscending: is a boolean, describes if you want to go up or down series. 
        e.g true -> 9AM, 10AM, 11AM. false -> 9AM, 8AM, 7AM. 
    suffixPhase: is the phase of the suffix labels with respect to the numbers.
        (in phase, default): suffixPhase = 0 (or omitted) -> 10PM, 11PM, 12PM, 1AM, 2AM, 3AM.
        *a phase change of -1 is needed to allow for our 12hr time formatting,
        (-1 out of phase): suffixPhase = -1 -> 10PM, 11PM, 12AM, 1AM, 2AM, 3AM.
             This makes the suffix change occur 1 earlier than the number change. */

function cyclicN(findNextCyclicOf,cyclicObject){
    // extract information from cyclicObject
    const N = rowHeirarchy.rowLabel.cyclicObject.N;
    const suffixArray = cyclicObject.suffixArray;
    const suffixPhase = cyclicObject.suffixPhase;
    const ifAscending = cyclicObject.ifAscending;
    // create some local variables
    let nArray =[];
    let sArray =[];
    const cyclicPeriod = N*suffixArray.length
    let count = 1;
    let suffixIndex = 0;
    // create an array of numbers and suffixes
    for (let i = 1; i <= cyclicPeriod ; i++) {
        if (count > N){
            count = 1;
            suffixIndex++;
        }
        sArray.push(suffixArray[suffixIndex]);
        nArray.push(count);
        count++; 
    }
    // shift the suffix array by a phase
    sArray = changePhase(sArray, suffixPhase);
    let index = 0;
    const cyclicArray = [];
    // adds the shifted suffix array to the number array to create the cyclic array
    nArray.forEach((element) => {
        element += sArray[index];
        cyclicArray[index] = element;
        index++;
    });
    const currentCyclicIndex = cyclicArray.indexOf(findNextCyclicOf);

    if (ifAscending === true){
        if(currentCyclicIndex === cyclicPeriod-1){
            var nextCyclicIndex = 0;
        } else {
            var nextCyclicIndex = currentCyclicIndex + 1;
        }
        const nextCyclic = cyclicArray[nextCyclicIndex]; 
        return nextCyclic;
    } else { // else, descending, return an index lower than what you started with; 
        if(currentCyclicIndex === 0){
            var nextCyclicIndex = cyclicPeriod - 1;
        } else {
            var nextCyclicIndex = currentCyclicIndex - 1;
        }
        const nextCyclic = cyclicArray[nextCyclicIndex]; 
        return nextCyclic;
    }

}


function changePhase(array, phase){
    array1 = array.filter(function(value,index,array){
        if (index < Math.abs(phase)){
            return value;  
        }
    });
    array2 = array.filter(function(value,index,array){
        if (index >= Math.abs(phase)){
            return value;  
        }
    });
    if (Math.sign(phase) === -1){
        outputArray = array2.concat(array1);
    } else {
        outputArray = array1.concat(array2);
    }
    return outputArray;
}