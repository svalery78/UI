var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

//$(document).ready(function () {
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

  // 2. Жесткие диски

  //var HDDSize1;
  //var HDDScsi1;

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

  var vmDiskOperation1 = $extension.find("#vm_disk_operation1");
  vmDiskOperation1.on('change', function () {
    vmdiskOperation(vmDiskOperation1, 1);
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
    } else {
      toggleRowVisibility('#row_hdd_cap' + numberDisk, false);
      $('#hdd_cap' + numberDisk).val(null);
      $('#hdd_cap' + numberDisk).toggleClass('required', true);
    };
  }

  function HDD(HDDN, numberDisk) {
    var HDDSize = HDDN.data('item').custom_fields['HDD'];
    var HDDScsi = HDDN.data('item').custom_fields['SCSI ID'];
    $('#current_size' + numberDisk).val(HDDSize);
    $('#scsi_id' + numberDisk).val(HDDScsi);
  }

//});


