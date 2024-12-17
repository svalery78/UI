var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var $need_os = $extension.find('#need_os');
var $need_os_row = $need_os.closest('.row');
var $count_vm = 1;
var $VM;
var $adminListNodes;
var $isDCID;
var $nameIS;

var ISName = $extension.find("#name_is");
ISName.on('change', function () {
  $nameIS = $("#name_is").val();
  $isDCID = ISName.data('item').custom_fields['Идентификатор ЦОД'];
  if($("#name_is").hasClass("empty")){
    $("#name_is").removeClass("empty");
  } 
  updateInputJson();
});

var adminList = vm_networkcidr("#admin_list");
adminList.on('change', function () {
  //alert('change adminList');      
  $adminListNodes = adminList.data('items').map(function (item) {
    return {
      //id: item.id,
      name: item.name,
      email: item.primary_email
    };    
  });
  if($("#admin_list").hasClass("empty")){
    $("#admin_list").removeClass("empty");
  }
  //alert(JSON.stringify($adminListNodes));
  updateInputJson();
});

$("#vm_role").on('change', function (){
  $("#vm_role").removeClass("empty");
});

// $("#vm_networkcidr_action").on('changed', function(){
//   if(!"#vm_networkcidr_action"=== "существующая"){
//     $("#vm_networkcidr").removeClass("empty");
//   }
// });

// var vm_networkcidr = $extension.find("#vm_networkcidr");
// //$("#vm_networkcidr")
// vm_networkcidr.on('changed', function(){
//   alert("vm_networkcidr");
//   $("#vm_networkcidr").removeClass("empty");
// });




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

$("#additional_disks").on("change",function(){
  if($(this).is(":checked")){
    $("#for_disk").show();
  }else{
    $("#for_disk").hide();
  }
});

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
    if (!checkingEnteredValue()) {
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
    } else {
      alert("Заполните корректно обязательные поля");
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

  var $package = $("#input_json").val();
  $package = $package.replace(/\n+$/m, '');
  var packageData = $package && $package != '' ? JSON.parse($package) : null;
  var newArray = packageData ? packageData.nodes : [];

  var vmRole = $extension.find("#vm_role");
  var role = vmRole.data('item').reference;

  var vmNetworkCIDrAction = $("#vm_networkcidr_action").val();
  var networkCIDr;
  //alert(vmNetworkCIDrAction);
  if (vmNetworkCIDrAction === "существующая") {
    var vmNetworkCIDr = $extension.find("#vm_networkcidr");
    networkCIDr = vmNetworkCIDr.data('item').label;
  } else {
    networkCIDr = "new";
  }

  var vmOS = $extension.find("#vm_os");
  var OS = vmOS.data('item').label;
  var vmNFS = $extension.find("#vm_nfs");
  var NFS = vmNFS.data('items').map(function (item) {
    return item.name;
  });

  var vmg02SkpduProtocol = $("#vm_g02_skdpu_protocol").val();
  var vmg02SkpduPorts = $("#vm_g02_skdpu_ports").val();
  var g02SkpduProtocol = vmg02SkpduPorts ? vmg02SkpduPorts : (vmg02SkpduProtocol ? vmg02SkpduProtocol : "");

  var vmg02SkpduPortsNumber = $("#vm_g02_skdpu_ports_number").val();
  var g02SkpduPortsNumber = vmg02SkpduPortsNumber ? vmg02SkpduPortsNumber : (vmg02SkpduPorts === "RDP" ? "3389" : (vmg02SkpduPorts === "SSH" ? "22" : ""));

  var vmg03SkpduProtocol = $("#vm_g03_skdpu_protocol").val();
  var vmg03SkpduPorts = $("#vm_g03_skdpu_ports").val();
  var g03SkpduProtocol = vmg03SkpduPorts ? vmg03SkpduPorts : (vmg03SkpduProtocol ? vmg03SkpduProtocol : "");

  var vmg03SkpduPortsNumber = $("#vm_g03_skdpu_ports_number").val();
  var g03SkpduPortsNumber = vmg03SkpduPortsNumber ? vmg03SkpduPortsNumber : (vmg03SkpduPorts === "RDP" ? "3389" : (vmg03SkpduPorts === "SSH" ? "22" : ""));

  var vmg04SkpduProtocol = $("#vm_g04_skdpu_protocol").val();
  var vmg04SkpduPorts = $("#vm_g04_skdpu_ports").val();
  var g04SkpduProtocol = vmg04SkpduPorts ? vmg04SkpduPorts : (vmg04SkpduProtocol ? vmg04SkpduProtocol : "");

  var vmg04SkpduPortsNumber = $("#vm_g04_skdpu_ports_number").val();
  var g04SkpduPortsNumber = vmg04SkpduPortsNumber ? vmg04SkpduPortsNumber : (vmg04SkpduPorts === "RDP" ? "3389" : (vmg04SkpduPorts === "SSH" ? "22" : ""));




  if (!packageData) {
    packageData = {
      "is_id": "",
      "is_dc_id": "",
      "admin_list": ""
    };
  }

  var newVM = {
    "vm": $count_vm,
    "vm_role": role, //$("#vm_role").val(),  //
    "vm_networkcidr": networkCIDr, //$("#vm_networkcidr").val(), //
    "vm_vcpu": $("#vm_vcpu").val(),
    "vm_ram": $("#vm_ram").val(),
    "vm_vmdk": $("#vm_vmdk").val(),
    "vm_zone": $("#vm_zone").val(),
    "vm_os": OS, //$("#vm_os").val(),  //
    "vm_nfs": NFS, //$("#vm_nfs").val(), //
    "vm_action_g02": $("#vm_action_g02").val(),
    "vm_g02_name": $("#vm_g02_name").val(),
    "vm_g02_skdpu_protocol": g02SkpduProtocol, //$("#vm_g02_skdpu_protocol").val(),  //
    "vm_g02_skdpu_ports_number": g02SkpduPortsNumber, //$("#vm_g02_skdpu_ports_number").val(), //
    "vm_action_g03": $("#vm_action_g03").val(), //
    "vm_g03_name": $("#vm_g03_name").val(),
    "vm_g03_skdpu_protocol": g03SkpduProtocol, //$("#vm_g03_skdpu_protocol").val(),  //
    "vm_g03_skdpu_ports_number": g03SkpduPortsNumber, //$("#vm_g03_skdpu_ports_number").val(),  //
    "vm_action_g04": $("#vm_action_g04").val(),  //
    "vm_g04_name": $("#vm_g04_name").val(),
    "vm_g04_skdpu_protocol": g04SkpduProtocol, //$("vm_g04_skdpu_protocol").val(),  //
    "vm_g04_skdpu_ports_number": g04SkpduPortsNumber, //$("#vm_g04_skdpu_ports_number").val(),  //
    "vm_authorization": $("#vm_authorization").val(),  //
    "vm_action_type": $("#vm_action_type").val(),  //
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
  $("#vm_role").val(null);
  $("#vm_networkcidr_action").val(null);
  $("#vm_networkcidr").val(null);
  $("#vm_vcpu").val(null);
  $("#vm_ram").val(null);
  $("#vm_vmdk").val(null);
  $("#vm_zone").val(null);
  $("#vm_os_family").val(null);
  $("#vm_os").val(null);
  $("#add_nfs").prop("checked", false);
  $("#vm_nfs").val(null);
  $("#add_groups").val(null);
  $("#vm_action_g02").val(null);
  $("#vm_g02_name").val(null);
  $("#vm_g02_skdpu_protocol").val(null);
  $("#vm_g02_skdpu_ports_number").val(null);
  $("#vm_g02_skdpu_ports").val(null);
  $("#vm_action_g03").val(null);
  $("#vm_g03_name").val(null);
  $("#vm_g03_skdpu_protocol").val(null);
  $("#vm_g03_skdpu_ports_number").val(null);
  $("#vm_g03_skdpu_ports").val(null);
  $("#vm_action_g04").val(null);
  $("#vm_g04_name").val(null);
  $("#vm_g04_skdpu_protocol").val(null);
  $("#vm_g04_skdpu_ports_number").val(null);
  $("#vm_g04_skdpu_ports").val(null);
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
  if (!VMsData) {
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

function updateInputJson() {
  var $package = $("#input_json").val();
  //alert($("#input_json").val());
  //alert($("#name_is").val());
  $package = $package.replace(/\n+$/m, '');
  var packageData = $package && $package != '' ? JSON.parse($package) : null;
  var newArray = packageData ? packageData.nodes : [];
  //if (!packageData){

  //alert($nameIS);
  //alert('ISName');
  //alert(ISName); 
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
  if (!$("#vm_role").val()) {
    $("#vm_role").addClass("empty");
    isError = true;
  };
  //alert($("#for_admin").css("display"));
  if ($("#for_admin").css("display")=="block") {
    alert('checked');
    if (!$adminListNodes) {
      $("#admin_list").addClass("empty");
      isError = true;
    };
  };
  if ($("#vm_networkcidr_action").val()=== "существующая"){
    if(!$("#vm_networkcidr").val()){
      $("#vm_networkcidr").addClass("empty");
      isError = true;
    }
  };
   
  // $("#vm_vcpu").val(null);
  // $("#vm_ram").val(null);
  // $("#vm_vmdk").val(null);
  // $("#vm_zone").val(null);
  // $("#vm_os_family").val(null);
  // $("#vm_os").val(null);
  // $("#add_nfs").prop("checked", false);
  // $("#vm_nfs").val(null);
  // $("#add_groups").val(null);
  // $("#vm_action_g02").val(null);
  // $("#vm_g02_name").val(null);
  // $("#vm_g02_skdpu_protocol").val(null);
  // $("#vm_g02_skdpu_ports_number").val(null); 
  // $("#vm_g02_skdpu_ports").val(null);
  // $("#vm_action_g03").val(null);
  // $("#vm_g03_name").val(null);
  // $("#vm_g03_skdpu_protocol").val(null);
  // $("#vm_g03_skdpu_ports_number").val(null);
  // $("#vm_g03_skdpu_ports").val(null);
  // $("#vm_action_g04").val(null);
  // $("#vm_g04_name").val(null);
  // $("#vm_g04_skdpu_protocol").val(null);
  // $("#vm_g04_skdpu_ports_number").val(null);
  // $("#vm_g04_skdpu_ports").val(null);
  // $("#vm_disk1").val(null);
  // $("#vm_disk1_letter").val(null);
  // $("#vm_disk2").val(null);
  // $("#vm_disk2_letter").val(null);
  // $("#vm_disk3").val(null);
  // $("#vm_disk3_letter").val(null);
  // $("#vm_disk4").val(null);
  // $("#vm_disk4_letter").val(null);
  // $("#vm_disk5").val(null);
  // $("#vm_disk5_letter").val(null);
  // $("#disk2").hide();
  // $("#disk3").hide();
  // $("#disk4").hide();
  // $("#disk5").hide();
  // $("#delete_disk").hide();
  // $("#add_disk").removeClass("disabled");
  // $("#delete_disk").removeClass("disabled");
  // $("#additional_disks").hide();
  // $("#vm_add_disk").prop("checked", false);
  return isError;
};







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