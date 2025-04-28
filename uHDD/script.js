var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

$(document).ready(function() {
    let currentDisk = 1;
    const maxDisks = 5;
    let vmCounter = 0;
    const maxVM = 10;
  
    setupDiskOperationHandlers();
  
    $('#add_disk').click(function() {
      if (currentDisk < maxDisks) {
        currentDisk++;
        showDiskFields(currentDisk);
  
        $('#delete_disk').show();
        if (currentDisk === maxDisks) {
          $('#add_disk').hide();
        }
      }
    });
  
    $('#delete_disk').click(function() {
      if (currentDisk > 1) {
        hideDiskFields(currentDisk);
        currentDisk--;
  
        $('#add_disk').show();
        if (currentDisk === 1) {
          $('#delete_disk').hide();
        }
      }
    });
  
    $('#add_vm').click(function() {
      if (vmCounter >= maxVM) {
        alert('Достигнут лимит добавления ВМ.');
        return;
      }
  
      if (!validateFields()) {
        alert('Заполните корректно обязательные поля!');
        return;
      }
  
      const vmName = $('#vm_hostname').text().trim();
      if (!vmName) {
        alert('Выберите виртуальную машину!');
        return;
      }
  
      const operations = collectDiskOperations();
      if (operations.length === 0) {
        alert('Не выбраны операции над дисками!');
        return;
      }
  
      updateJSON(vmName, operations);
      addInputFormRecord(vmName, operations);
  
      vmCounter++;
      $('#delete_vm').show();
  
      clearDiskFields();
    });
  
    $('#delete_vm').click(function() {
      if (vmCounter > 0) {
        vmCounter--;
  
        ['json_create', 'json_update', 'json_delete'].forEach(id => {
          const $textarea = $('#' + id);
          try {
            let json = $textarea.val() ? JSON.parse($textarea.val()) : { nodes: [] };
            if (json.nodes.length > 0) {
              json.nodes.pop();
              $textarea.val(JSON.stringify(json, null, 2));
            }
          } catch (e) {}
        });
  
        const lines = $('#input_form').html().split('<br>');
        lines.pop();
        $('#input_form').html(lines.join('<br>'));
  
        if (vmCounter === 0) {
          $('#delete_vm').hide();
        }
      }
    });
  
    $('#save').click(function() {
      if (!$('#finish').is(':checked')) {
        alert('Не заполнены обязательные поля. Поставьте галочку для: Заполнение формы завершено или заполните данные для Виртуальной машины');
        return;
      }
  
      alert('Запрос успешно сформирован и отправлен!');
      // Здесь можно добавить реальную отправку запроса
    });
  
    function setupDiskOperationHandlers() {
      for (let i = 1; i <= maxDisks; i++) {
        $('#vm_disk_operation' + i).change(function() {
          handleOperationChange(i);
        });
      }
    }
  
    function handleOperationChange(diskNum) {
      const operation = $('#vm_disk_operation' + diskNum).val();
  
      if (!operation) {
        $('#current_size' + diskNum).closest('.row').hide();
        $('#scsi_id' + diskNum).closest('.row').hide();
        $('#hdd_cap' + diskNum).closest('.row').hide();
        return;
      }
  
      if (operation === 'add') {
        $('#current_size' + diskNum).closest('.row').hide();
        $('#scsi_id' + diskNum).closest('.row').hide();
        $('#hdd_cap' + diskNum).closest('.row').show();
      }
      else if (operation === 'delete') {
        $('#current_size' + diskNum).closest('.row').show();
        $('#scsi_id' + diskNum).closest('.row').show();
        $('#hdd_cap' + diskNum).closest('.row').hide();
      }
      else if (operation === 'resize_up' || operation === 'resize_down') {
        $('#current_size' + diskNum).closest('.row').show();
        $('#scsi_id' + diskNum).closest('.row').show();
        $('#hdd_cap' + diskNum).closest('.row').show();
      }
    }
  
    function showDiskFields(diskNum) {
      $('#vm_disk' + diskNum).closest('.row').show();
      $('#current_size' + diskNum).closest('.row').show();
      $('#scsi_id' + diskNum).closest('.row').show();
      $('#hdd_cap' + diskNum).closest('.row').show();
      $('#vm_disk_operation' + diskNum).closest('.row').show();
    }
  
    function hideDiskFields(diskNum) {
      $('#vm_disk' + diskNum).closest('.row').hide();
      $('#current_size' + diskNum).closest('.row').hide();
      $('#scsi_id' + diskNum).closest('.row').hide();
      $('#hdd_cap' + diskNum).closest('.row').hide();
      $('#vm_disk_operation' + diskNum).closest('.row').hide();
  
      $('#vm_disk' + diskNum).empty();
      $('#current_size' + diskNum).val('');
      $('#scsi_id' + diskNum).val('');
      $('#hdd_cap' + diskNum).val('');
      $('#vm_disk_operation' + diskNum).val('');
    }
  
    function validateFields() {
      let valid = true;
      for (let i = 1; i <= currentDisk; i++) {
        const operation = $('#vm_disk_operation' + i).val();
        const hddCap = $('#hdd_cap' + i).val();
  
        if (!operation) valid = false;
        if ((operation === 'add' || operation === 'resize_up' || operation === 'resize_down') && (!hddCap || hddCap <= 0)) valid = false;
      }
      return valid;
    }
  
    function collectDiskOperations() {
      let ops = [];
      for (let i = 1; i <= currentDisk; i++) {
        const operation = $('#vm_disk_operation' + i).val();
        if (!operation) continue;
  
        const disk = {
          operation,
          vm_disk: $('#vm_disk' + i).text().trim(),
          current_size: $('#current_size' + i).val(),
          scsi_id: $('#scsi_id' + i).val(),
          hdd_cap: $('#hdd_cap' + i).val()
        };
        ops.push(disk);
      }
      return ops;
    }
  
    function updateJSON(vmName, operations) {
      operations.forEach(op => {
        let jsonField = '';
        if (op.operation === 'add' || op.operation === 'resize_down') {
          jsonField = 'json_create';
        }
        if (op.operation === 'resize_up') {
          jsonField = 'json_update';
        }
        if (op.operation === 'delete') {
          jsonField = 'json_delete';
        }
  
        if (!jsonField) return;
  
        const $textarea = $('#' + jsonField);
        let json = {};
        try {
          json = $textarea.val() ? JSON.parse($textarea.val()) : { nodes: [] };
        } catch (e) {
          json = { nodes: [] };
        }
  
        let node = json.nodes.find(n => n.hostname === vmName);
        if (!node) {
          node = { hostname: vmName, vhd: [] };
          json.nodes.push(node);
        }
  
        const vhdObj = {};
        if (op.vm_disk) vhdObj.vhd_id = op.vm_disk;
        if (op.hdd_cap) vhdObj.hdd_cap = op.hdd_cap;
        if (op.scsi_id) vhdObj.scsi_id = op.scsi_id;
  
        node.vhd.push(vhdObj);
  
        $textarea.val(JSON.stringify(json, null, 2));
      });
    }
  
    function addInputFormRecord(vmName, operations) {
      let content = vmCounter + 1 + '. ' + vmName + ' ';
      operations.forEach(op => {
        let opLabel = '';
        switch (op.operation) {
          case 'add': opLabel = 'создать диск итоговый размер: ' + op.hdd_cap + ' Гб'; break;
          case 'delete': opLabel = 'удалить диск ' + op.scsi_id; break;
          case 'resize_up': opLabel = 'увеличить диск ' + op.scsi_id + ' итоговый размер ' + op.hdd_cap + ' Гб'; break;
          case 'resize_down': opLabel = 'уменьшить диск ' + op.scsi_id + ' итоговый размер ' + op.hdd_cap + ' Гб'; break;
        }
        content += opLabel + '; ';
      });
  
      const current = $('#input_form').html();
      $('#input_form').html(current + '<br>' + content);
    }
  
    function clearDiskFields() {
      for (let i = 1; i <= currentDisk; i++) {
        $('#vm_disk_operation' + i).val('');
        $('#vm_disk' + i).empty();
        $('#current_size' + i).val('');
        $('#scsi_id' + i).val('');
        $('#hdd_cap' + i).val('');
  
        if (i > 1) {
          hideDiskFields(i);
        } else {
          $('#current_size' + i).closest('.row').hide();
          $('#scsi_id' + i).closest('.row').hide();
          $('#hdd_cap' + i).closest('.row').hide();
        }
      }
  
      currentDisk = 1;
      $('#add_disk').show();
      $('#delete_disk').hide();
      $('#vm_hostname').empty();
    }
  });