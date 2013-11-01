
$(function(){

	$("#gallery").gallery();
	
	var puzzle = Puzzle.getInstance();
	puzzle.animate();
	var state = State.getInstance();
	state.animate();
	state.reset();
});
