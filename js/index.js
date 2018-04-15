$(document).ready(function(){
    $('.draggable').on('mousedown', mouseDownHandler);

    $('#load').on('click', sendRequest);

    $(document).on('keypress', '.prevent-letter-input', preventLetterInput);

    adjustTable();
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

    moveAt(e, windowToDrag, shift)

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

function sendRequest() {
    var jsonData = convertDataToJson($('#customer'));

    $.ajax({
        type: 'POST',
        url: 'request.php',
        data: jsonData,
        success: function(result) {
            handleResponse(result);

            requestAnimationFrame(function(){
                adjustTable();
            });
        },
        error: function(result) {
            showError(parseError(result.responseJSON));
        },
        dataType: 'json'
    });
}

function convertDataToJson(jqueryForm) {
    var result = {};
    
    var formData = jqueryForm.serializeArray();
    
    $.each(formData, function () {
        result[this.name] = this.value || '';
    });
    
    return JSON.stringify(result);
};

function handleResponse(result) {
    var tableContent = $('.result-set-content');
    var rows = [];

    result.forEach(function(item) {
        rows.push(getRowData(item));
    });

    tableContent.html(rows.join());
}

function getRowData(item) {
    return '<tr>' +
            '<td>' + item.fio + '</td>' +
            '<td>' + item.sex + '</td>' +
            '<td>' + item.age + '</td>' +
            '<td>' + item.phone + '</td>' +
            '</tr>';
}

function adjustTable() {
    var $table = $('table');
    var $bodyCells = $table.find('tbody tr:first').children();
    
    var colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();
    
    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    });    
}

function preventLetterInput(e) {
    if (e.which < 48 || e.which > 57) {
        e.preventDefault();
    }
}

function parseError(errorList) {
    return Object.values(errorList).join('<br/>');
}

function showError(error) {
    toastr.error(error);
}
