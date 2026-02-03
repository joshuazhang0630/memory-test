function populateArray(start, end){
	array = [];
	for (var i = start; i < end; i++){
		array[i] = i;
	}
	return array;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function shuffleArrays(arrays){
	for (var i = arrays[0].length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		for (var an = 0; an < arrays.length; an++) {
			var temp = arrays[an][i];
			arrays[an][i] = arrays[an][j];
			arrays[an][j] = temp;
		}
	}
	return arrays;
}
			
function countOccurences(array, value){
	var counter = 0;
	for (var i = 0; i < array.length; i++){
		if (array[i] == value){
			counter++;
		}
	}
	return counter;
}

