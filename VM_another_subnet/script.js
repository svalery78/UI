var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var $nameIS;
var $networkCIDr;
var $count_vm = 1;
var $VM;
var $vmHostName;
var $vmID;
var $inputJson;
var createVM;

$("#input_form").readonly(true);

function toggleRowVisibility(selector, show) {
    $(selector).toggle(show);
};

function removedClass(selector, className) {
    if (selector.hasClass(className)) {
        selector.removeClass(className);
    };
};

// Достаем id запрашивающего из URL
if (ITRP.record.new) {
    if (ITRP.context === 'self_service') {
        $("#requestor").val($("#requested_for_id").val());
    }

    if (ITRP.context != 'self_service') {
        $("#requestor").val($("#req_requested_for_id").val());
    }
}

$("#is_ex_change").on("change", function () {
    if (!$(this).hasClass("disabled")) {
        if ($(this).is(":checked")) {
            $("#row_justification").show();
        } else {
            $("#row_justification").hide();
            $("#justification").val(null).change();
            $("#inc_desc").parent().hide();
            $("#inc_desc").val(null).change();
        }
    }
});

$("#justification").on("change", function () {
    var justification = $("#justification").val();
    if (justification == 'для_устранение/предотвращения_кр'
        || justification == 'для_устранение/предотвращения_ин') {
        $("#inc_desc").parent().show();
    } else
    //if ($("#justification").val() === 'для_выполнения_поручения_руковод')
    {
        $("#inc_desc").parent().hide();
        $("#inc_desc").val(null).change();
    }
    //else {
    //$("#inc_desc").parent().show();
    //}
});

var ISName = $extension.find("#name_is");
ISName.on('change', function () {
    $nameIS = $("#name_is").val();
    removedClass(ISName, "empty");
});

var vmNetworkCIDrCurrent = $extension.find("#vm_networkcidr_current");
vmNetworkCIDrCurrent.on('change', function () {
    removedClass(vmNetworkCIDrCurrent, "empty");
});

var vmNetworkCIDrAction = $extension.find("#vm_networkcidr_action");
var vmNetworkCIDrActionRequired = $extension.find("#vm_networkcidr_action_required");
var vmNetworkCIDr = $extension.find("#vm_networkcidr");
vmNetworkCIDrAction.on('change', function () {
    if (vmNetworkCIDrActionRequired.hasClass("empty")) {
        vmNetworkCIDrActionRequired.removeClass("empty");
    }
    if (vmNetworkCIDrAction.val() !== "существующая") {
        $("#vm_networkcidr_display").hide();
        if (vmNetworkCIDr.hasClass("empty")) {
            vmNetworkCIDr.removeClass("empty");
        }
        vmNetworkCIDr.val(null);
        $networkCIDr = "new";
    }
    else {
        $("#vm_networkcidr_display").show();
    }
});

vmNetworkCIDr.on('change', function () {
    if (vmNetworkCIDrAction.val() === "существующая") {
        $networkCIDr = vmNetworkCIDr.data('item').label;
    } else {
        $networkCIDr = "new";
    }
    if (vmNetworkCIDr.hasClass("empty")) {
        vmNetworkCIDr.removeClass("empty");
    }
});

var vmHostName = $extension.find("#vm_hostname");
vmHostName.on('change', function () {
    $vmHostName = vmHostName.data('items').map(function (item) {
        return item.label;
    });
    $vmID = vmHostName.data('items').map(function (item) {
        return item.id;
    });
    removedClass(vmHostName, "empty");
});






//block_ui
if (ITRP.record.initialValues.custom_data["block_ui"] == true) { $(this).hide(); }
$("#correctness_mark").on("change", function () {
    if ($(this).is(":checked")) {
        $("#incorrect_mark").show();
    } else {
        $("#incorrect_mark").hide();
    }
});
$("#is_dis").on("change", function () {
    if ($(this).is(":checked")) {
        $("#correctness_block").show();
    } else {
        $("#correctness_block").hide();
    }
});

$("#is_reopen").on("change", function () {
    if ($(this).is(":checked")) {
        $("#correctness_block").show();
    } else {
        $("#correctness_block").hide();
    }
});

$("#add_vm").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        if (!checkingEnteredValue()) {
            $("#delete_vm").show();
            $("#delete_vm").removeClass("disabled");
            $("#number_vm_display").show();
            ISName.readonly(true);
            vmNetworkCIDrCurrent.readonly(true);
            if ($count_vm < 11) {
                addVM();
                resetValueVM();
                $count_vm++;
            } else {
                $(this).addClass("disabled");
                $(this).hide();
            }
            if ($count_vm === 11) {
                $(this).addClass("disabled");
                $(this).hide();
            }
        } else {
            alert("Заполните корректно обязательные поля");
        }
    }
});

$("#delete_vm").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        $("#add_vm").show();
        $("#add_vm").removeClass("disabled");

        var newArray = $inputJson ? $inputJson.nodes : [];
        if (newArray.length) {
            var lastVM = newArray.pop();
            if (newArray.length == 0) {
                $inputJson = null;
                $("#input_json").val(null);
            } else {
                $inputJson = { "nodes": newArray };
                var nodes = transformNodes($inputJson);
                $("#input_json").val(JSON.stringify(nodes)).change();
            }

        }
        else {
            alert("newArray - else");
        }
        $count_vm--;
        if ($count_vm == 1) {
            $(this).addClass("disabled");
            $(this).hide();
            $("#number_vm_display").hide();
            ISName.readonly(false);
            vmNetworkCIDrCurrent.readonly(false);
        }
    }
    addVMToTable();
});

$("#finish").on("change", function () {
    if (createVM || createVM == false) {
        if ($(this).is(":checked")) {
            if ($("#input_json").val() && $("#input_json").val() != null && $("#input_json").val() != "" && $("#name_is").val()) {
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

function checkingEnteredValue() {
    var isError = false;
    if (!ISName.val()) {
        ISName.addClass("empty");
        isError = true;
    };
    if (!vmNetworkCIDrCurrent.val()) {
        vmNetworkCIDrCurrent.addClass("empty");
        isError = true;
    };
    if (!vmNetworkCIDrAction.val()) {
        vmNetworkCIDrActionRequired.addClass("empty");
        isError = true;
    };
    if (vmNetworkCIDrAction.val() === "существующая") {
        if (!vmNetworkCIDr.val()) {
            vmNetworkCIDr.addClass("empty");
            isError = true;
        }
    };
    if ($vmHostName == null || $vmHostName == "") {
        $("#vm_hostname").addClass("empty");
        isError = true;
    };

    return isError;
};

function addVM() {
    var newArray = $inputJson ? $inputJson.nodes : [];

    var newVM = {
        "hostname": $vmHostName,
        "vm_id": $vmID,
        "vm_networkcidr": $networkCIDr
    };

    newArray.push(newVM);

    $inputJson = {
        "nodes": newArray
    };

    var nodes = transformNodes($inputJson);

    $("#input_json").val(JSON.stringify(nodes)).change();

    addVMToTable();

};

function addVMToTable() {
    var $VMs = $("#input_json").val();
    //alert($("#input_json").val());
    $VMs = $VMs.replace(/\n+$/m, '');
    var VMsData = $VMs && $VMs != '' ? JSON.parse($VMs).nodes : null;
    //alert("addVMToTable");
    if (!VMsData) {
        $('#input_form').val(null);
    };
    var table = ' <table id="vm_table" border="1"><tr><th>';
    table += '№';
    table += '</th><th>';
    table += 'hostname';
    table += '</th><th>';
    table += 'networkCidr';
    table += '</th></tr>';

    //  alert(VMsData.length);
    for (var index = 0; index < VMsData.length; index++) {
        var vmData = VMsData[index];
        //alert(JSON.stringify(vmData));
        table += '<tr><td>';
        table += index + 1;
        table += '</td><td>';
        table += vmData.hostname;
        table += '</td><td>';
        table += (vmData.vm_networkcidr || '');
        table += '</td></tr>';
    }
    table += '</table>';

    $('#input_form').val({ html: table });

};

function resetValueVM() {
    vmHostName.val(null);
    vmHostName.addClass("required");
    vmNetworkCIDrAction.val(null);
    vmNetworkCIDrAction.addClass("required");
    vmNetworkCIDr.val(null);
    vmNetworkCIDr.addClass("required");   
    $("#vm_networkcidr_display").hide(); 

    $networkCIDr = "";
    $vmHostName = "";
    $vmID  = "";
}

function transformNodes(input) {
    var result = { nodes: [] };
    var nodes = input.nodes;
    //const result = [];
    //const nodes = input;

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var hostnames = node.hostname;
        var vm_ids = node.vm_id;
        var network = node.vm_networkcidr;

        for (var j = 0; j < hostnames.length; j++) {
            result.nodes.push({
                hostname: hostnames[j],
                vm_id: String(vm_ids[j]), // преобразуем в строку
                vm_networkcidr: network
            });
        }
    }

    return result;
}

function finishChecked() {
    $("#vms_info").hide();
    $("#add_vm").hide();
    $("#delete_vm").hide();
    resetValueVM();
}

function finishUnChecked() {
    $("#vms_info").show();
    if ($count_vm < 11) {
        $("#add_vm").show();
    }
    if ($count_vm > 1) {
        $("#delete_vm").show();        
    }

}


$(document).ready(function () {

    if ($("#input_json").val()) {
        createVM = false;
    } else {
        createVM = true;
    };

});
