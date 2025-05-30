var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

$("#input_form").readonly(true);

// Helper function to show/hide rows
function toggleRowVisibility(selector, show) {
    $(selector).toggle(show);
}

function removedClass(selector, className) {
    if (selector.hasClass(className)) {
        selector.removeClass(className);
    };
};

//если новый запрос из селфсервиса, скрыть поле комментарий
if (ITRP.record.new) {
    if (ITRP.context === 'self_service') {
        $("#self_service_new_request_wizard_note-container").parent().parent().hide();
    }
}

// Достаем id запрашивающего из URL
if (ITRP.record.new) {
    if (ITRP.context === 'self_service') {
        $("#requestor").val($("#requested_for_id").val());
    }

    if (ITRP.context != 'self_service') {
        $("#requestor").val($("#req_requested_for_id").val());
    }
}

// 1. "Экстренное изменение" Checkbox
$('#is_ex_change').on('change', function () {
    const isChecked = $(this).is(':checked');

    // Show/hide the justification and incident description fields
    toggleRowVisibility('#row_justification', isChecked);

    // Toggle the "required" class based on the checkbox state
    $('#justification').toggleClass('required', isChecked);

    if (!isChecked) {
        $('#justification').val(null);
        toggleRowVisibility('#row_inc_desc', false);
        $('#inc_desc').toggleClass('required', false);
    }
});

$('#justification').on('change', function () {
    var justification = $("#justification").val();
    var isShow = false;
    if (justification == 'для_устранение/предотвращения_кр'
        || justification == 'для_устранение/предотвращения_ин') {
        isShow = true;
    };

    $("#inc_desc").val(null);
    toggleRowVisibility('#row_inc_desc', isShow);
    $('#inc_desc').toggleClass('required', isShow);
});



// $("#is_ex_change").on("change", function () {
//     if ($(this).is(":checked")) {
//         $("#row_justification").show();
//     } else {
//         $("#row_justification").hide();
//         $("#justification").val(null).change();
//         $("#inc_desc").parent().hide();
//         $("#inc_desc").val(null).change();
//     }
// });

// $("#justification").on("change", function () {
//     if ($("#justification").val() === 'для_выполнения_поручения_руковод') {
//         $("#inc_desc").parent().hide();
//         $("#inc_desc").val(null).change();
//     } else {
//         $("#inc_desc").parent().show();
//     }
// });

$("#is_reopen").on("change", function () {
    if ($(this).is(":checked")) {
        $("#correctness_block").show();
    } else {
        $("#correctness_block").hide();
    }
});