var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var currentDisk = 1;
var maxDisks = 5;
var vmCounter = 0;
var maxVM = 10;
var vmName;
var inputJson = [];
var vmHostDelete;
var createVM;

// Достаем id запрашивающего из URL
if (ITRP.record.new) {
  if (ITRP.context === 'self_service') {
    $("#requestor").val($("#requested_for_id").val());
  }

  if (ITRP.context != 'self_service') {
    $("#requestor").val($("#req_requested_for_id").val());
  }
}

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

var vmHostName = $extension.find('#vm_hostname');
vmHostName.on('change', function () {
  removedClass(vmHostName, "empty");
  vmName = vmHostName.data('item').name;
});

// 2. Жесткие диски

var vmDiskOperation1 = $extension.find("#vm_disk_operation1");
vmDiskOperation1.on('change', function () {
  vmdiskOperation(vmDiskOperation1, 1, HDD1);
});

var HDD1 = $extension.find("#vm_disk1");
HDD1.on('change', function () {
  if (HDD1.val()) HDD(HDD1, 1);
});

var vmDiskOperation2 = $extension.find("#vm_disk_operation2");
vmDiskOperation2.on('change', function () {
  vmdiskOperation(vmDiskOperation2, 2, HDD2);
});

var HDD2 = $extension.find("#vm_disk2");
HDD2.on('change', function () {
  if (HDD2.val()) HDD(HDD2, 2);
});

var vmDiskOperation3 = $extension.find("#vm_disk_operation3");
vmDiskOperation3.on('change', function () {
  vmdiskOperation(vmDiskOperation3, 3, HDD3);
});

var HDD3 = $extension.find("#vm_disk3");
HDD3.on('change', function () {
  if (HDD3.val()) HDD(HDD3, 3);
});

var vmDiskOperation4 = $extension.find("#vm_disk_operation4");
vmDiskOperation4.on('change', function () {
  vmdiskOperation(vmDiskOperation4, 4, HDD4);
});

var HDD4 = $extension.find("#vm_disk4");
HDD4.on('change', function () {
  if (HDD4.val()) HDD(HDD4, 4);
});

var vmDiskOperation5 = $extension.find("#vm_disk_operation5");
vmDiskOperation5.on('change', function () {
  vmdiskOperation(vmDiskOperation5, 5, HDD5);
});

var HDD5 = $extension.find("#vm_disk5");
HDD5.on('change', function () {
  if (HDD5.val()) HDD(HDD5, 5);
});

var hddCap1 = $extension.find("#hdd_cap1");
var hddCapRequired1 = $extension.find("#hdd_cap_required1");
hddCap1.on('change', function () {
  removedClass(hddCapRequired1, "empty");
});

hddCap1.on('blur', function () {
  if (hddCap1.val()) {
    checkingDiskSize(vmDiskOperation1, hddCap1, $('#current_size1').val(), 1);
  };
});


var hddCap2 = $extension.find("#hdd_cap2");
var hddCapRequired2 = $extension.find("#hdd_cap_required2");
hddCap2.on('change', function () {
  removedClass(hddCapRequired2, "empty");
});

hddCap2.on('blur', function () {
  if (hddCap2.val()) {
    checkingDiskSize(vmDiskOperation2, hddCap2, $('#current_size2').val(), 2);
  };
});

var hddCap3 = $extension.find("#hdd_cap3");
var hddCapRequired3 = $extension.find("#hdd_cap_required3");
hddCap3.on('change', function () {
  removedClass(hddCapRequired3, "empty");
});

hddCap3.on('blur', function () {
  if (hddCap3.val()) {
    checkingDiskSize(vmDiskOperation3, hddCap3, $('#current_size3').val(), 3);
  };
});

var hddCap4 = $extension.find("#hdd_cap4");
var hddCapRequired4 = $extension.find("#hdd_cap_required4");
hddCap4.on('change', function () {
  removedClass(hddCapRequired4, "empty");
});

hddCap4.on('blur', function () {
  if (hddCap4.val()) {
    checkingDiskSize(vmDiskOperation4, hddCap4, $('#current_size4').val(), 4);
  };
});

var hddCap5 = $extension.find("#hdd_cap5");
var hddCapRequired5 = $extension.find("#hdd_cap_required5");
hddCap5.on('change', function () {
  removedClass(hddCapRequired5, "empty");
});

hddCap5.on('blur', function () {
  if (hddCap5.val()) {
    checkingDiskSize(vmDiskOperation5, hddCap5, $('#current_size5').val(), 5);
  };
});


$("#add_disk").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    //alert("not disabled");
    $("#delete_disk").show();
    //if($("#delete_disk").class("disabled")){
    removedClass($("#delete_disk"), "disabled");
    if (currentDisk < maxDisks) {
      currentDisk++;
      showDiskFields(currentDisk);
      if (currentDisk === maxDisks) {
        $('#add_disk').hide();
      };
    };
  };
});

$("#delete_disk").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    $('#add_disk').show();
    removedClass($('#add_disk'), "disabled");
    if (currentDisk > 1) {
      hideDiskFields(currentDisk);
      currentDisk--;
      if (currentDisk === 1) {
        $('#delete_disk').hide();
      };
    };
  };
});

$('#add_vm').click(function () {
  if (!$(this).hasClass("disabled")) {

    if (validateFields()) {
      alert('Заполните корректно обязательные поля');
      return;
    }

    const operations = collectDiskOperations();

    var nodes = {
      hostname: vmName,
      vhd: operations
    };

    inputJson.push(nodes);
    updateJSON(vmName, vmHostName.val(), operations);
    addInputFormRecord(inputJson);

    vmCounter++;
    $('#delete_vm').show();
    removedClass($("#delete_vm"), "disabled");

    clearDiskFields();

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

    if (inputJson.length > 0) {
      var lastVM = inputJson.pop();
      var action = [];
      if (inputJson.length == 0) {
        $('#input_form').val(null);
        $('#json_update').val(null);
        $('#json_create').val(null);
        $('#json_delete').val(null);
      } else {
        addInputFormRecord(inputJson);
        vmHostDelete = lastVM.hostname;
        for (var i = lastVM.vhd.length - 1; i >= 0; i--) {
          var lastAction = lastVM.vhd[i].operation;
          if (!action.includes(lastAction)) action.push(lastAction);
        };
        if (action.includes('add') || action.includes('resize_down')) {
          deleteJson(vmHostDelete, $('#json_create').val(), '#json_create');
        };
        if (action.includes('resize_up')) {
          deleteJson(vmHostDelete, $('#json_update').val(), '#json_update');
        };
        if (action.includes('delete') || action.includes('resize_down')) {
          deleteJson(vmHostDelete, $('#json_delete').val(), '#json_delete');
        };

        // deleteJson(vmHostDelete, $('#json_update').val(), '#json_update');
        // deleteJson(vmHostDelete, $('#json_create').val(), '#json_create');
        // deleteJson(vmHostDelete, $('#json_delete').val(), '#json_delete');
        vmHostDelete = null;
      };

    }
    else {
      alert("newArray - else");
    }
    vmCounter--;
    if (vmCounter == 0) {
      $(this).addClass("disabled");
      $(this).hide();
    }

  };
});

$("#finish").on("change", function () {
  if (createVM || createVM == false) {
    //alert("finish");
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


function vmdiskOperation(vmDiskOperationN, numberDisk, HDDN) {
  removedClass($('#vm_disk_operation_required' + numberDisk), 'empty');
  removeHDDCup(numberDisk);
  if (vmDiskOperationN.val() == 'delete' || vmDiskOperationN.val() == 'resize_up'
    || vmDiskOperationN.val() == 'resize_down') {
    if (HDDN.val()) HDD(HDDN, numberDisk);
    toggleRowVisibility('#row_current_size' + numberDisk, true);
    toggleRowVisibility('#row_scsi_id' + numberDisk, true);

  } else {
    toggleRowVisibility('#row_current_size' + numberDisk, false);
    toggleRowVisibility('#row_scsi_id' + numberDisk, false);
    $('#current_size' + numberDisk).val(null);
    $('#scsi_id' + numberDisk).val(null);
  };

  if (vmDiskOperationN.val() == 'add' || vmDiskOperationN.val() == 'resize_up'
    || vmDiskOperationN.val() == 'resize_down') {
    toggleRowVisibility('#row_hdd_cap' + numberDisk, true);
    $('#hdd_cap' + numberDisk).toggleClass('required', true);

  } else {
    toggleRowVisibility('#row_hdd_cap' + numberDisk, false);
    $('#hdd_cap' + numberDisk).val(null);
    $('#hdd_cap' + numberDisk).toggleClass('required', false);
  };

  if (vmDiskOperationN.val() == 'add') {
    toggleRowVisibility('#row_vm_disk' + numberDisk, false);
    $('#vm_disk' + numberDisk).toggleClass('required', false);
    $('#vm_disk' + numberDisk).val(null);
  } else {
    toggleRowVisibility('#row_vm_disk' + numberDisk, true);
    $('#vm_disk' + numberDisk).toggleClass('required', true);
  };
};

function removeHDDCup(numberDisk) {
  toggleRowVisibility('#warning_hdd_up' + numberDisk, false);
  toggleRowVisibility('#warning_hdd_down' + numberDisk, false);
  $('#hdd_cap' + numberDisk).val(null);
}

function HDD(HDDN, numberDisk) {
  removedClass(HDDN, 'empty');
  removeHDDCup(numberDisk);
  if (HDDN.data('item').id) {
    var HDDSize = HDDN ? HDDN.data('item').custom_fields['HDD'] : "";
    var HDDScsi = HDDN ? HDDN.data('item').custom_fields['SCSI ID'] : "";
    $('#current_size' + numberDisk).val(HDDSize);
    $('#scsi_id' + numberDisk).val(HDDScsi);
  } else {
    $('#current_size' + numberDisk).val(null);
    $('#scsi_id' + numberDisk).val(null);
  };
};

function checkingDiskSize(vmDiskOperationN, hddCapN, currentSize, numberDisk) {
  var hddSizeCurr = parseFloat(currentSize);
  var hddSizeNew = parseFloat(hddCapN.val());
  if (vmDiskOperationN.val() == 'resize_up') {
    if (hddSizeNew > 0 && hddSizeNew > hddSizeCurr) {
      toggleRowVisibility('#warning_hdd_up' + numberDisk, false);
      $("#hdd_cap_required" + numberDisk).toggleClass("required", false);
    } else {
      toggleRowVisibility('#warning_hdd_up' + numberDisk, true);
      $("#hdd_cap_required" + numberDisk).toggleClass("required", true);
      hddCapN.val('').change();
    };
  } else if (vmDiskOperationN.val() == 'resize_down') {
    if (hddSizeNew > 0 && hddSizeNew < hddSizeCurr) {
      toggleRowVisibility('#warning_hdd_down' + numberDisk, false);
      $("#hdd_cap_required" + numberDisk).toggleClass("required", false);
    } else {
      hddCapN.val('').change();
      toggleRowVisibility('#warning_hdd_down' + numberDisk, true);
      $("#hdd_cap_required" + numberDisk).toggleClass("required", true);
    };
  };
};

function showDiskFields(diskNum) {
  toggleRowVisibility('#disk' + diskNum, true);
  $('#vm_disk_operation' + diskNum).toggleClass('required', true);
  $('#vm_disk' + diskNum).toggleClass('required', true);
};

function hideDiskFields(diskNum) {
  toggleRowVisibility('#disk' + diskNum, false);
  toggleRowVisibility('#row_vm_disk' + diskNum, true);
  toggleRowVisibility('#row_scsi_id' + diskNum, false);
  toggleRowVisibility('#row_current_size' + diskNum, false);
  toggleRowVisibility('#row_hdd_cap' + diskNum, false);

  $('#hdd_cap' + diskNum).toggleClass('required', false);
  $('#hdd_cap' + diskNum).toggleClass('invalid', false);
  $('#vm_disk_operation' + diskNum).toggleClass('required', false);
  $('#vm_disk' + diskNum).toggleClass('required', false);

  $('#vm_disk' + diskNum).val(null);
  $('#current_size' + diskNum).val(null);
  $('#scsi_id' + diskNum).val(null);
  $('#hdd_cap' + diskNum).val(null);
  $('#vm_disk_operation' + diskNum).val(null);
};

function validateFields() {
  var isError = false;
  if (!$('#name_is').val()) {
    $('#name_is').addClass('empty');
    isError = true;
    return isError;
  };
  if (!$('#vm_hostname').val()) {
    $('#vm_hostname').addClass('empty');
    isError = true;
    return isError;
  };
  isError = validateFieldsDisk(vmDiskOperation1, HDD1, 1);
  if (currentDisk > 1 && !isError) {
    isError = validateFieldsDisk(vmDiskOperation2, HDD2, 2);
  };
  if (currentDisk > 2 && !isError) {
    isError = validateFieldsDisk(vmDiskOperation3, HDD3, 3);
  };
  if (currentDisk > 3 && !isError) {
    isError = validateFieldsDisk(vmDiskOperation4, HDD4, 4);
  };
  if (currentDisk > 4 && !isError) {
    isError = validateFieldsDisk(vmDiskOperation5, HDD5, 5);
  };
  return isError;

};

function validateFieldsDisk(vmDiskOperationN, HDDN, numberDisk) {
  var isError = false;
  if (!vmDiskOperationN.val()) {
    $('#vm_disk_operation_required' + numberDisk).addClass('empty');
    isError = true;
    return isError;
  } else {
    if (vmDiskOperationN.val() != 'add') {
      if (!HDDN.val()) {
        HDDN.addClass('empty');
        isError = true;
        return isError;
      };
    };
    if (vmDiskOperationN.val() != 'delete') {
      if (!$('#hdd_cap' + numberDisk).val() || $('#hdd_cap' + numberDisk).hasClass('invalid')) {
        $('#hdd_cap_required' + numberDisk).addClass('empty');
        isError = true;
        return isError;
      };
    };
  };
  return isError;
};

function collectDiskOperations() {
  var ops = [];
  for (var i = 1; i <= currentDisk; i++) {
    const operation = $('#vm_disk_operation' + i).val();
    if (!operation) continue;

    const disk = {
      operation: operation,
      vm_disk: $('#vm_disk' + i).val(),
      current_size: $('#current_size' + i).val(),
      scsi_id: $('#scsi_id' + i).val(),
      hdd_cap: $('#hdd_cap' + i).val()
    };
    ops.push(disk);
  }
  return ops;
};

function updateJSON(vmName, vmID, operations) {
  var jsonUpdate = $('#json_update').val();
  var jsonCreate = $('#json_create').val();
  var jsonDelete = $('#json_delete').val();
  jsonUpdate = jsonUpdate && jsonUpdate != '' ? jsonUpdate.replace(/\n+$/m, '') : '';
  jsonCreate = jsonCreate && jsonCreate != '' ? jsonCreate.replace(/\n+$/m, '') : '';
  jsonDelete = jsonDelete && jsonDelete != '' ? jsonDelete.replace(/\n+$/m, '') : '';
  var newArrayUpdate = jsonUpdate && jsonUpdate != '' ? JSON.parse(jsonUpdate).nodes : [];
  var newArrayCreate = jsonCreate && jsonCreate != '' ? JSON.parse(jsonCreate).nodes : [];
  var newArrayDelete = jsonDelete && jsonDelete != '' ? JSON.parse(jsonDelete).nodes : [];

  var newVMUpdate = [];
  var newVMCreate = [];
  var newVMDelete = [];

  var newVM = {
    "hostname": vmName,
    "vm_id": vmID,
    "vhd": []
  };

  for (var i = 0; i < operations.length; i++) {

    //var vhdObj = {};
    var op = operations[i];

    // if (op.vm_disk) vhdObj.vhd_id = op.vm_disk;
    // if (op.hdd_cap) vhdObj.hdd_cap = op.hdd_cap;
    // if (op.scsi_id) vhdObj.scsi_id = op.scsi_id;

    if (op.operation === 'add' || op.operation === 'resize_down') {
      const vhdObj = createVHDObj(op, "create");
      newVMCreate.push(vhdObj);
    };
    if (op.operation === 'resize_up') {
      const vhdObj = createVHDObj(op, "update");
      newVMUpdate.push(vhdObj);
    };
    if (op.operation === 'delete' || op.operation === 'resize_down') {
      const vhdObj = createVHDObj(op, "delete");
      newVMDelete.push(vhdObj);
    };

  };

  if (newVMUpdate.length > 0) {
    newVM.vhd = newVMUpdate;
    newArrayUpdate.push(newVM);
    var nodes = {
      "nodes": newArrayUpdate
    };
    $('#json_update').val(JSON.stringify(nodes)).change();

  };

  if (newVMCreate.length > 0) {
    newVM.vhd = newVMCreate;
    newArrayCreate.push(newVM);
    var nodes = {
      "nodes": newArrayCreate
    };
    $('#json_create').val(JSON.stringify(nodes)).change();
  };

  if (newVMDelete.length > 0) {
    newVM.vhd = newVMDelete;
    newArrayDelete.push(newVM);
    var nodes = {
      "nodes": newArrayDelete
    };
    $('#json_delete').val(JSON.stringify(nodes)).change();
  };

};

function addInputFormRecord(inputJson) {
  var VMsData = inputJson;
  if (VMsData.length == 0) {
    $('#input_form').val(null);
  };
  var table = ' <table id="vm_table" border="1"><tr><th>';
  table += '№';
  table += '</th><th>';
  table += 'hostname';
  table += '</th><th>';
  table += 'дополнительные диски';
  table += '</th>';

  for (var index = 0; index < VMsData.length; index++) {
    var vmData = VMsData[index];
    var operationType = [];
    var scsi = [];
    var hddCap = [];
    var lenVhd = vmData.vhd.length;

    for (var i = 0; i < lenVhd; i++) {
      var op = vmData.vhd[i];
      switch (op.operation) {
        case "resize_up":
          operationType.push("Увеличение диска");
          break;
        case "add":
          operationType.push("Подключение нового диска");
          break
        case "delete":
          operationType.push("Удаление диска");
          break;
        case "resize_down":
          operationType.push("Уменьшение диска");
          break;
      };
      scsi.push(op.scsi_id);
      hddCap.push(op.hdd_cap);
    };

    table += '<tr><td>';
    table += index + 1;
    table += '</td><td>';
    table += (vmData.hostname || '');
    table += '</td><td>';
    table += (operationType[0] || '');
    table += ' ';
    table += (scsi[0] || '');
    if (hddCap[0]) {
      table += ' итоговый размер ';
      table += (hddCap[0] || '');
      table += ' Гб';
    };
    table += ';';
    if (lenVhd > 1) {
      table += '<br>';
      table += (operationType[1] || '');
      table += ' ';
      table += (scsi[1] || '');
      if (hddCap[1]) {
        table += ' итоговый размер ';
        table += (hddCap[1] || '');
        table += ' Гб';
      };
      table += ';';
    };
    if (lenVhd > 2) {
      table += '<br>';
      table += (operationType[2] || '');
      table += ' ';
      table += (scsi[2] || '');
      if (hddCap[2]) {
        table += ' итоговый размер ';
        table += (hddCap[2] || '');
        table += ' Гб';
      };
      table += ';';
    };
    if (lenVhd > 3) {
      table += '<br>';
      table += (operationType[3] || '');
      table += ' ';
      table += (scsi[3] || '');
      if (hddCap[3]) {
        table += ' итоговый размер ';
        table += (hddCap[3] || '');
        table += ' Гб';
      };
      table += ';';
    };
    if (lenVhd > 4) {
      table += '<br>';
      table += (operationType[4] || '');
      table += ' ';
      table += (scsi[4] || '');
      if (hddCap[4]) {
        table += ' итоговый размер ';
        table += (hddCap[4] || '');
        table += ' Гб';
      };
      table += ';';
    }
    table += '</td>';

  }

  table += '</table>';
  $('#input_form').val({ html: table });
};

function deleteJson(deleteHostName, jsonAction, jsonActionName) {
  jsonAction = jsonAction && jsonAction != '' ? jsonAction.replace(/\n+$/m, '') : '';
  var newArray = jsonAction && jsonAction != '' ? JSON.parse(jsonAction).nodes : [];

  if (newArray.length > 0) {
    var lastVM = newArray.pop();
    if (lastVM.hostname == deleteHostName) {
      if (newArray.length == 0) {
        $(jsonActionName).val(null);
      } else {
        var nodes = { "nodes": newArray };
        $(jsonActionName).val(JSON.stringify(nodes)).change();
      };

    };
  };
};

function clearDiskFields() {
  vmHostName.val(null);
  vmHostName.addClass('required');

  for (var index = 1; index <= currentDisk; index++) {
    hideDiskFields(index);
  };

  toggleRowVisibility('#disk1', true);
  $('#vm_disk_operation1').toggleClass('required', true);
  $('#vm_disk1').toggleClass('required', true);
  currentDisk = 1;
  $('#add_disk').show();
  $('#delete_disk').hide();

};

function finishChecked() {
  $("#change").hide();
  $("#name_is").readonly(true);
  clearDiskFields();
};

function finishUnChecked() {
  $("#change").show();
  if (vmCounter < maxVM) {
    $("#add_vm").show();
  }
  if (vmCounter > 1) {
    $("#delete_vm").show();
  }
  $("#name_is").readonly(false);
};

function createVHDObj(op, action) {
  var vhdObj = {};

  if (op.vm_disk && (action == "update" || action == "delete")) vhdObj.vhd_id = op.vm_disk;
  if (op.hdd_cap && (action == "update" || action == "create")) vhdObj.hdd_cap = op.hdd_cap;
  if (op.scsi_id && (action == "update" || action == "delete")) vhdObj.scsi_id = op.scsi_id;

  return vhdObj;
};

$(document).ready(function () {
  if ($("#json_update").val() || $('#json_create').val() || $('#json_delete').val()) {
    //alert("createVM - false");    
    createVM = false;
    const operations = collectDiskOperations();

    var nodes = {
      hostname: vmName,
      vhd: operations
    };

    inputJson.push(nodes);
  } else {
    //alert("createVM - true");
    createVM = true;
  };
});