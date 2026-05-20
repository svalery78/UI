var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var $need_os = $extension.find('#need_os');
var $need_os_row = $need_os.closest('.row');
var $count_vm = 1;
var $VM;
var $adminListNodes;
var $isDCID;
var $nameIS;
var $isCODIS;
var $role;
var $networkCIDr;
//var $networkCIDrSize;
var $OS;
var $instance;
var $zone;
var $NFS = [];
var $addNFS;
var $addGroups;
var $g02Action;
var $g02SkpduProtocol = "";
var $g02SkpduPortsNumber = "";
var $g03Action;
var $g03SkpduProtocol = "";
var $g03SkpduPortsNumber = "";
var $g04Action;
var $g04SkpduProtocol = "";
var $g04SkpduPortsNumber = "";
var $VM_additional = [];
var $OSFamily;
var createVM;

$("#input_form").readonly(true);

var ISName = $extension.find("#name_is");
ISName.on('change', function () {
    if ($("#name_is").hasClass("empty")) {
        $("#name_is").removeClass("empty");
    }
    $nameIS = $("#name_is").val();
    if ($nameIS != "") {
        $isDCID = ISName.data('item').custom_fields['Идентификатор ЦОД'];
        $isCODIS = ISName.data('item').custom_fields['ИС - Код ИС'];
        if (ISName.data('item').custom_fields['ИС - Продукт-владелец ДИТ']) {
            $("#product").val(ISName.data('item').custom_fields['ИС - Продукт-владелец ДИТ'].id);
        }

    } else {
        $("#product").val("");
        $isDCID = null;
        $isCODIS = null;
    }
});


var vmHostName = $extension.find("#vm_hostname");   // hostname
vmHostName.on('change', function () {
    if (vmHostName.hasClass("empty")) {
        vmHostName.removeClass("empty");
    }

});

var vmNetworkCIDrAction = $extension.find("#vm_networkcidr_action");
var vmNetworkCIDrActionRequired = $extension.find("#vm_networkcidr_action_required");
var vmNetworkCIDr = $extension.find("#vm_networkcidr");
var vmNetworkCIDrSize = $extension.find("#vm_networkcidr_size");
vmNetworkCIDrAction.on('change', function () {
    if (vmNetworkCIDrActionRequired.hasClass("empty")) {
        vmNetworkCIDrActionRequired.removeClass("empty");
    }
    if (vmNetworkCIDrAction.val() == "новая") {
        $("#vm_networkcidr_display").hide();
        $("#vm_networkcidr_size_display").show();
        vmNetworkCIDrSize.addClass("required");
        if (vmNetworkCIDr.hasClass("empty")) {
            vmNetworkCIDr.removeClass("empty");
        };
        vmNetworkCIDr.val(null);
        $networkCIDr = "new";

    }
    else if (vmNetworkCIDrAction.val() == "существующая") {
        $("#vm_networkcidr_display").show();
        $("#vm_networkcidr_size_display").hide();
        vmNetworkCIDrSize.val(null);
        //$networkCIDrSize = "";      
    }
    else {
        $("#vm_networkcidr_display").hide();
        $("#vm_networkcidr_size_display").hide();
        vmNetworkCIDrSize.val(null);
        $networkCIDr = "";
        //$networkCIDrSize = "";
    }
});

vmNetworkCIDr.on('change', function () {
    if (vmNetworkCIDrAction.val() === "существующая") {
        $networkCIDr = vmNetworkCIDr.data('item').label;
    } else {
        setNetworkCIDr();
    }
    if (vmNetworkCIDr.hasClass("empty")) {
        vmNetworkCIDr.removeClass("empty");
    }
});

vmNetworkCIDrSize.on('change', function () {
    console.log("vmNetworkCIDrSize" + vmNetworkCIDrSize.val());
    if ($("#vm_networkcidr_size_required").hasClass("empty")) {
        $("#vm_networkcidr_size_required").removeClass('empty');
    };
    setNetworkCIDr();
});


var vmVCPU = $extension.find("#vm_vcpu");
var vmVCPURequired = $extension.find("#vm_cpu_required");
vmVCPU.on('change', function () {
    if (vmVCPURequired.hasClass("empty")) {
        vmVCPURequired.removeClass("empty");
    }
});

var vmRAM = $extension.find("#vm_ram");
var vmRAMRequired = $extension.find("#vm_ram_required");
vmRAM.on('change', function () {
    if (vmRAMRequired.hasClass("empty")) {
        vmRAMRequired.removeClass("empty");
    }
});

var vmVMDK = $extension.find("#vm_vmdk");
var vmVMDKRequired = $extension.find("#vm_vmdk_required");
vmVMDK.on('change', function () {
    if (vmVMDKRequired.hasClass("empty")) {
        vmVMDKRequired.removeClass("empty");
    }
});

var vmOSFamily = $extension.find("#vm_os_family");
vmOSFamily.on('change', function () {
    if (vmOSFamily.hasClass("empty")) {
        vmOSFamily.removeClass("empty");
    }
    $OSFamily = vmOSFamily.data('item').name;
    if (vmOSFamily.data('item').name === 'linux' || vmOSFamily.data('item').name === 'mosos') {
        $("#vm_linux_description_display").show();
    } else {
        $("#vm_linux_description_display").hide();
        vmLinuxDescription.val(null);
    };
});

var vmOS = $extension.find("#vm_os");
vmOS.on('change', function () {
    if (vmOS.hasClass("empty")) {
        vmOS.removeClass("empty");
    }
    console.log(JSON.stringify(vmOS.data('item')));
    $OS = vmOS.data('item').label;
});

var vmDisk1 = $extension.find("#vm_disk1");
var vmDisk1Required = $extension.find("#vm_disk1_required");
vmDisk1.on('change', function () {
    if (vmDisk1Required.hasClass("empty")) {
        vmDisk1Required.removeClass("empty");
    }
});

var vmDisk1Letter = $extension.find("#vm_disk1_letter");
var vmDisk1LetterRequired = $extension.find("#vm_disk1_letter_required");
vmDisk1Letter.on('change', function () {
    if (vmDisk1LetterRequired.hasClass("empty")) {
        vmDisk1LetterRequired.removeClass("empty");
    }
});

var vmDisk2 = $extension.find("#vm_disk2");
var vmDisk2Required = $extension.find("#vm_disk2_required");
vmDisk2.on('change', function () {
    if (vmDisk2Required.hasClass("empty")) {
        vmDisk2Required.removeClass("empty");
    }
});

var vmDisk2Letter = $extension.find("#vm_disk2_letter");
var vmDisk2LetterRequired = $extension.find("#vm_disk2_letter_required");
vmDisk2Letter.on('change', function () {
    if (vmDisk2LetterRequired.hasClass("empty")) {
        vmDisk2LetterRequired.removeClass("empty");
    }
});

var vmDisk3 = $extension.find("#vm_disk3");
var vmDisk3Required = $extension.find("#vm_disk3_required");
vmDisk3.on('change', function () {
    if (vmDisk3Required.hasClass("empty")) {
        vmDisk3Required.removeClass("empty");
    }
});

var vmDisk3Letter = $extension.find("#vm_disk3_letter");
var vmDisk3LetterRequired = $extension.find("#vm_disk3_letter_required");
vmDisk3Letter.on('change', function () {
    if (vmDisk3LetterRequired.hasClass("empty")) {
        vmDisk3LetterRequired.removeClass("empty");
    }
});

var vmDisk4 = $extension.find("#vm_disk4");
var vmDisk4Required = $extension.find("#vm_disk4_required");
vmDisk4.on('change', function () {
    if (vmDisk4Required.hasClass("empty")) {
        vmDisk4Required.removeClass("empty");
    }
});

var vmDisk4Letter = $extension.find("#vm_disk4_letter");
var vmDisk4LetterRequired = $extension.find("#vm_disk4_letter_required");
vmDisk4Letter.on('change', function () {
    if (vmDisk4LetterRequired.hasClass("empty")) {
        vmDisk4LetterRequired.removeClass("empty");
    }
});

var vmDisk5 = $extension.find("#vm_disk5");
var vmDisk5Required = $extension.find("#vm_disk5_required");
vmDisk5.on('change', function () {
    if (vmDisk5Required.hasClass("empty")) {
        vmDisk5Required.removeClass("empty");
    }
});

var vmDisk5Letter = $extension.find("#vm_disk5_letter");
var vmDisk5LetterRequired = $extension.find("#vm_disk5_letter_required");
vmDisk5Letter.on('change', function () {
    if (vmDisk5LetterRequired.hasClass("empty")) {
        vmDisk5LetterRequired.removeClass("empty");
    }
});


$("#dr_cluster").on("change", function () {
    if (!$(this).hasClass("disabled")) {
        if ($(this).is(":checked")) {
            $(this).prop("checked", false);
            $(this).readonly(true);
            $("#dr_cluster_warning").show();
        }
    }
});

//Новое
$("#vm_service").on("change", function () {
    if ($("#vm_service").val() === 'среда_исполнения') {
        $need_os_row.show();
    } else {
        $need_os_row.hide();
        $need_os.val('').trigger('change');
    }
});

$("#vm_service").on("change", function () {
    if ($("#vm_service").val() === 'среда_виртуализации') {
        $("#os_necessity").parent().show();
    } else {

        $("#os_necessity").parent().hide();
        $("#os_necessity").val(null).change();
    }
});

$("#os_necessity").on("change", function () {
    if ($(this).is(":checked")) {
        $("#instruction").show();

    } else {
        $("#instruction").hide();
    }
});

$("#vm_add_disk").on("change", function () {
    if ($(this).is(":checked")) {
        $("#additional_disks").show();
        $('#add_disk').show();
    } else {
        $("#additional_disks").hide();
        additonalDisksRemoveClass(0);
        resetValueDisk();
    }
});


$("#add_disk").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        //alert("not disabled");
        $("#delete_disk").show();
        $("#delete_disk").removeClass("disabled");

        if ($("#disk2").css("display") == "none") {
            //alert($("#disk2").css("display")=="none");
            $("#disk2").show();
        } else {
            //alert("else");
            if ($("#disk3").css("display") == "none") {
                $("#disk3").show();
            } else {
                //alert("else");
                if ($("#disk4").css("display") == "none") {
                    $("#disk4").show();
                } else {
                    if ($("#disk5").css("display") == "none") {
                        $("#disk5").show();
                        $(this).addClass("disabled");
                        $(this).hide();
                    }
                }
            }
        }
        //alert("add_disk");
    }


});

$("#delete_disk").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        if (!($("#disk5").css("display") == "none")) {
            $("#add_disk").removeClass("disabled");
            $('#add_disk').show();
            additonalDisksRemoveClass(5);
        } else {
            //alert("else 5");
            if (!($("#disk4").css("display") == "none")) {
                additonalDisksRemoveClass(4);
            } else {
                //alert("else 4");
                if (!($("#disk3").css("display") == "none")) {
                    additonalDisksRemoveClass(3);
                } else {

                    if (!($("#disk2").css("display") == "none")) {
                        additonalDisksRemoveClass(2);
                        $(this).addClass("disabled");
                        $(this).hide();

                    }
                }
            }
        }
    }
});

$("#add_vm").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        if (!checkingEnteredValue()) {
            $("#delete_vm").show();
            $("#delete_vm").removeClass("disabled");
            $("#number_vm_display").show();
            if ($count_vm < 21) {
                //alert($count_vm);
                addVM();
                resetValueVM();
                $count_vm++;
            } else {
                $(this).addClass("disabled");
                $("#copy_vm").addClass("disabled");
                $(this).hide();
                $("#copy_vm").hide();
            }
            if ($count_vm === 21) {
                $(this).addClass("disabled");
                $(this).hide();
                $("#copy_vm").addClass("disabled");
                $("#copy_vm").hide();

            }
        } else {
            alert("Заполните корректно обязательные поля");
        }
    } else {
        //$(this).addClass("disabled");
    }
});

$("#copy_vm").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        if (!checkingEnteredValue()) {
            $("#delete_vm").show();
            $("#delete_vm").removeClass("disabled");
            $("#number_vm_display").show();
            if ($count_vm < 21) {
                addVM();
                $count_vm++;
            } else {
                $(this).addClass("disabled");
                $("#add_vm").addClass("disabled");
            }
            if ($count_vm === 21) {
                $(this).addClass("disabled");
                $("#add_vm").addClass("disabled");
                $(this).hide();
                $("#add_vm").hide();
            }
        } else {
            alert("Заполните корректно обязательные поля");
        }

    } else {
        //$(this).addClass("disabled");
    }
});

$("#delete_vm").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        $("#add_vm").show();
        $("#add_vm").removeClass("disabled");
        $("#copy_vm").show();
        $("#copy_vm").removeClass("disabled");
        var $package = $("#input_json").val();
        $package = $package.replace(/\n+$/m, '');
        var packageData = $package && $package != '' ? JSON.parse($package) : null;
        var newArray = packageData ? packageData.nodes : [];
        if (newArray.length) {
            var lastVM = newArray.pop();
            var lastVMAdditional = $VM_additional.pop();
            if (newArray.length == 0) {
                $("#input_json").val(null);
            } else {
                var nodes = { "nodes": newArray };
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
        }

    } else {
        //$(this).addClass("disabled");
    }
    addVMToTable();
});

$("#unload_vm").on("click", function () {

    var vmNumber = parseInt($("#number").val(), 10);
    var packageData = JSON.parse($("#input_json").val() || '{"nodes":[]}');
    var vms = packageData.nodes;

    if (isNaN(vmNumber) || vmNumber < 1 || vmNumber > vms.length) {
        alert("Некорректный номер ВМ! Допустимый диапазон: 1-" + vms.length);
        return;
    }

    // Удаляем элемент массива
    var deletedVM = vms.splice(vmNumber - 1, 1)[0];
    var deletevmAdditioanal = $VM_additional.splice(vmNumber - 1, 1)[0];

    // Переприсваиваем номера
    vms.forEach(function (vm, index) {
        vm.vm = index + 1;
    });

    // Обновляем JSON
    $("#input_json").val(JSON.stringify({ nodes: vms })).change();

    // Обновляем таблицу
    addVMToTable();

    // Заполняем форму данными удаленной ВМ
    fillFormWithVMData(deletedVM, deletevmAdditioanal);


    // Сбрасываем поле ввода
    $("#number").val(null).change();

    $count_vm--;
    $("#add_vm").show();
    $("#add_vm").removeClass("disabled");
    $("#copy_vm").show();
    $("#copy_vm").removeClass("disabled");
    if ($count_vm == 1) {
        $("#delete_vm").addClass("disabled");
        $("#delete_vm").hide();
        $("#number_vm_display").hide();
        $("#input_json").val(null);

    }

});

function addVM() {

    var $package = $("#input_json").val();
    $package = $package.replace(/\n+$/m, '');
    var packageData = $package && $package != '' ? JSON.parse($package) : null;
    var newArray = packageData ? packageData.nodes : [];

    if (!packageData) {
        packageData = {
            "is_id": "",
            "is_dc_id": "",
            "admin_list": ""
        };
    }

    var newVM = {
        "vm": $count_vm,
        "vm_hostname": vmHostName.val(),
        "vm_networkcidr": $networkCIDr, //$("#vm_networkcidr").val(), //
        "vm_vcpu": $("#vm_vcpu").val(),
        "vm_ram": $("#vm_ram").val(),
        "vm_vmdk": $("#vm_vmdk").val(),
        "vm_os_family": $OSFamily,
        "vm_os": $OS, //$("#vm_os").val(),  //
        "vm_disk1": $("#vm_disk1").val(),
        "vm_disk2": $("#vm_disk2").val(),
        "vm_disk3": $("#vm_disk3").val(),
        "vm_disk4": $("#vm_disk4").val(),
        "vm_disk5": $("#vm_disk5").val(),
    };
    newArray.push(newVM);
    var vmLinuxDescriptionHTML = $("#vm_linux_description").val() ? '-' + $("#vm_linux_description").val() : '';
    var newVMAdditional = {
        vm: $count_vm,
        vmNetworkCIDrAction: vmNetworkCIDrAction.val(),
        vmNetworkCIDr: vmNetworkCIDr.val(),
        vmNetworkCIDrSize: vmNetworkCIDrSize.val(),
        vmOS: vmOS.val(),
        vmOSFamily: vmOSFamily.val(),

        vmNameVM: $isCODIS + '-' + $role + '-***-' + $zone + vmLinuxDescriptionHTML
    };
    $VM_additional.push(newVMAdditional);

    var nodes = {
        "nodes": newArray
    };
    $("#input_json").val(JSON.stringify(nodes)).change();

    addVMToTable();
}

function resetValueVM() {
    vmHostName.val(null);
    vmHostName.addClass("required");
    vmHostName.removeClass("invalid");
    vmNetworkCIDrAction.val(null);
    vmNetworkCIDrAction.addClass("required");
    vmNetworkCIDr.val(null);
    vmNetworkCIDr.addClass("required");
    vmNetworkCIDrSize.val(null);
    vmNetworkCIDrSize.addClass("required");
    vmVCPU.val(null);
    vmVCPU.addClass("required");
    vmVCPU.removeClass("invalid");
    vmRAM.val(null);
    vmRAM.addClass("required");
    vmRAM.removeClass("invalid");
    vmVMDK.val(null);
    vmVMDK.addClass("required");
    vmVMDK.removeClass("invalid");
    vmOSFamily.val(null);
    vmOS.val(null);
    resetValueDisk();
    $("#vm_networkcidr_display").hide();
    $("#vm_networkcidr_size_display").hide();
    $("#additional_disks").hide();
    $("#vm_add_disk").prop("checked", false);
    $networkCIDr = "";
    $OS = "";
    $OSFamily = "";
}

function resetValueDisk() {
    $("#delete_disk").hide();
    $("#add_disk").removeClass("disabled");
    $("#delete_disk").removeClass("disabled");
    additonalDisksRemoveClass(0);
}

function addVMToTable() {
    var $VMs = $("#input_json").val();
    $VMs = $VMs.replace(/\n+$/m, '');
    var VMsData = $VMs && $VMs != '' ? JSON.parse($VMs).nodes : null;
    if (!VMsData) {
        $('#input_form').val(null);
    };
    var table = ' <table id="vm_table" border="1"><tr><th>';
    table += '№';
    table += '</th><th>';
    table += 'Имя ВМ/hostname';
    table += '</th><th>';
    table += 'networkCidr';
    table += '</th><th>';
    table += 'vCPU, шт';
    table += '</th><th>';
    table += 'RAM, ГБ';
    table += '</th><th>';
    table += 'Системный диск, ГБ';
    table += '</th><th>';
    table += 'Семейство ОС';
    table += '</th><th>';
    table += 'Образ';
    table += '</th><th>';
    table += 'Дополнительные диски';
    table += '</th></tr>';

    for (var index = 0; index < VMsData.length; index++) {
        var vmData = VMsData[index];
        table += '<tr><td>';
        table += vmData.vm;
        table += '</td><td>';
        table += vmData.vm_hostname;
        table += '</td><td>';
        table += (vmData.vm_networkcidr || '');
        table += '</td><td>';
        table += (vmData.vm_vcpu || '');
        table += '</td><td>';
        table += (vmData.vm_ram || '');
        table += '</td><td>';
        table += (vmData.vm_vmdk || '');
        table += '</td><td>';
        table += (vmData.vm_os_family || '');
        table += '</td><td>';
        table += (vmData.vm_os || '');
        table += '</td><td>';
        table += (vmData.vm_disk1 || '');
        table += '; <br> ';
        table += (vmData.vm_disk2 || '');
        table += '; <br> ';
        table += (vmData.vm_disk3 || '');
        table += '; <br>';
        table += (vmData.vm_disk4 || '');
        table += '; <br>';
        table += (vmData.vm_disk5 || '');
        table += '; ';
        table += '</td></tr>';
    }
    table += '</table>';

    $('#input_form').val({ html: table });

}

function updateInputJson() {
    var $package = $("#input_json").val();
    $package = $package.replace(/\n+$/m, '');
    var packageData = $package && $package != '' ? JSON.parse($package) : null;
    var newArray = packageData ? packageData.nodes : [];
    packageData = {
        "is_id": $nameIS,
        "is_dc_id": $isDCID,
        "admin_list": $adminListNodes ? $adminListNodes : ""
    };
    //}
    var nodes = {
        "is_id": packageData.is_id,
        "is_dc_id": packageData.is_dc_id,
        "admin_list": packageData.admin_list,
        "nodes": newArray
    };
    $("#input_json").val(JSON.stringify(nodes)).change();
}

function checkingEnteredValue() {
    var isError = false;
    if (!$("#name_is").val()) {
        $("#name_is").addClass("empty");
        isError = true;
    }

    if (!vmHostName.val() || vmHostName.hasClass("invalid")) {
        vmHostName.addClass("empty");
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
    if (vmNetworkCIDrAction.val() === "новая") {
        console.log('vm_networkcidr_size' + vmNetworkCIDrSize.val());
        if (!vmNetworkCIDrSize.val()) {
            $("#vm_networkcidr_size_required").addClass("empty");
            console.log('vm_networkcidr_size_required');
            isError = true;
        }
    };
    if (!$("#vm_vcpu").val() || $("#vm_vcpu").hasClass("invalid")) {
        $("#vm_cpu_required").addClass("empty");
        isError = true;
    };
    if (!$("#vm_ram").val() || $("#vm_ram").hasClass("invalid")) {
        $("#vm_ram_required").addClass("empty");
        isError = true;
    };
    if (!$("#vm_vmdk").val() || $("#vm_vmdk").hasClass("invalid")) {
        $("#vm_vmdk_required").addClass("empty");
        isError = true;
    };
    if (!vmOSFamily.val()) {
        vmOSFamily.addClass("empty");
        isError = true;
    };
    if (!$("#vm_os").val()) {
        $("#vm_os").addClass("empty");
        isError = true;
    };
    if ($("#additional_disks").css("display") === "block") {
        if (!vmDisk1.val() || vmDisk1.hasClass("invalid")) {
            vmDisk1Required.addClass("empty");
            isError = true;
        };

        if ($("#disk2").css("display") === "block") {
            if (!vmDisk2.val() || vmDisk2.hasClass("invalid")) {
                vmDisk2Required.addClass("empty");
                isError = true;
            };
        };

        if ($("#disk3").css("display") === "block") {
            if (!vmDisk3.val() || vmDisk3.hasClass("invalid")) {
                vmDisk3Required.addClass("empty");
                isError = true;
            };
        };


        if ($("#disk4").css("display") === "block") {
            if (!vmDisk4.val() || vmDisk4.hasClass("invalid")) {
                vmDisk4Required.addClass("empty");
                isError = true;
            };
        };


        if ($("#disk5").css("display") === "block") {
            if (!vmDisk5.val() || vmDisk5.hasClass("invalid")) {
                vmDisk5Required.addClass("empty");
                isError = true;
            };
        };

    };
    return isError;
}

function additonalDisksRemoveClass(diskNumber) {
    if (diskNumber === 1 || diskNumber === 0) {
        if (vmDisk1Required.hasClass("empty")) {
            vmDisk1Required.removeClass("empty");
        };
        vmDisk1.addClass("required");
        vmDisk1.removeClass("invalid");
        vmDisk1.val(null);
    };

    if (diskNumber === 2 || diskNumber === 0) {
        if (vmDisk2Required.hasClass("empty")) {
            vmDisk2Required.removeClass("empty");
        };
        vmDisk2.addClass("required");
        vmDisk2.removeClass("invalid");
        vmDisk2.val(null);
        $("#disk2").hide();
    };

    if (diskNumber === 3 || diskNumber === 0) {
        if (vmDisk3Required.hasClass("empty")) {
            vmDisk3Required.removeClass("empty");
        };
        vmDisk3.addClass("required");
        vmDisk3.removeClass("invalid");
        vmDisk3.val(null);
        $("#disk3").hide();
    };

    if (diskNumber === 4 || diskNumber === 0) {
        if (vmDisk4Required.hasClass("empty")) {
            vmDisk4Required.removeClass("empty");
        };
        vmDisk4.addClass("required");
        vmDisk4.removeClass("invalid");
        vmDisk4.val(null);
        $("#disk4").hide();
    };

    if (diskNumber === 5 || diskNumber === 0) {
        if (vmDisk5Required.hasClass("empty")) {
            if (vmOSFamily.data('item').name === 'linux' || vmOSFamily.data('item').name === 'mosos') {
                $("#vm_linux_description_display").show();
            } else {
                $("#vm_linux_description_display").hide();
                vmLinuxDescription.val(null);
            };
            vmDisk5Required.removeClass("empty");
        };
        vmDisk5.addClass("required");
        vmDisk5.removeClass("invalid");
        vmDisk5.val(null);
        $("#disk5").hide();
    };
};

function updateProtocolVisibility(vmSkpduPorts, vmSkpduProtocol, vmSkpduProtocolDisp) {
    if (vmSkpduPorts.val()) {
        vmSkpduProtocol.removeClass("required");
        vmSkpduProtocol.val('');
        vmSkpduProtocolDisp.hide();

    } else {
        if (!vmSkpduProtocol.val()) {
            vmSkpduProtocol.addClass("required");
        } else {
            if (vmSkpduPorts.hasClass("required")) {
                vmSkpduPorts.removeClass("required");
            }
        };
        vmSkpduProtocolDisp.show();

    };
}

// Функция заполнения формы данными ВМ

function fillFormWithVMData(vmData, vmDataAdditional) {
    // Основные поля
    $("#vm_networkcidr_action").val(vmDataAdditional.vmNetworkCIDrAction).change();
    $("#vm_hostname").val(vmData.vm_hostname);
    if ($("#vm_hostname").val()) {
        $("#vm_hostname").removeClass("required");
        $("#vm_hostname_required").removeClass("empty");
    };
    $("#vm_networkcidr").val(vmDataAdditional.vmNetworkCIDr);
    $networkCIDr = vmData.vm_networkcidr; // === "new" ?  "new" : $("#vm_networkcidr").val();
    $("#vm_networkcidr_size").val(vmDataAdditional.vmNetworkCIDrSize);
    if ($("#vm_networkcidr_size").val()) {
        $("#vm_networkcidr_size").removeClass("required");
        $("#vm_networkcidr_size_required").removeClass("empty");
    };
    $("#vm_vcpu").val(vmData.vm_vcpu);
    if ($("#vm_vcpu").val()) {
        $("#vm_vcpu").removeClass("required");
        $("#vm_cpu_required").removeClass("empty");
    };
    $("#vm_ram").val(vmData.vm_ram);
    if ($("#vm_ram").val()) {
        $("#vm_ram").removeClass("required");
        $("#vm_ram_required").removeClass("empty");
    };
    $("#vm_vmdk").val(vmData.vm_vmdk);
    if ($("#vm_vmdk").val()) {
        $("#vm_vmdk").removeClass("required");
        $("#vm_vmdk_required").removeClass("empty");
    };
    $("#vm_os_family").val(vmDataAdditional.vmOSFamily).trigger('change');
    setTimeout(function () {
        $("#vm_os").val(vmDataAdditional.vmOS).trigger('change');
        $OS = vmData.vm_os;
    }, 500);
    // Диски
    $("#vm_add_disk").prop("checked", !!vmData.vm_disk1).change();
    if (vmData.vm_disk1) {
        $("#vm_disk1").val(vmData.vm_disk1);
        $("#vm_disk1").removeClass("required");
        $("#delete_disk").show();
        $("#delete_disk").removeClass("disabled");
        if (vmData.vm_disk2) {
            $("#vm_disk2").val(vmData.vm_disk2);
            $("#vm_disk2").removeClass("required");
            $("#disk2").show();
            if (vmData.vm_disk3) {
                $("#vm_disk3").val(vmData.vm_disk3);
                $("#vm_disk3").removeClass("required");
                $("#disk3").show();
                if (vmData.vm_disk4) {
                    $("#vm_disk4").val(vmData.vm_disk4);
                    $("#vm_disk4").removeClass("required");
                    $("#disk4").show();
                    if (vmData.vm_disk5) {
                        $("#vm_disk5").val(vmData.vm_disk5);
                        $("#vm_disk5").removeClass("required");
                        $("#disk5").show();
                        $("#add_disk").addClass("disabled");
                        $("#add_disk").hide();
                    }
                }
            }

        }
    }

}

function finishChecked() {
    $("#vm_1").hide();
    $("#add_vm").hide();
    $("#copy_vm").hide();
    $("#delete_vm").hide();
    $("#number_vm_display").hide();
    $("#is_ex_change").addClass("disabled");
    $("#justification").readonly(true);
    $("#inc_desc").readonly(true);
    $("#dr_cluster").addClass("disabled");
    $("#name_is").readonly(true);
    $("#admin_privileges").addClass("disabled");
    $("#admin_list").readonly(true);
    $("#vm_authorization").readonly(true);
    $("#number").val(null).change();
    resetValueVM();
}

function finishUnChecked() {
    $("#vm_1").show();
    if ($count_vm < 21) {
        $("#add_vm").show();
        $("#copy_vm").show();
    }
    if ($count_vm > 1) {
        $("#delete_vm").show();
        $("#number_vm_display").show();
    }
    $("#is_ex_change").removeClass("disabled");
    $("#justification").readonly(false);
    $("#inc_desc").readonly(false);
    $("#dr_cluster").removeClass("disabled");
    $("#name_is").readonly(false);
    $("#admin_privileges").removeClass("disabled");
    $("#admin_list").readonly(false);
    $("#vm_authorization").readonly(false);
}

function setNetworkCIDr() {
    if (vmNetworkCIDrSize.val() != "" || vmNetworkCIDrSize.val()) {
        $networkCIDr = vmNetworkCIDrSize.val();
    } else {
        $networkCIDr = "new";
    };
};

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

//если новый запрос из селфсервиса, скрыть поле комментарий
if (ITRP.record.new) {
    if (ITRP.context === 'self_service') {
        $("#self_service_new_request_wizard_note-container").parent().parent().hide();
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
    if ($("#justification").val() === 'для_выполнения_поручения_руковод') {
        $("#inc_desc").parent().hide();
        $("#inc_desc").val(null).change();
    } else {
        $("#inc_desc").parent().show();
    }
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

$(document).ready(function () {

    if ($("#input_json").val()) {
        createVM = false;
    } else {
        createVM = true;
    };


});

// Достаем id запрашивающего из URL
function setRequestor() {
    if (ITRP.record.new) {
        console.log("ITRP.context:", ITRP.context);

        if (ITRP.context === "self_service") {
            console.log("requested_for_id:", $("#requested_for_id").val());
            $("#requestor").val($("#requested_for_id").val());
        } else {
            console.log("req_requested_for_id:", $("#req_requested_for_id").val());
            $("#requestor").val($("#req_requested_for_id").val());
        }

        console.log("requestor after set:", $("#requestor").val());
    }
}

setRequestor();

//когда ввод завершен (фокус ушел с поля)
$("#req_requested_for").on("blur", function () {
    console.log("blur:", this.id, "value:", $(this).val());
    setRequestor();
});

// Анализ возврата на доработку
$("#is_reopen").on("change", function () {
    if ($(this).is(":checked")) {
        $("#correctness_block").show();
    } else {
        $("#correctness_block").hide();
    }
});