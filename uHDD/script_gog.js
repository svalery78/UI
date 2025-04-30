var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

$(document).ready(function () {
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

        if(!isChecked){
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
        } ;

        $("#inc_desc").val(null);
        toggleRowVisibility('#row_inc_desc', isShow);
        $('#inc_desc').toggleClass('required', isShow);
    });


    // 2. Populate "Наименование ИС" dropdown
    $.getJSON('data.json', function (data) {  // Assuming you have a data.json file
        $.each(data.name_is, function (key, value) {
            $('#name_is').append($('<option>').val(key).text(value));
        });
    });

    // 3. Populate "Имя Виртуальной машины" dropdown, filtering by selected IS
    // $('#name_is').on('change', function () {
    //     const selectedIS = $(this).val();
    //     $('#vm_hostname').empty().append($('<option>').val('').text('Select...')); // Clear and add default option

    //     $.getJSON('data.json', function (data) {
    //         $.each(data.vm_hostnames, function (key, vm) {
    //             if (vm.is_id === selectedIS) {
    //                 $('#vm_hostname').append($('<option>').val(key).text(vm.name));
    //             }
    //         });
    //     });
    // });

    // 4. Disk operations show/hide
    $('.vm-disk-operation').on('change', function () {
        const selectedOperation = $(this).val();
        const diskSection = $(this).closest('.disk-section');
        const diskNumber = diskSection.data('disk-number');

        // Hide all related fields first
        diskSection.find('.current-size-row, .scsi-id-row, .hdd-cap-row').hide();
        diskSection.find('.current-size, .scsi-id, .hdd-cap').removeClass('required');

        if (selectedOperation) {
            // Show relevant fields based on the operation
            switch (selectedOperation) {
                case 'add':
                case 'resize_up':
                case 'resize_down':
                    diskSection.find('.hdd-cap-row').show();
                    diskSection.find('.hdd-cap').addClass('required');
                    break;
                case 'delete':
                    // No specific fields to show for delete (you can add confirmation)
                    break;
            }
        }
    });

    // Add Disk button click
    var diskCount = 1;
    $('#add-disk-button').on('click', function () {
        diskCount++;
        if (diskCount <= 5) {
            $('.disk-section[data-disk-number="' + diskCount + '"]').show();
            // Optionally clear values for the new section
            //clearRowValues(`.disk-section[data-disk-number="${diskCount}"]`);
        }
    });

    // 5. Populate "Диск N" dropdown (Simplified, assuming data structure)
    $('#vm_hostname').on('change', function () {
        const selectedVM = $(this).val();

        $('.vm-disk').each(function () {
            const $this = $(this);
            const diskNumber = $this.closest('.disk-section').data('disk-number');
            $this.empty().append($('<option>').val('').text('Select...')); // Clear and add default

            $.getJSON('data.json', function (data) {
                $.each(data.vm_disks, function (key, disk) {
                    if (disk.vm_hostname === selectedVM) { // Assuming your data has a vm_hostname field
                        $this.append($('<option>').val(key).text(disk.name)); // or the appropriate disk property
                    }
                });
            });
        });
    });

    // Helper function to get all disk-related data
    function getDiskData() {
        const diskData = [];
        for (var i = 1; i <= 5; i++) {
            const section = $('.disk-section[data-disk-number="' + i + '"]');
            if (section.is(':visible')) {
                const operation = section.find('.vm-disk-operation').val();
                const disk = section.find('.vm-disk').val(); // Or disk name/value
                const currentSize = section.find('.current-size').val();
                const scsiId = section.find('.scsi-id').val();
                const hddCap = section.find('.hdd-cap').val();

                diskData.push({
                    operation: operation,
                    disk: disk,
                    currentSize: currentSize,
                    scsiId: scsiId,
                    hddCap: hddCap
                });
            }
        }
        return diskData;
    }

    // 6. Validation and Save
    $('#save-button').on('click', function () {
        var isValid = true;
        $('#error-message').text(''); // Clear previous errors

        // Basic validation function
        function validateField(field) {
            if (field.hasClass('required') && !field.val()) {
                field.addClass('invalid');
                return false;
            }
            field.removeClass('invalid'); // Remove invalid class if the field is not empty
            return true;
        }

        // Validate required fields
        $('.required').each(function () {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        const diskData = getDiskData(); // Get disk data for validation

        if (diskData.length === 0 && !$('#finish').is(':checked')) {
            $('#error-message').text('Please fill in disk information or check "Заполнение формы завершено".');
            isValid = false;
        }

        if (!isValid) {
            $('#error-message').text('Please correct the errors above.');
            return; // Stop if validation fails
        }

        // 7. Collect data for JSON
        const jsonData = {
            is_ex_change: $('#is_ex_change').is(':checked'),
            justification: $('#justification').val(),
            inc_desc: $('#inc_desc').val(),
            name_is: $('#name_is').val(),
            vm_hostname: $('#vm_hostname').val(),
            disks: diskData,
            finish: $('#finish').is(':checked')
        };

        // Populate JSON output
        $('#json_create').val(JSON.stringify(generateJsonCreate(jsonData), null, 2));
        $('#json_update').val(JSON.stringify(generateJsonUpdate(jsonData), null, 2));
        $('#json_delete').val(JSON.stringify(generateJsonDelete(jsonData), null, 2));
        $('#input_form').text(generateInputForm(jsonData));
        // 8. Generate JSON create, update, and delete based on your logic
        function generateJsonCreate(data) {
            const createData = {
                nodes: []
            };

            if (!data.vm_hostname || data.disks.length === 0) {
                return createData;
            }
            const node = {
                hostname: data.vm_hostname,
                vhd: []
            };

            //  data.disks.forEach(disk => {
            //     if (disk.operation === 'add') {
            //         node.vhd.push({
            //             "hdd_cap": disk.hddCap
            //         });
            //     }
            //});
            if (node.vhd.length > 0)
                createData.nodes.push(node);
            return createData;
        }

        function generateJsonUpdate(data) {
            const updateData = {
                nodes: []
            };
            if (!data.vm_hostname || data.disks.length === 0) {
                return updateData;
            }

            const node = {
                hostname: data.vm_hostname,
                vhd: []
            };

            // data.disks.forEach(disk => {
            //     if (disk.operation === 'resize_up' || disk.operation === 'resize_down') {
            //         node.vhd.push({
            //             "vhd_id": disk.disk,
            //             "hdd_cap": disk.hddCap,
            //             "scsi_id":disk.scsiId
            //         });
            //     }
            // });
            if (node.vhd.length > 0)
                updateData.nodes.push(node);
            return updateData;
        }

        function generateJsonDelete(data) {
            const deleteData = {
                nodes: []
            };
            if (!data.vm_hostname || data.disks.length === 0) {
                return deleteData;
            }
            const node = {
                hostname: data.vm_hostname,
                vhd: []
            };

            // data.disks.forEach(disk => {
            //     if (disk.operation === 'delete') {
            //         node.vhd.push({
            //             "vhd_id": disk.disk,
            //             "scsi_id":disk.scsiId
            //         });
            //     }
            // });
            if (node.vhd.length > 0)
                deleteData.nodes.push(node);
            return deleteData;
        }

        // Function to generate input_form text (simplified example)
        function generateInputForm(data) {
            var inputFormText = '';
            if (!data.vm_hostname) {
                return "";
            }
            inputFormText += 'hostname: ' + data.vm_hostname + '\n';
            // data.disks.forEach(disk => {
            //     inputFormText += `operation: ${disk.operation},  disk: ${disk.disk}, scsi_id: ${disk.scsiId}, hdd_cap: ${disk.hddCap}\n`
            // });

            return inputFormText;
        }
        alert('Form data saved.  Check the "Technical Information" section.');
    });
});