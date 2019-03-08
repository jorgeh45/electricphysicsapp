// Utils Functions

function pfl(n) {
    return parseFloat(n)
}

function getCombinations(array, size, start, initialStuff, output) {
    if (initialStuff.length >= size) {
        output.push(initialStuff);
    } else {
        var i;

        for (i = start; i < array.length; ++i) {
            getCombinations(array, size, i + 1, initialStuff.concat(array[i]), output);
        }
    }
}

function getAllPossibleCombinations(array, size, output) {
    getCombinations(array, size, 0, [], output);
}