var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

$(document).ready(function() {
    var currentDisk = 1;
    var currentVM = 1;
    const MAX_DISKS = 5;
    const MAX_VMS = 10;
  
    // Инициализация скрытых полей
    hideDiskGroups(2);
    toggleEmergencyFields();
    toggleOperationFields(1);
  
    // Обработчики для экстренного изменения
    $('#is_ex_change').change(toggleEmergencyFields);
    
    // Обработчики для операций с дисками
    $('#add_disk').click(addDisk);
    $('#delete_disk').click(removeDisk);
    
    // Обработчики для операций с ВМ
    $('#add_vm').click(addVM);
    $('#delete_vm').click(removeVM);
    
    // Обработчик сохранения
    $('#save_btn').click(saveForm);
  
    // Динамическая обработка изменений операций
    $('[id^="vm_disk_operation"]').change(function() {
      const diskNum = this.id.match(/\d+/)[0];
      toggleOperationFields(diskNum);
    });
  
    function toggleEmergencyFields() {
      const isEmergency = $('#is_ex_change').is(':checked');
      $('#row_justification, #inc_desc').toggle(isEmergency);
    }
  
    function hideDiskGroups(startFrom) {
      for (var i = startFrom; i <= MAX_DISKS; i++) {
      //  $(`#vm_disk_operation${i}`).closest('.row').hide();
      }
    }
  
    function addDisk() {
      if (currentDisk >= MAX_DISKS) return;
      
      currentDisk++;
      //$(`#vm_disk_operation${currentDisk}`).closest('.row').show();
      
      if (currentDisk === MAX_DISKS) $('#add_disk').hide();
      $('#delete_disk').show();
    }
  
    function removeDisk() {
      //$(`#vm_disk_operation${currentDisk}`).closest('.row').hide().find('input, select').val('');
      currentDisk--;
      
      if (currentDisk === 1) $('#delete_disk').hide();
      $('#add_disk').show();
    }
  
    function toggleOperationFields(diskNum) {
      //const operation = $(`#vm_disk_operation${diskNum}`).val();
      const showSize = ['delete', 'resize_up', 'resize_down'].includes(operation);
      const showCap = ['add', 'resize_up', 'resize_down'].includes(operation);
  
      //$(`#current_size${diskNum}, #scsi_id${diskNum}`).closest('.row').toggle(showSize);
      //$(`#hdd_cap${diskNum}`).closest('.row').toggle(showCap).toggleClass('required', showCap);
    }
  
    function addVM() {
      if (currentVM >= MAX_VMS || !validateVM()) return;
      
      // Формирование JSON
      const vmData = {
        hostname: $('#vm_hostname').val(),
        disks: []
      };
  
      for (var i = 1; i <= currentDisk; i++) {
        const disk = {
          operation: $('#vm_disk_operation'+i).val(),
          disk: $('#vm_disk' +i).val(),
          size: $('#hdd_cap' +i).val()
        };
        vmData.disks.push(disk);
      }
  
      updateJsonFields(vmData);
      updateInputForm(vmData);
      currentVM++;
    }
  
    // function updateJsonFields(vmData) {
    //   vmData.disks.forEach(disk => {
    //     const jsonEntry = {
    //       hostname: vmData.hostname,
    //       vhd_id: disk.disk,
    //       hdd_cap: disk.size
    //     };
  
    //     switch(disk.operation) {
    //       case 'add': $('#json_create').append(JSON.stringify(jsonEntry)); break;
    //       case 'resize_up': $('#json_update').append(JSON.stringify(jsonEntry)); break;
    //       case 'delete': $('#json_delete').append(JSON.stringify(jsonEntry)); break;
    //       case 'resize_down': 
    //         $('#json_create').append(JSON.stringify(jsonEntry));
    //         $('#json_delete').append(JSON.stringify({vhd_id: disk.disk}));
    //         break;
    //     }
    //   });
    // }
  
    function validateVM() {
      var isValid = true;
      $('.required:visible').each(function() {
        if (!$(this).val()) {
          $(this).addClass('invalid');
          isValid = false;
        }
      });
      return isValid;
    }
  
    function saveForm() {
      if (!$('#finish').is(':checked')) {
        alert('Заполните все обязательные поля и отметьте завершение');
        return;
      }
      // Логика сохранения
    }
  });