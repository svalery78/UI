var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var $need_os = $extension.find('#need_os');
var $need_os_row = $need_os.closest('.row');
var $count_vm = 1;
var $VM;
var adminListNodes;

var adminList = $extension.find("#admin_list");
adminList.on('change', function() {
  //alert('change adminList');      
  adminListNodes = adminList.data('items').map(function(item){
    return {
      id: item.id,
      email: item.primary_email
    };          
  });
  //alert(JSON.stringify(adminListNodes));
});


$("#dr_cluster").on("change", function () {
  if ($(this).is(":checked")) {
    $(this).prop("checked", false);
    $(this).readonly(true);
    $("#dr_cluster_warning").show();
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

$("#vm_service").on("change", function () {
  if ($("#vm_service").val() === 'среда_исполнения') {
    $("#desc_admin").parent().show();
    $("#desc_base").parent().hide();
    $("#desc_base").val(null).change();
    $("#instruction").hide();
  }
  else {
    if ($("#vm_service").val() === 'среда_виртуализации') {
      $("#desc_base").parent().show();
      $("#desc_admin").parent().hide();
      $("#desc_admin").val(null).change();
    }
    else {
      $("#desc_admin").parent().hide();
      $("#desc_admin").val(null).change();
      $("#desc_base").parent().hide();
      $("#desc_base").val(null).change();
    }
  }
});

// $("#additional_disks").on("change",function(){
//   if($(this).is(":checked")){
//     $("#for_disk").show();
//   }else{
//     $("#for_disk").hide();
//   }
// });

$("#vm_add_disk").on("change", function () {
  if ($(this).is(":checked")) {
    //alert($(this).readonly());
    //$(this).prop("checked", false);
    $("#additional_disks").show();
    //
    //$(this).readonly(true);
  } else {
    $("#additional_disks").hide();
  }
});


$("#add_disk").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    //alert("not disabled");
    $("#delete_disk").show();
    //if($("#delete_disk").class("disabled")){
    $("#delete_disk").removeClass("disabled");
    //}  

    if ($("#disk2").css("display") == "none") {
      //alert($("#disk2").css("display")=="none");
      $("#disk2").show();
    } else {
      //alert("else");
      if ($("#disk3").css("display") == "none") {
        //alert($("#disk3").css("display")=="none");
        $("#disk3").show();
      } else {
        //alert("else");
        if ($("#disk4").css("display") == "none") {
          //alert($("#disk3").css("display")=="none");
          $("#disk4").show();
        } else {
          if ($("#disk5").css("display") == "none") {
            //alert($("#disk3").css("display")=="none");
            $("#disk5").show();
            $(this).addClass("disabled");
          }
        }
      }
    }
    //alert("add_disk");
  }


});

$("#delete_disk").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    //alert($("#disk5").css("display")=="none");
    if (!($("#disk5").css("display") == "none")) {
      //alert($("#disk5").css("display")=="none");
      $("#vm_disk5").val(null);
      $("#vm_disk5_letter").val(null);
      $("#disk5").hide();
      $("#add_disk").removeClass("disabled");
    } else {
      //alert("else 5");
      if (!($("#disk4").css("display") == "none")) {
        //alert($("#disk3").css("display")=="none");
        $("#vm_disk4").val(null);
        $("#vm_disk4_letter").val(null);
        $("#disk4").hide();
      } else {
        //alert("else 4");
        if (!($("#disk3").css("display") == "none")) {
          //alert($("#disk3").css("display")=="none");
          $("#vm_disk3").val(null);
          $("#vm_disk3_letter").val(null);
          $("#disk3").hide();
        } else {
          //alert("else 3");
          //alert(!($("#disk2").css("display")=="none"));
          if (!($("#disk2").css("display") == "none")) {
            //alert("disk2 - hide");
            //alert($("#vm_disk2").val());
            $("#vm_disk2").val(null);
            $("#vm_disk2_letter").val(null);
            $("#disk2").hide();
            $(this).addClass("disabled");
            //  } 
          }
        }
      }
    }
  }
  //alert("delete_disk");

  //$(this).addClass("disabled");
});

$("#add_vm").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    //alert($(this).readonly());
    //$(this).prop("checked", false);
    
    $("#delete_vm").show();
    $("#delete_vm").removeClass("disabled");
    if ($count_vm < 21) {
      //alert($count_vm);
      addVM();
      resetValueVM();
      $count_vm++;
    } else {
      $(this).addClass("disabled");
    }
    //
    //$(this).readonly(true);
  } else {
    //$(this).addClass("disabled");
  }
});

$("#copy_vm").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    //alert($(this).readonly());
    //$(this).prop("checked", false);
    $("#delete_vm").show();
    $("#delete_vm").removeClass("disabled");
    if ($count_vm < 20) {
      //alert($count_vm);
      addVM();      
      //resetValueVM();
      $count_vm++;
    } else {
      $(this).addClass("disabled");
      $("#add_vm").addClass("disabled");
    }
    //
    //$(this).readonly(true);
  } else {
    //$(this).addClass("disabled");
  }
});

$("#delete_vm").on("click", function () {
  if (!$(this).hasClass("disabled")) {
    //alert("delete_vm");
    //$(this).prop("checked", false);
    $("#add_vm").show();
    $("#add_vm").removeClass("disabled");
    $("#copy_vm").show();
    $("#copy_vm").removeClass("disabled");
    var $package = $("#input_json").val();
    //alert($("#input_json").val());
    $package = $package.replace(/\n+$/m, '');
    var packageData = $package && $package != '' ? JSON.parse($package) : null;
    //var packageData = $package && $package != '' ? $package : null;
    var newArray = packageData ? packageData.nodes : [];
    //alert(newArray.length);
    if (newArray.length) {
      //alert("newArray - if");
      var lastVM = newArray.pop();
      //alert(newArray.length);
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
    }
    //
    //$(this).readonly(true);
  } else {
    //$(this).addClass("disabled");
  }
  addVMToTable();
});

function addVM() {
  //var VM = {
  // return $VM = {
  //   "vm": $count_vm
  // }
  //var ISName = $extension.find("#name_is");
  //alert(ISName);
  //alert(JSON.stringify(ISName));
  //var ISNameID = ISName.data('item').assetID;
  //alert(ISNameID);

  var $package = $("#input_json").val();
  //alert($("#input_json").val());
  $package = $package.replace(/\n+$/m, '');
  var packageData = $package && $package != '' ? JSON.parse($package) : null;
  //var packageData = $package && $package != '' ? $package : null;
  var newArray = packageData ? packageData.nodes : [];
  if (!packageData){
    var ISName = $extension.find("#name_is");
    alert("test 1");
    alert(JSON.stringify(adminListNodes));
    //var adminList = $extension.find("#admin_list");
    // adminList.on('change', function() {
    //   alert('change adminList');
    //   alert(adminList.data('items').id);
    // })


    packageData = {
      //"is_id": ISName.data('item').id,
      "is_id": $("#name_is").val(),
      "is_dc_id": ISName.data('item').custom_fields['Идентификатор ЦОД'],
      "admin_list": adminListNodes
    };

  }
  //alert(newArray);
  var newVM = {
    "vm": $count_vm,
    "vm_networkcidr": $("#vm_networkcidr").val(),
    "vm_vcpu": $("#vm_vcpu").val(),
    "vm_ram": $("#vm_ram").val(),
    "vm_vmdk": $("#vm_vmdk").val(),
    "vm_zone": $("#vm_zone").val(),
    "vm_os": $("#vm_os").val(),
    "vm_nfs": $("#vm_nfs").val(),
    "vm_action_g02": $("#vm_action_g02").val(),
    "vm_g02_name": $("#vm_g02_name").val(),
    "vm_g02_skdpu_protocol": $("#vm_g02_skdpu_protocol").val(),
    "vm_g02_skdpu_ports_number": $("#vm_g02_skdpu_ports_number").val(),
    "vm_action_g03": $("#vm_action_g03").val(),
    "vm_g03_name": $("#vm_g03_name").val(),
    "vm_g03_skdpu_protocol": $("#vm_g03_skdpu_protocol").val(),
    "vm_g03_skdpu_ports_number": $("#vm_g03_skdpu_ports_number").val(),
    "vm_action_g04": $("#vm_action_g04").val(),
    "vm_g04_name": $("#vm_g04_name").val(),
    "vm_g04_skdpu_protocol": $("vm_g04_skdpu_protocol").val(),
    "vm_g04_skdpu_ports_number": $("#vm_g04_skdpu_ports_number").val(),
    "vm_authorization": $("#vm_authorization").val(),
    "vm_action_type": $("#vm_action_type").val(),
    "vm_disk1": $("#vm_disk1").val(),
    "vm_disk1_letter": $("#vm_disk1_letter").val(),
    "vm_disk2": $("#vm_disk2").val(),
    "vm_disk2_letter": $("#vm_disk2_letter").val(),
    "vm_disk3": $("#vm_disk3").val(),
    "vm_disk3_letter": $("#vm_disk3_letter").val(),
    "vm_disk4": $("#vm_disk4").val(),
    "vm_disk4_letter": $("#vm_disk4_letter").val(),
    "vm_disk5": $("#vm_disk5").val(),
    "vm_disk5_letter": $("#vm_disk5_letter").val()
  };
  newArray.push(newVM);
  //var nodes =  newArray;
  var nodes = {
    "is_id": packageData.is_id, 
    "is_dc_id": packageData.is_dc_id,
    "admin_list": packageData.admin_list,
    "nodes": newArray
  };
  $("#input_json").val(JSON.stringify(nodes)).change();

  addVMToTable();
  //alert($("#input_json"));
  //var VM1 = "test"
  //return VM1;
}

function resetValueVM() {
  $("#vm_networkcidr").val(null);
  $("#vm_vcpu").val(null);
  $("#vm_ram").val(null);
  $("#vm_vmdk").val(null);
  $("#vm_zone").val(null);
  $("#vm_disk1").val(null);
  $("#vm_disk1_letter").val(null);
  $("#vm_disk2").val(null);
  $("#vm_disk2_letter").val(null);
  $("#vm_disk3").val(null);
  $("#vm_disk3_letter").val(null);
  $("#vm_disk4").val(null);
  $("#vm_disk4_letter").val(null);
  $("#vm_disk5").val(null);
  $("#vm_disk5_letter").val(null);
  $("#disk2").hide();
  $("#disk3").hide();
  $("#disk4").hide();
  $("#disk5").hide();
  $("#delete_disk").hide();
  $("#add_disk").removeClass("disabled");
  $("#delete_disk").removeClass("disabled");
  $("#additional_disks").hide();
  $("#vm_add_disk").prop("checked", false);
}

function addVMToTable() {
  var $VMs = $("#input_json").val();
  //alert($("#input_json").val());
  $VMs = $VMs.replace(/\n+$/m, '');
  var VMsData = $VMs && $VMs != '' ? JSON.parse($VMs).nodes : null;
  //alert("addVMToTable");
   if(!VMsData){
      $('#input_form').val(null);
   };
  var table = ' <table id="vm_table" border="1"><tr><th>';
  table += 'VM #';
  table += '</th><th>';
  table += 'Network CIDR';
  table += '</th><th>';
  table += 'vCPU';
  table += '</th><th>';
  table += 'RAM';
  table += '</th><th>';
  table += 'Системный диск';
  table += '</th><th>';
  table += 'Зона';
  table += '</th><th>';
  table += 'Диск 1';
  table += '</th><th>';
  table += 'Буква диска 1';
  table += '</th><th>';
  table += 'Диск 2';
  table += '</th><th>';
  table += 'Буква диска 2';
  table += '</th><th>';
  table += 'Диск 3';
  table += '</th><th>';
  table += 'Буква диска 3';
  table += '</th><th>';
  table += 'Диск 4';
  table += '</th><th>';
  table += 'Буква диска 4';
  table += '</th><th>';
  table += 'Диск 5';
  table += '</th><th>';
  table += 'Буква диска 5';
  table += '</th></tr>';

   //  alert(VMsData.length);
   for (var index = 0; index < VMsData.length; index++) {
     var vmData = VMsData[index];
     //alert(JSON.stringify(vmData));
     
    table += '<tr><td>';
    table += vmData.vm;
    table += '</td><td>';
    table += (vmData.vm_networkcidr || '');
    table += '</td><td>';
    table += (vmData.vm_vcpu || '');
    table += '</td><td>';
    table += (vmData.vm_ram || '');
    table += '</td><td>';
    table += (vmData.vm_vmdk || '');
    table += '</td><td>';
    table += (vmData.vm_zone || '');
    table += '</td><td>';
    table += (vmData.vm_disk1 || '');
    table += '</td><td>';
    table += (vmData.vm_disk1_letter || '');
    table += '</td><td>';
    table += (vmData.vm_disk2 || '');
    table += '</td><td>';
    table += (vmData.vm_disk2_letter || '');
    table += '</td><td>';
    table += (vmData.vm_disk3 || '');
    table += '</td><td>';
    table += (vmData.vm_disk3_letter || '');
    table += '</td><td>';
    table += (vmData.vm_disk4 || '');
    table += '</td><td>';
    table += (vmData.vm_disk4_letter || '');
    table += '</td><td>';
    table += (vmData.vm_disk5 || '');
    table += '</td><td>';
    table += (vmData.vm_disk5_letter || '');
    table += '</td></tr>';
   }
  table += '</table>';
  // `);
  $('#input_form').val({ html: table });

  // var table2 = 'This paragraph comes before the table.';
  // table2 += '<table><tr><th>';
  // table2 += 'Row 1, header cell 1';
  // table2 += '</th><th>';
  // table2 += 'Row 1, header cell 2';
  // table2 += '</th></tr><tr><td>';
  // table2 += 'Row 2, cell 1';
  // table2 += '</td><td>';
  // table2 += 'Row 2, cell 2';
  // table2 += '</td></tr></table>';

  // table2 += 'This paragraph comes after the table.';

  // $('#input_form1').val({ html: table2 });

}





$("#admin_privileges").on("change", function () {
  if ($(this).is(":checked")) {
    $("#for_admin").show();
  } else {
    $("#for_admin").hide();
  }
});
//если новый запрос из селфсервиса, скрыть поле комментарий
if (ITRP.record.new) {
  if (ITRP.context === 'self_service') {
    $("#self_service_new_request_wizard_note-container").parent().parent().hide();
  }
}
$("#is_ex_change").on("change", function () {
  if ($(this).is(":checked")) {
    $("#row_justification").show();
  } else {
    $("#row_justification").hide();
    $("#justification").val(null).change();
    $("#inc_desc").parent().hide();
    $("#inc_desc").val(null).change();
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