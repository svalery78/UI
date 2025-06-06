var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var vmCounter = 0;
var maxVM = 10;
var isShowDell = false;
var isShowAdd = false;
var vmName;
var vmNetworkCidrLabel;
var inputJson;
var createVM;

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

function clearFields(selector, isRequired) {
    $(selector).val(null);
    if (isRequired) {
        $(selector).addClass('required');
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


$('#name_is').on('change', function () {
    removedClass($('#name_is'), 'empty');
});


var vmN1Operation = $extension.find('#vm_ni_operation');
vmN1Operation.on('change', function () {
    isShowAdd = false;
    isShowDell = false;
    if (vmN1Operation.val() == 'delete') {
        isShowDell = true;
    } else if (vmN1Operation.val() == 'add') {
        isShowAdd = true;
    };

    visiabileRemoveNetwork(isShowDell);
    visiabileAddNetwork(isShowAdd);

});

var vmNetworkcidirAction = $extension.find('#vm_networkcidr_action');
vmNetworkcidirAction.on('change', function () {
    var isShow = false;
    removedClass(vmNetworkcidirAction, "empty");
    if (vmNetworkcidirAction.val() == 'существующая') {
        isShow = true;
    };

    if (!isShow) {
        clearFields('#vm_networkcidr', false);

    };

    $('#vm_networkcidr_required').toggleClass('required', isShow);
    toggleRowVisibility('#vm_networkcidr_display', isShow);
});

var vmHostName = $extension.find('#vm_hostname');
vmHostName.on('change', function () {
    removedClass(vmHostName, "empty");
    vmName = vmHostName.data('item').name;
});

var vmNetworkCidr = $extension.find('#vm_networkcidr');
vmNetworkCidr.on('change', function () {
    removedClass(vmNetworkCidr, "empty");
    vmNetworkCidrLabel = vmNetworkCidr.data('item').label;
});

$('#input_json').on('change', function () {
    inputJson = $('#input_json').val();
    inputJson = inputJson.replace(/\n+$/m, '');
    inputJson = inputJson && inputJson != '' ? JSON.parse(inputJson) : null;
});


$('#add_vm').click(function () {
    if (!$(this).hasClass("disabled")) {

        if (validateFields()) {
            alert('Заполните корректно обязательные поля');
            return;
        };
        vmCounter++;
        $('#delete_vm').show();
        removedClass($("#delete_vm"), "disabled");

        updateJson(inputJson);
        addInputFormRecord(inputJson);
        clearNetwork();

        if (vmCounter >= maxVM) {
            $(this).addClass("disabled");
            $(this).hide();
            return;
        }
    };
});


$("#delete_vm").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        $("#add_vm").show();
        $("#add_vm").removeClass("disabled");

        deleteJson(inputJson);
        addInputFormRecord(inputJson);

        vmCounter--;
        if (vmCounter == 0) {
            $(this).addClass("disabled");
            $(this).hide();
        }

    };
});

$("#finish").on("change", function () {
    if (createVM || createVM == false) {
      if ($(this).is(":checked")) {
        if (inputJson && inputJson != null &&
          inputJson != "" && $("#name_is").val()) {
          finishChecked();
        } else {
          alert("Не заполнены обязательные поля. Поставьте галочку для: Заполнение формы завершено или заполните данные для Виртуальной машины");
          $(this).prop("checked", false);
          if (!$("#name_is").val()) {
            $("#name_is").addClass("empty");
          };
          $("#finish").addClass("required");
        };
  
      } else {
        finishUnChecked();
      }
    } else {
      finishChecked();
    }
  });


function validateFields() {
   
    var isError = false;

    if (!$('#name_is').val()) {
        $('#name_is').addClass('empty');
        isError = true;
        return isError;
    };
    if ($('#vm_ni_operation').val() == "add") {
        if (!$('#vm_hostname').val()) {
            $('#vm_hostname').addClass('empty');
            isError = true;
            return isError;
        };
        if (!$('#vm_networkcidr_action').val()) {
            $('#vm_networkcidr_action').addClass('empty');
            isError = true;
            return isError;
        };
        if ($('#vm_networkcidr_action').val() == "существующая") {
            if (!$('#vm_networkcidr').val()) {
                $('#vm_networkcidr').addClass('empty');
                isError = true;
                return isError;
            };
        };
    };
    return isError;

};

function visiabileRemoveNetwork(isShow) {
    for (var i = 1; i < 11; i++) {
        toggleRowVisibility('#network' + i, isShow);
        if (!isShow) {
            clearFields('#vm_hostname' + i, false);
            clearFields('#vm_ni' + i, false);
        }
    };
};

function visiabileAddNetwork(isShow) {
    toggleRowVisibility('#addNetwork', isShow);
    $('#vm_hostname_required').toggleClass('required', isShow);
    $('#vm_networkcidr_action').toggleClass('required', isShow);

    if (!isShow) {
        clearAddNetwork();
    };
};

function clearNetwork() {
    clearAddNetwork();
};

function clearAddNetwork() {
    $('#vm_networkcidr_required').toggleClass('required', false);
    toggleRowVisibility('#vm_networkcidr_display', false);
    clearFields('#vm_hostname', false);
    clearFields('#vm_networkcidr_action', false);
    clearFields('#vm_networkcidr', false);
    vmNetworkCidrLabel = "";
};

function updateJson(input_json) {
    var newArray = input_json ? input_json.nodes : [];
    var newVM = {
        hostname: vmName,
        vm_id: vmHostName.val(),
        vm_networkcidr: vmNetworkCidrLabel
    };
    newArray.push(newVM);
    var nodes = {
        "nodes": newArray
    };
    $("#input_json").val(JSON.stringify(nodes)).change();
};

function deleteJson(input_json) {
    var newArray = input_json ? input_json.nodes : [];
    if (newArray.length > 0) {
        var lastVM = newArray.pop();
        if (newArray.length == 0) {
            $("#input_json").val(null);
        } else {
            var nodes = { "nodes": newArray };
            $("#input_json").val(JSON.stringify(nodes)).change();
        }
    }
}

function addInputFormRecord(input_json) {
    var VMsData = input_json.nodes;
    if (VMsData.length == 0) {
        $('#input_form').val(null);
    };
    var table = ' <table id="vm_table" border="1"><tr><th>';
    table += '№';
    table += '</th><th>';
    table += 'hostname';
    table += '</th><th>';
    table += 'networkCidr';
    table += '</th>';

    for (var index = 0; index < VMsData.length; index++) {
        table += '<tr><td>';
        table += index + 1;
        table += '</td><td>';
        table += (VMsData[index].hostname || '');
        table += '</td><td>';
        table += (VMsData[index].vm_networkcidr || '');
        table += '</td>';
    };
    table += '</table>';
    $('#input_form').val({ html: table });
};

function finishChecked() {
    $("#netwotk_display").hide();
    $("#name_is").readonly(true);
    $("#vm_ni_operation").readonly(true);
    clearAddNetwork();
};

function finishUnChecked() {
    $("#netwotk_display").show();
    if (vmCounter < maxVM) {
        $("#add_vm").show();
    }
    if (vmCounter > 1) {
        $("#delete_vm").show();
    }
    $("#name_is").readonly(false);
    $("#vm_ni_operation").readonly(false);
};

$("#is_reopen").on("change", function () {
    if ($(this).is(":checked")) {
        $("#correctness_block").show();
    } else {
        $("#correctness_block").hide();
    }
});

$(document).ready(function () {
    if ($("#input_json").val()) {
        //alert("createVM - false");    
        createVM = false;
    } else {
        //alert("createVM - true");
        createVM = true;
    };
});

