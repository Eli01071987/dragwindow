$(document).ready(function(){
    $(".draggable").on('mousedown', mouseDownHandler)
});

function mouseDownHandler(e) {

    // Клик не левой кнопкой
    if (e.which != 1) {
        return;
    }

    $(document.documentElement).css({ 'overflow': 'hidden' });

    var shift = getInitialShiftForElement(e, this);

    var windowToDrag = $('.modal-dialog').eq(0);

    windowToDrag.css({ 'position' : 'absolute', 'margin': 0 });

    moveAt(e, windowToDrag, shift);

   $(document).on('mousemove', function(e) {
        requestAnimationFrame(function(){
            moveAt(e, windowToDrag, shift);
        });
    });

    $(this).on('mouseup', function(e) {
        $(document.documentElement).css({ 'overflow': 'auto' });
        $(document).off('mousemove');
        $(this).off('mouseup');
    });
}

function getCoordinates(element) {
    var pozition = element.getBoundingClientRect();
    
    return {
        top: pozition.top + pageYOffset,
        left: pozition.left + pageXOffset
    };
}

function getInitialShiftForElement(event, element) {
    var coords = getCoordinates(element);

    return {
        x: event.pageX - coords.left,
        y: event.pageY - coords.top
    } 
}

function moveAt(e, elementToDrag, shift) {
    elementToDrag.css({
        'left': (e.pageX - shift.x) + 'px',
        'top': (e.pageY - shift.y) + 'px'
    });
}