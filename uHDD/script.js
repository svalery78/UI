var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

//$(document).ready(function () {
//  alert('document ready');
var currentDisk = 1;
var maxDisks = 5;
var vmCounter = 0;
var maxVM = 10;
var vmID;
var inputJson = [];
// Helper function to show/hide rows
function toggleRowVisibility(selector, show) {
  $(selector).toggle(show);
}

// Helper function to clear values in a row
function clearRowValues(rowSelector) {
  $(rowSelector).find('input[type="text"], input[type="number"], select').val('');
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

var vmHostName = $extension.find('vm_hostname');
vmHostName.on('change', function () {
  //vmID =
});

// 2. Жесткие диски

var vmDiskOperation1 = $extension.find("#vm_disk_operation1");
vmDiskOperation1.on('change', function () {
  vmdiskOperation(vmDiskOperation1, 1);
});

var HDD1 = $extension.find("#vm_disk1");
HDD1.on('change', function () {
  HDD(HDD1, 1);
});

var vmDiskOperation2 = $extension.find("#vm_disk_operation2");
vmDiskOperation2.on('change', function () {
  vmdiskOperation(vmDiskOperation2, 2);
});

var HDD2 = $extension.find("#vm_disk2");
HDD2.on('change', function () {
  HDD(HDD2, 2);
});

var vmDiskOperation3 = $extension.find("#vm_disk_operation3");
vmDiskOperation3.on('change', function () {
  vmdiskOperation(vmDiskOperation3, 3);
});

var HDD3 = $extension.find("#vm_disk3");
HDD3.on('change', function () {
  HDD(HDD3, 3);
});

var vmDiskOperation4 = $extension.find("#vm_disk_operation4");
vmDiskOperation4.on('change', function () {
  vmdiskOperation(vmDiskOperation4, 4);
});

var HDD4 = $extension.find("#vm_disk4");
HDD4.on('change', function () {
  HDD(HDD4, 4);
});

var vmDiskOperation5 = $extension.find("#vm_disk_operation5");
vmDiskOperation5.on('change', function () {
  vmdiskOperation(vmDiskOperation5, 5);
});

var HDD5 = $extension.find("#vm_disk5");
HDD5.on('change', function () {
  HDD(HDD5, 5);
});


$("#add_disk").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    //alert("not disabled");
    $("#delete_disk").show();
    //if($("#delete_disk").class("disabled")){
    $("#delete_disk").removeClass("disabled");
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
    $('#add_disk').removeClass("disabled");
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

    if (!validateFields()) {
      alert('Заполните корректно обязательные поля');
      return;
    }

    const operations = collectDiskOperations();
    var nodes = {
      hostname: vmHostName,
      vhd: operations
    }
    inputJson.push(nodes);
    updateJSON(vmHostName, vmID, operations);
    addInputFormRecord(inputJson);

    vmCounter++;
    $('#delete_vm').show();
    $("#delete_vm").removeClass("disabled");

    clearDiskFields();

    if (vmCounter >= maxVM) {
      //alert('Достигнут лимит добавления ВМ.');
      $(this).addClass("disabled");
      $(this).hide();
      return;
    }
  };
});


function vmdiskOperation(vmDiskOperationN, numberDisk) {
  if (vmDiskOperationN.hasClass('empty')) vmDiskOperationN.removeClass('empty');
  if (vmDiskOperationN.val() == 'delete' || vmDiskOperationN.val() == 'resize_up'
    || vmDiskOperationN.val() == 'resize_down') {
    toggleRowVisibility('#row_current_size' + numberDisk, true);
    toggleRowVisibility('#row_scsi_id' + numberDisk, true);
  } else {
    toggleRowVisibility('#row_current_size' + numberDisk, false);
    toggleRowVisibility('#row_scsi_id' + numberDisk, false);
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
  } else {
    toggleRowVisibility('#row_vm_disk' + numberDisk, true);
    $('#vm_disk' + numberDisk).toggleClass('required', true);
  };
};

function HDD(HDDN, numberDisk) {
  if (HDDN.data('item').id) {
    var HDDSize = HDDN.data('item').custom_fields['HDD'];
    var HDDScsi = HDDN.data('item').custom_fields['SCSI ID'];
    $('#current_size' + numberDisk).val(HDDSize);
    $('#scsi_id' + numberDisk).val(HDDScsi);
  } else {
    $('#current_size' + numberDisk).val(null);
    $('#scsi_id' + numberDisk).val(null);
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
  if (!$('#vm_hostname').val()) {
    $('#vm_hostname').addClass('empty');
    isError = true;
    return isError;
  };
  isError = validateFieldsDisk(vmDiskOperation1, HDD1, 1);

  alert($('#disk2').css('display'));
  if ($('#disk2').css('display') != 'none') {
    isError = validateFieldsDisk(vmDiskOperation2, HDD2, 2);
  };
  if ($('#disk3').css('display') != 'none') {
    isError = validateFieldsDisk(vmDiskOperation3, HDD3, 3);
  };
  if ($('#disk4').css('display') != 'none') {
    isError = validateFieldsDisk(vmDiskOperation4, HDD4, 4);
  };
  if ($('#disk5').css('display') != 'none') {
    isError = validateFieldsDisk(vmDiskOperation5, HDD5, 2);
  };
  return isError;

};

function validateFieldsDisk(vmDiskOperationN, HDDN, numberDisk) {
  var isError = false;
  if (!vmDiskOperationN.val()) {
    vmDiskOperationN.addClass('empty');
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
        $('#hdd_cap' + numberDisk).addClass('empty');
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
      operation,
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
  var jsonUpdate = $('json_update').val();
  var jsonCreate = $('json_create').val();
  var jsonDelete = $('json_delete').val();
  jsonUpdate = jsonUpdate.replace(/\n+$/m, '');
  jsonCreate = jsonCreate.replace(/\n+$/m, '');
  jsonDelete = jsonDelete.replace(/\n+$/m, '');
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
  }

  for (var op of operations) {
    var vhdObj = {};

    if (op.vm_disk) vhdObj.vhd_id = op.vm_disk;
    if (op.hdd_cap) vhdObj.hdd_cap = op.hdd_cap;
    if (op.scsi_id) vhdObj.scsi_id = op.scsi_id;    

    if (op.operation === 'add' || op.operation === 'resize_down') {
      newVMCreate.push(vhdObj);
    };
    if (op.operation === 'resize_up') {
      newVMUpdate.push(vhdObj);
    };
    if (op.operation === 'delete') {
      newVMDelete.push(vhdObj);
    };

  };

  if(newVMUpdate.length > 1){
    newVM.vhd = newVMUpdate;
    newArrayUpdate.push(newVM);
    var nodes = {
      "nodes": newArrayUpdate
    };
    $('json_update').val(JSON.stringify(nodes)).change();    
  };

  if(newVMCreate.length > 1){
    newVM.vhd = newVMCreate;
    newArrayCreate.push(newVM);
    var nodes = {
      "nodes": newArrayCreate
    };
    $('json_create').val(JSON.stringify(nodes)).change();
  };

  if(newVMDelete.length > 1){
    newVM.vhd = newVMDelete;
    newArrayDelete.push(newVM);
    var nodes = {
      "nodes": newArrayDelete
    };
    $('json_delete').val(JSON.stringify(nodes)).change();
  };

};

function addInputFormRecord(inputJson) {
  //var $VMs = $("#input_json").val();
  //alert($("#input_json").val());
  //$VMs = $VMs.replace(/\n+$/m, '');
  var VMsData = inputJson;
  //alert("addVMToTable");
  if (VMsData.length == 0) {
      $('#input_form').val(null);
  };
  var table = ' <table id="vm_table" border="1"><tr><th>';
  table += '№';
  table += '</th><th>';
  table += 'hostname';
  table += '</th><th>';  
  table += 'дополнительные диски';
  table += '</th><th>';  

  for (var index = 0; index < VMsData.length; index++) {
    var vmData = VMsData[index];
    var operationType = [];
    var scsi = [];
    var hddCap = [];
    for (var op of vmData.vhd) {
      switch(op.operation){
        case "resize_up": operationType.push("Увеличение диска");
        case "add": operationType.push("Подключение нового диска");
        case "delete": operationType.push("Удаление диска");
        case "resize_down": operationType.push("Уменьшение диска");
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
    table += ' итоговый размер';
    table += (hddCap[0] || '');
    table += ' Гб; <br>';
    table += (operationType[1] || '');
    table += ' ';
    table += (scsi[1] || '');
    table += ' итоговый размер';
    table += (hddCap[1] || '');
    table += ' Гб; <br>';
    table += (operationType[2] || '');
    table += ' ';
    table += (scsi[2] || '');
    table += ' итоговый размер';
    table += (hddCap[2] || '');
    table += ' Гб; <br>';
    table += (operationType[3] || '');
    table += ' ';
    table += (scsi[3] || '');
    table += ' итоговый размер';
    table += (hddCap[3] || '');
    table += ' Гб; <br>';
    table += (operationType[4] || '');
    table += ' ';
    table += (scsi[4] || '');
    table += ' итоговый размер';
    table += (hddCap[4] || '');
    table += ' Гб; <br>';


  }
  
  table += '</table>';
  $('#input_form').val({ html: table });
};

function clearDiskFields(){
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




//});


