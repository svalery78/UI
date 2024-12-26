var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var $need_os = $extension.find('#need_os');
var $need_os_row = $need_os.closest('.row');
var $count_vm = 1;
var $VM;
var $adminListNodes;
var $isDCID;
var $nameIS;
var $role;
var $networkCIDr;
var $OS;
var $NFS;
var $addNFS;
var $addGroups;
var $g02Action;
var $g02SkpduProtocol;
var $g02SkpduPortsNumber;
var $g03Action;
var $g03SkpduProtocol;
var $g03SkpduPortsNumber;
var $g04Action;
var $g04SkpduProtocol;
var $g04SkpduPortsNumber;

var ISName = $extension.find("#name_is");
ISName.on('change', function () {
  $nameIS = $("#name_is").val();
  $isDCID = ISName.data('item').custom_fields['Идентификатор ЦОД'];
  if ($("#name_is").hasClass("empty")) {
    $("#name_is").removeClass("empty");
  }
  //updateInputJson();
});

var adminList = $extension.find("#admin_list");
adminList.on('change', function () {
  //alert('change adminList');      
  $adminListNodes = adminList.data('items').map(function (item) {
    return {
      //id: item.id,
      name: item.name,
      email: item.primary_email
    };
  });
  if (adminList.hasClass("empty")) {
    adminList.removeClass("empty");
  };
  //alert(JSON.stringify($adminListNodes));
  //updateInputJson();
});

var vmRole = $extension.find("#vm_role");
vmRole.on('change', function () {
  vmRole.removeClass("empty");
  $role = vmRole.data('item').reference;
});

var vmNetworkCIDrAction = $extension.find("#vm_networkcidr_action");
var vmNetworkCIDrActionRequired = $extension.find("#vm_networkcidr_action_required");
var vmNetworkCIDr = $extension.find("#vm_networkcidr");
vmNetworkCIDrAction.on('change', function () {
  if (vmNetworkCIDrActionRequired.hasClass("empty")) {
    vmNetworkCIDrActionRequired.removeClass("empty");
  }
  if (vmNetworkCIDrAction.val() !== "существующая") {
    //alert("vmNetworkCIDrAction");
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
    //  var vmNetworkCIDr =$extension.find("#vm_networkcidr");
    $networkCIDr = vmNetworkCIDr.data('item').label;
  } else {
    $networkCIDr = "new";
  }
  if (vmNetworkCIDr.hasClass("empty")) {
    vmNetworkCIDr.removeClass("empty");
  }
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
});

var vmOS = $extension.find("#vm_os");
vmOS.on('change', function () {
  if (vmOS.hasClass("empty")) {
    vmOS.removeClass("empty");
  }
  $OS = vmOS.data('item').label;
});

var vmZone = $extension.find("#vm_zone");
vmZone.on('change', function () {
  if ($("#vm_zone_disp").hasClass("empty")) {
    $("#vm_zone_disp").removeClass("empty");
  }
});

var vmNFS = $extension.find("#vm_nfs");
vmNFS.on('change', function () {
  $NFS = vmNFS.data('items').map(function (item) {
    return item.name;
  });
  if (vmNFS.hasClass("empty")) {
    vmNFS.removeClass("empty");
  }

});

var vmAddNFS = $extension.find("#add_nfs");
vmAddNFS.on("change", function () {
  if ($(this).is(":checked")) {
    $addNFS = true;
    $("#vm_nfs_display").show();
  } else {
    $addNFS = false;
    $("#vm_nfs_display").hide();
    if (vmNFS.hasClass("empty")) {
      vmNFS.removeClass("empty");
    }
    vmNFS.val(null);
    $NFS = "";
  }
});

var vmActionG02 = $extension.find("#vm_action_g02");
var vmG02Name = $extension.find("#vm_g02_name");
var vmG02NameRequired = $extension.find("#vm_g02_name_required");
var vmg02SkpduProtocol = $extension.find("#vm_g02_skdpu_protocol");
var vmg02SkpduPorts = $extension.find("#vm_g02_skdpu_ports");
var vmg02SkpduPortsNumber = $extension.find("#vm_g02_skdpu_ports_number");
var vmg02SkpduPortsNumberRequired = $extension.find("#vm_g02_skdpu_ports_number_required");

var vmActionG03 = $extension.find("#vm_action_g03");
var vmG03Name = $extension.find("#vm_g03_name");
var vmG03NameRequired = $extension.find("#vm_g03_name_required");
var vmg03SkpduProtocol = $extension.find("#vm_g03_skdpu_protocol");
var vmg03SkpduPorts = $extension.find("#vm_g03_skdpu_ports");
var vmg03SkpduPortsNumber = $extension.find("#vm_g03_skdpu_ports_number");
var vmg03SkpduPortsNumberRequired = $extension.find("#vm_g03_skdpu_ports_number_required");

var vmActionG04 = $extension.find("#vm_action_g04");
var vmG04Name = $extension.find("#vm_g04_name");
var vmG04NameRequired = $extension.find("#vm_g04_name_required");
var vmg04SkpduProtocol = $extension.find("#vm_g04_skdpu_protocol");
var vmg04SkpduPorts = $extension.find("#vm_g04_skdpu_ports");
var vmg04SkpduPortsNumber = $extension.find("#vm_g04_skdpu_ports_number");
var vmg04SkpduPortsNumberRequired = $extension.find("#vm_g04_skdpu_ports_number_required");

var vmAddGroups = $extension.find("#add_groups");
vmAddGroups.on('change', function () {
  $addGroups = vmAddGroups.val();
  if (!$addGroups) {
    $addGroups = 0;
  };

  if ($addGroups < 1) {
    if ($("#vm_action_g02_disp").hasClass("empty")) {
      $("#vm_action_g02_disp").removeClass("empty");
    };
    if (vmG02NameRequired.hasClass("empty")) {
      vmG02NameRequired.removeClass("empty");
    };
    if ($("#vm_g02_skdpu_protocol_required").hasClass("empty")) {
      $("#vm_g02_skdpu_protocol_required").removeClass("empty");
    };
    if ($("#vm_g02_skdpu_ports_disp").hasClass("empty")) {
      $("#vm_g02_skdpu_ports_disp").removeClass("empty");
    };
  };
  if ($addGroups < 2) {
    if ($("#vm_action_g03_disp").hasClass("empty")) {
      $("#vm_action_g03_disp").removeClass("empty");
    };
    if (vmG03NameRequired.hasClass("empty")) {
      vmG03NameRequired.removeClass("empty");
    };
    if ($("#vm_g03_skdpu_protocol_required").hasClass("empty")) {
      $("#vm_g03_skdpu_protocol_required").removeClass("empty");
    };
    if ($("#vm_g03_skdpu_ports_disp").hasClass("empty")) {
      $("#vm_g03_skdpu_ports_disp").removeClass("empty");
    };
  };
  if ($addGroups < 3) {
    if ($("#vm_action_g04_disp").hasClass("empty")) {
      $("#vm_action_g04_disp").removeClass("empty");
    };
    if (vmG04NameRequired.hasClass("empty")) {
      vmG04NameRequired.removeClass("empty");
    };
    if ($("#vm_g04_skdpu_protocol_required").hasClass("empty")) {
      $("#vm_g04_skdpu_protocol_required").removeClass("empty");
    };
    if ($("#vm_g04_skdpu_ports_disp").hasClass("empty")) {
      $("#vm_g04_skdpu_ports_disp").removeClass("empty");
    };
  };

  //alert("addGroups");
  if ($addGroups == 1) {
    $("#add_groups_1_disp").show();
    $("#add_groups_2_disp").hide();
    $("#add_groups_3_disp").hide();
    resetValueVMg03();
    resetValueVMg04();
  };

  if ($addGroups == 2) {
    $("#add_groups_1_disp").show();
    $("#add_groups_2_disp").show();
    $("#add_groups_3_disp").hide();
    resetValueVMg04();
  };

  if ($addGroups == 3) {
    $("#add_groups_1_disp").show();
    $("#add_groups_2_disp").show();
    $("#add_groups_3_disp").show();
  };

  if ($addGroups == 0) {
    $("#add_groups_1_disp").hide();
    $("#add_groups_2_disp").hide();
    $("#add_groups_3_disp").hide();
    resetValueVMg02();
    resetValueVMg03();
    resetValueVMg04();
  };
});

vmActionG02.on('change', function () {
  if ($("#vm_action_g02_disp").hasClass("empty")) {
    $("#vm_action_g02_disp").removeClass("empty");
  };
  //$g02Action = vmActionG02.val() === "Создать" ? "create" : "add";
});

vmG02Name.on('change', function () {
  if (vmG02NameRequired.hasClass("empty")) {
    vmG02NameRequired.removeClass("empty");
  }
});

vmg02SkpduProtocol.on('change', function () {
  //alert('vmg02SkpduProtocol');
  if ($("#vm_g02_skdpu_protocol_required").hasClass("empty")) {
    $("#vm_g02_skdpu_protocol_required").removeClass("empty");
  };
  if ($("#vm_g02_skdpu_ports_disp").hasClass("empty")) {
    $("#vm_g02_skdpu_ports_disp").removeClass("empty");
  };
  $g02SkpduProtocol = vmg02SkpduPorts.val() ? vmg02SkpduPorts.val() : (vmg02SkpduProtocol.val() ? vmg02SkpduProtocol.val() : "");
  if (vmg02SkpduProtocol.val()) {
    vmg02SkpduPorts.removeClass("required");
  } else {
    if (!vmg02SkpduPorts.val()) {
      vmg02SkpduPorts.addClass("required");
    } else {
      if (vmg02SkpduProtocol.hasClass("required")) {
        vmg02SkpduProtocol.removeClass("required");
      }
    };
  };

});

vmg02SkpduPorts.on('change', function () {
  //alert("vmg02SkpduPorts");
  if ($("#vm_g02_skdpu_ports_disp").hasClass("empty")) {
    $("#vm_g02_skdpu_ports_disp").removeClass("empty");
  };
  if ($("#vm_g02_skdpu_protocol_required").hasClass("empty")) {
    $("#vm_g02_skdpu_protocol_required").removeClass("empty");
  };
  $g02SkpduProtocol = vmg02SkpduPorts.val() ? vmg02SkpduPorts.val() : (vmg02SkpduProtocol.val() ? vmg02SkpduProtocol.val() : "");
  //alert(vmg02SkpduPorts.val());
  $g02SkpduPortsNumber = vmg02SkpduPortsNumber.val() ? vmg02SkpduPortsNumber.val() : (vmg02SkpduPorts.val() === "rdp" ? "3389" : (vmg02SkpduPorts.val() === "ssh" ? "22" : ""));
  if (vmg02SkpduPorts.val()) {
    vmg02SkpduProtocol.removeClass("required");
  } else {
    if (!vmg02SkpduProtocol.val()) {
      vmg02SkpduProtocol.addClass("required");
    } else {
      if (vmg02SkpduPorts.hasClass("required")) {
        vmg02SkpduPorts.removeClass("required");
      }
    };
  };

  //alert($g02SkpduPortsNumber);
});

vmg02SkpduPortsNumber.on('change', function () {
  $g02SkpduPortsNumber = vmg02SkpduPortsNumber.val() ? vmg02SkpduPortsNumber.val() : (vmg02SkpduPorts.val() === "rdp" ? "3389" : (vmg02SkpduPorts.val() === "ssh" ? "22" : ""));
  if (vmg02SkpduPortsNumberRequired.hasClass("empty")) {
    vmg02SkpduPortsNumberRequired.removeClass("empty");
  };
});

vmActionG03.on('change', function () {
  if ($("#vm_action_g03_disp").hasClass("empty")) {
    $("#vm_action_g03_disp").removeClass("empty");
  };
  //$g03Action = vmActionG03.val() === "Создать" ? "create" : "add";
});

vmG03Name.on('change', function () {
  if (vmG03NameRequired.hasClass("empty")) {
    vmG03NameRequired.removeClass("empty");
  }
});

vmg03SkpduProtocol.on('change', function () {
  //alert('vmg03SkpduProtocol');
  if ($("#vm_g03_skdpu_protocol_required").hasClass("empty")) {
    $("#vm_g03_skdpu_protocol_required").removeClass("empty");
  };
  if ($("#vm_g03_skdpu_ports_disp").hasClass("empty")) {
    $("#vm_g03_skdpu_ports_disp").removeClass("empty");
  };
  $g03SkpduProtocol = vmg03SkpduPorts.val() ? vmg03SkpduPorts.val() : (vmg03SkpduProtocol.val() ? vmg03SkpduProtocol.val() : "");
  if (vmg03SkpduProtocol.val()) {
    vmg03SkpduPorts.removeClass("required");
  } else {
    if (!vmg03SkpduPorts.val()) {
      vmg03SkpduPorts.addClass("required");
    } else {
      if (vmg03SkpduProtocol.hasClass("required")) {
        vmg03SkpduProtocol.removeClass("required");
      }
    };
  };
});

vmg03SkpduPorts.on('change', function () {
  //alert("vmg02SkpduPorts");
  if ($("#vm_g03_skdpu_ports_disp").hasClass("empty")) {
    $("#vm_g03_skdpu_ports_disp").removeClass("empty");
  };
  if ($("#vm_g03_skdpu_protocol_required").hasClass("empty")) {
    $("#vm_g03_skdpu_protocol_required").removeClass("empty");
  };
  $g03SkpduProtocol = vmg03SkpduPorts.val() ? vmg03SkpduPorts.val() : (vmg03SkpduProtocol.val() ? vmg03SkpduProtocol.val() : "");
  //alert(vmg02SkpduPorts.val());
  $g03SkpduPortsNumber = vmg03SkpduPortsNumber.val() ? vmg03SkpduPortsNumber.val() : (vmg03SkpduPorts.val() === "rdp" ? "3389" : (vmg03SkpduPorts.val() === "ssh" ? "22" : ""));
  if (vmg03SkpduPorts.val()) {
    vmg03SkpduProtocol.removeClass("required");
  } else {
    if (!vmg03SkpduProtocol.val()) {
      vmg03SkpduProtocol.addClass("required");
    } else {
      if (vmg03SkpduPorts.hasClass("required")) {
        vmg03SkpduPorts.removeClass("required");
      }
    };
  };
  //alert($g02SkpduPortsNumber);
});

vmg03SkpduPortsNumber.on('change', function () {
  $g03SkpduPortsNumber = vmg03SkpduPortsNumber.val() ? vmg03SkpduPortsNumber.val() : (vmg03SkpduPorts.val() === "rdp" ? "3389" : (vmg03SkpduPorts.val() === "ssh" ? "22" : ""));
  if (vmg03SkpduPortsNumberRequired.hasClass("empty")) {
    vmg03SkpduPortsNumberRequired.removeClass("empty");
  }
});

vmActionG04.on('change', function () {
  if ($("#vm_action_g04_disp").hasClass("empty")) {
    $("#vm_action_g04_disp").removeClass("empty");
  };
  //$g04Action.val() = vmActionG04 === "Создать" ? "create" : "add";
});

vmG04Name.on('change', function () {
  if (vmG04NameRequired.hasClass("empty")) {
    vmG04NameRequired.removeClass("empty");
  }
});

vmg04SkpduProtocol.on('change', function () {
  //alert('vmg03SkpduProtocol');
  if ($("#vm_g04_skdpu_protocol_required").hasClass("empty")) {
    $("#vm_g04_skdpu_protocol_required").removeClass("empty");
  };
  if ($("#vm_g04_skdpu_ports_disp").hasClass("empty")) {
    $("#vm_g04_skdpu_ports_disp").removeClass("empty");
  };
  $g04SkpduProtocol = vmg04SkpduPorts.val() ? vmg04SkpduPorts.val() : (vmg04SkpduProtocol.val() ? vmg04SkpduProtocol.val() : "");
  if (vmg04SkpduProtocol.val()) {
    vmg04SkpduPorts.removeClass("required");
  } else {
    if (!vmg04SkpduPorts.val()) {
      vmg04SkpduPorts.addClass("required");
    } else {
      if (vmg04SkpduProtocol.hasClass("required")) {
        vmg04SkpduProtocol.removeClass("required");
      }
    };
  };
});

vmg04SkpduPorts.on('change', function () {
  //alert("vmg02SkpduPorts");
  if ($("#vm_g04_skdpu_ports_disp").hasClass("empty")) {
    $("#vm_g04_skdpu_ports_disp").removeClass("empty");
  };
  if ($("#vm_g04_skdpu_protocol_required").hasClass("empty")) {
    $("#vm_g04_skdpu_protocol_required").removeClass("empty");
  };
  $g04SkpduProtocol = vmg04SkpduPorts.val() ? vmg04SkpduPorts.val() : (vmg04SkpduProtocol.val() ? vmg04SkpduProtocol.val() : "");
  //alert(vmg02SkpduPorts.val());
  $g04SkpduPortsNumber = vmg04SkpduPortsNumber.val() ? vmg04SkpduPortsNumber.val() : (vmg04SkpduPorts.val() === "rdp" ? "3389" : (vmg04SkpduPorts.val() === "ssh" ? "22" : ""));
  //alert($g02SkpduPortsNumber);
  if (vmg04SkpduPorts.val()) {
    vmg04SkpduProtocol.removeClass("required");
  } else {
    if (!vmg04SkpduProtocol.val()) {
      vmg04SkpduProtocol.addClass("required");
    } else{
      if (vmg04SkpduPorts.hasClass("required")){
        vmg04SkpduPorts.removeClass("required");
      }
    }; 
  };
});

vmg04SkpduPortsNumber.on('change', function () {
  $g04SkpduPortsNumber = vmg04SkpduPortsNumber.val() ? vmg04SkpduPortsNumber.val() : (vmg04SkpduPorts.val() === "rdp" ? "3389" : (vmg04SkpduPorts.val() === "ssh" ? "22" : ""));
  if (vmg04SkpduPortsNumberRequired.hasClass("empty")) {
    vmg04SkpduPortsNumberRequired.removeClass("empty");
  }
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


$("#vm_add_disk").on("change", function () {
  if ($(this).is(":checked")) {
    //alert($(this).readonly());
    //$(this).prop("checked", false);
    $("#additional_disks").show();
    //
    //$(this).readonly(true);
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
      // $("#vm_disk5").val(null);
      // $("#vm_disk5_letter").val(null);
      // $("#disk5").hide();
      $("#add_disk").removeClass("disabled");
      additonalDisksRemoveClass(5);
    } else {
      //alert("else 5");
      if (!($("#disk4").css("display") == "none")) {
        //alert($("#disk3").css("display")=="none");
        // $("#vm_disk4").val(null);
        // $("#vm_disk4_letter").val(null);
        // $("#disk4").hide();
        additonalDisksRemoveClass(4);
      } else {
        //alert("else 4");
        if (!($("#disk3").css("display") == "none")) {
          //alert($("#disk3").css("display")=="none");
          // $("#vm_disk3").val(null);
          // $("#vm_disk3_letter").val(null);
          // $("#disk3").hide();
          additonalDisksRemoveClass(3);
        } else {
          //alert("else 3");
          //alert(!($("#disk2").css("display")=="none"));
          if (!($("#disk2").css("display") == "none")) {
            //alert("disk2 - hide");
            //alert($("#vm_disk2").val());
            additonalDisksRemoveClass(2);
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
    if (!checkingEnteredValue()) {
      $("#delete_vm").show();
      $("#delete_vm").removeClass("disabled");
      if ($count_vm < 21) {
        //alert($count_vm);
        addVM();
        //resetValueVM();
        $count_vm++;
      } else {
        $(this).addClass("disabled");
        $("#add_vm").addClass("disabled");
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



  if (!packageData) {
    packageData = {
      "is_id": "",
      "is_dc_id": "",
      "admin_list": ""
    };
  }

  var newVM = {
    "vm": $count_vm,
    "vm_role": $role, //$("#vm_role").val(),  //
    "vm_networkcidr": $networkCIDr, //$("#vm_networkcidr").val(), //
    "vm_vcpu": $("#vm_vcpu").val(),
    "vm_ram": $("#vm_ram").val(),
    "vm_vmdk": $("#vm_vmdk").val(),
    "vm_zone": $("#vm_zone").val(),
    "vm_os": $OS, //$("#vm_os").val(),  //
    "vm_nfs": $NFS, //$("#vm_nfs").val(), //
    "vm_action_g02": $("#vm_action_g02").val(),
    "vm_g02_name": $("#vm_g02_name").val(),
    "vm_g02_skdpu_protocol": $g02SkpduProtocol, //$("#vm_g02_skdpu_protocol").val(),  //
    "vm_g02_skdpu_ports_number": $g02SkpduPortsNumber, //$("#vm_g02_skdpu_ports_number").val(), //
    "vm_action_g03": $("#vm_action_g03").val(), //
    "vm_g03_name": $("#vm_g03_name").val(),
    "vm_g03_skdpu_protocol": $g03SkpduProtocol, //$("#vm_g03_skdpu_protocol").val(),  //
    "vm_g03_skdpu_ports_number": $g03SkpduPortsNumber, //$("#vm_g03_skdpu_ports_number").val(),  //
    "vm_action_g04": $("#vm_action_g04").val(),  //
    "vm_g04_name": $("#vm_g04_name").val(),
    "vm_g04_skdpu_protocol": $g04SkpduProtocol, //$("vm_g04_skdpu_protocol").val(),  //
    "vm_g04_skdpu_ports_number": $g04SkpduPortsNumber, //$("#vm_g04_skdpu_ports_number").val(),  //
    //"vm_authorization": $("#vm_authorization").val(),  //
    //"vm_action_type": $("#vm_action_type").val(),  //
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
    //  "is_id": packageData.is_id,
    //  "is_dc_id": packageData.is_dc_id,
    //  "admin_list": packageData.admin_list,
    "nodes": newArray
  };
  $("#input_json").val(JSON.stringify(nodes)).change();

  addVMToTable();
  //alert($("#input_json"));
  //var VM1 = "test"
  //return VM1;
}

function resetValueVM() {
  vmRole.val(null);
  vmRole.addClass("required");
  vmNetworkCIDrAction.val(null);
  vmNetworkCIDrAction.addClass("required");
  vmNetworkCIDr.val(null);
  vmNetworkCIDr.addClass("required");
  vmVCPU.val(null);
  vmVCPU.addClass("required");
  vmRAM.val(null);
  vmRAM.addClass("required");
  vmVMDK.val(null);
  vmVMDK.addClass("required");
  vmZone.val(null);
  vmZone.addClass("required");
  vmOSFamily.val(null);
  vmOS.val(null);
  $("#add_nfs").prop("checked", false);
  vmNFS.val(null);
  vmNFS.addClass("required");
  $("#vm_nfs-multitrack").addClass("required");
  $("#add_groups").val(null);
  resetValueVMg02();
  resetValueVMg03();
  resetValueVMg04();
  resetValueDisk();
  $("#vm_networkcidr_display").hide();
  $("#additional_disks").hide();
  $("#vm_add_disk").prop("checked", false);
  $("#vm_nfs_display").hide();
  $("#add_groups_1_disp").hide();
  $("#add_groups_2_disp").hide();
  $("#add_groups_3_disp").hide();
  $role = "";
  $networkCIDr = "";
  $OS = "";
  $NFS = "";
  $addNFS = "";
  $addGroups = "";
  //$g02Action = "";
  //$g03Action = "";
  //$g04Action = "";

}

function resetValueDisk() {
  $("#delete_disk").hide();
  $("#add_disk").removeClass("disabled");
  $("#delete_disk").removeClass("disabled");
  additonalDisksRemoveClass(0);
}

function resetValueVMg04() {
  $("#vm_action_g04").val(null);
  $("#vm_g04_name").val(null);
  $("#vm_g04_skdpu_protocol").val(null);
  $("#vm_g04_skdpu_ports_number").val(null);
  $("#vm_g04_skdpu_ports").val(null);
  $g04SkpduProtocol = "";
  $g04SkpduPortsNumber = "";
  vmActionG04.addClass("required");
  vmG04Name.addClass("required");
  vmg04SkpduPorts.addClass("required");
  vmg04SkpduProtocol.addClass("required");
}

function resetValueVMg03() {
  $("#vm_action_g03").val(null);
  $("#vm_g03_name").val(null);
  $("#vm_g03_skdpu_protocol").val(null);
  $("#vm_g03_skdpu_ports_number").val(null);
  $("#vm_g03_skdpu_ports").val(null);
  $g03SkpduProtocol = "";
  $g03SkpduPortsNumber = "";
  vmActionG03.addClass("required");
  vmG03Name.addClass("required");
  vmg03SkpduPorts.addClass("required");
  vmg03SkpduPorts.addClass("required");
  vmg03SkpduProtocol.addClass("required");
}

function resetValueVMg02() {
  $("#vm_action_g02").val(null);
  $("#vm_g02_name").val(null);
  $("#vm_g02_skdpu_protocol").val(null);
  $("#vm_g02_skdpu_ports_number").val(null);
  $("#vm_g02_skdpu_ports").val(null);
  $g02SkpduProtocol = "";
  $g02SkpduPortsNumber = "";
  vmActionG02.addClass("required");
  vmG02Name.addClass("required");
  vmg02SkpduPorts.addClass("required");
  vmg02SkpduProtocol.addClass("required");
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
  table += '№';
  table += '</th><th>';
  table += 'Роль VM';
  table += '</th><th>';
  table += 'networkCidr';
  table += '</th><th>';
  table += 'vCPU, шт';
  table += '</th><th>';
  table += 'RAM, ГБ';
  table += '</th><th>';
  table += 'Системный диск, ГБ';
  table += '</th><th>';
  table += 'Зона';
  table += '</th><th>';
  table += 'Образ';
  table += '</th><th>';
  table += 'Общие диски';
  table += '</th><th>';
  table += 'Группа удаленного доступа';
  table += '</th><th>';
  table += 'Дополнительные диски';
  table += '</th></tr>';

  //  alert(VMsData.length);
  for (var index = 0; index < VMsData.length; index++) {
    var vmData = VMsData[index];
    //alert(JSON.stringify(vmData));

    table += '<tr><td>';
    table += vmData.vm;
    table += '</td><td>';
    table += (vmData.vm_role || '');
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
    table += (vmData.vm_os || '');
    table += '</td><td>';
    table += (vmData.vm_nfs || '');
    table += '</td><td>';
    table += (vmData.vm_action_g02 || '');
    table += ' ';
    table += (vmData.vm_g02_name || '');
    table += ' ';
    table += (vmData.vm_g02_skdpu_protocol || '');
    table += ' ';
    table += (vmData.vm_g02_skdpu_ports_number || '');
    table += '; \n';
    table += (vmData.vm_action_g03 || '');
    table += ' ';
    table += (vmData.vm_g03_name || '');
    table += ' ';
    table += (vmData.vm_g03_skdpu_protocol || '');
    table += ' ';
    table += (vmData.vm_g03_skdpu_ports_number || '');
    table += '; \n ';
    table += (vmData.vm_action_g04 || '');
    table += ' ';
    table += (vmData.vm_g04_name || '');
    table += ' ';
    table += (vmData.vm_g04_skdpu_protocol || '');
    table += ' ';
    table += (vmData.vm_g04_skdpu_ports_number || '');
    table += '; ';
    table += '</td><td>';
    table += (vmData.vm_disk1 || '');
    table += ' ';
    table += (vmData.vm_disk1_letter || '');
    table += '; \n ';
    table += (vmData.vm_disk2 || '');
    table += ' ';
    table += (vmData.vm_disk2_letter || '');
    table += '; \n ';
    table += (vmData.vm_disk3 || '');
    table += ' ';
    table += (vmData.vm_disk3_letter || '');
    table += '; \n';
    table += (vmData.vm_disk4 || '');
    table += ' ';
    table += (vmData.vm_disk4_letter || '');
    table += '; \n';
    table += (vmData.vm_disk5 || '');
    table += ' ';
    table += (vmData.vm_disk5_letter || '');
    table += '; ';
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
  if ($("#for_admin").css("display") === "block") {
    //alert('checked');
    if (!$adminListNodes) {
      $("#admin_list").addClass("empty");
      isError = true;
    };
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
  if (!$("#vm_zone").val()) {
    $("#vm_zone_disp").addClass("empty");
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
  if ($addNFS) {
    if (!$NFS) {
      $("#vm_nfs").addClass("empty");
      isError = true;
    };
  };
  if ($addGroups === "1" || $addGroups === "2" || $addGroups === "3") {
    if (!$("#vm_action_g02").val()) {
      $("#vm_action_g02_disp").addClass("empty");
      isError = true;
    };
    if (!vmG02Name.val() || vmG02Name.hasClass("invalid")) {
      $("#vm_g02_name_required").addClass("empty");
      isError = true;
    };
    if (!$("#vm_g02_skdpu_ports").val()) {
      if (!$("#vm_g02_skdpu_protocol").val()) {
        $("#vm_g02_skdpu_protocol_required").addClass("empty");
        isError = true;
      };
    };
    if (!$("#vm_g02_skdpu_protocol").val()) {
      if (!$("#vm_g02_skdpu_ports").val()) {
        $("#vm_g02_skdpu_ports_disp").addClass("empty");
        isError = true;
      };
    };
    if (vmg02SkpduPortsNumber.hasClass("invalid")) {
      vmg02SkpduPortsNumberRequired.addClass("empty");
      isError = true;
    };
  };
  if ($addGroups === "2" || $addGroups === "3") {
    if (!$("#vm_action_g03").val()) {
      $("#vm_action_g03_disp").addClass("empty");
      isError = true;
    };
    if (!vmG03Name.val() || vmG03Name.hasClass("invalid")) {
      $("#vm_g03_name_required").addClass("empty");
      isError = true;
    };
    if (!$("#vm_g03_skdpu_ports").val()) {
      if (!$("#vm_g03_skdpu_protocol").val()) {
        $("#vm_g03_skdpu_protocol_required").addClass("empty");
        isError = true;
      };
    };
    if (!$("#vm_g03_skdpu_protocol").val()) {
      if (!$("#vm_g03_skdpu_ports").val()) {
        $("#vm_g03_skdpu_ports_disp").addClass("empty");
        isError = true;
      };
    };
    if (vmg03SkpduPortsNumber.hasClass("invalid")) {
      vmg03SkpduPortsNumberRequired.addClass("empty");
      isError = true;
    };
  };
  if ($addGroups === "3") {
    if (!$("#vm_action_g04").val()) {
      $("#vm_action_g04_disp").addClass("empty");
      isError = true;
    };
    if (!vmG04Name.val() || vmG04Name.hasClass("invalid")) {
      $("#vm_g04_name_required").addClass("empty");
      isError = true;
    };
    if (!$("#vm_g04_skdpu_ports").val()) {
      if (!$("#vm_g04_skdpu_protocol").val()) {
        $("#vm_g04_skdpu_protocol_required").addClass("empty");
        isError = true;
      };
    };
    if (!$("#vm_g04_skdpu_protocol").val()) {
      if (!$("#vm_g04_skdpu_ports").val()) {
        $("#vm_g04_skdpu_ports_disp").addClass("empty");
        isError = true;
      };
    };
    if (vmg04SkpduPortsNumber.hasClass("invalid")) {
      vmg04SkpduPortsNumberRequired.addClass("empty");
      isError = true;
    };
  };
  if ($("#additional_disks").css("display") === "block") {
    if (!vmDisk1.val() || vmDisk1.hasClass("invalid")) {
      vmDisk1Required.addClass("empty");
      isError = true;
    };
    if (!vmDisk1Letter.val()) {
      vmDisk1LetterRequired.addClass("empty");
      isError = true;
    };

    if ($("#disk2").css("display") === "block") {
      if (!vmDisk2.val() || vmDisk2.hasClass("invalid")) {
        vmDisk2Required.addClass("empty");
        isError = true;
      };
      if (!vmDisk2Letter.val()) {
        vmDisk2LetterRequired.addClass("empty");
        isError = true;
      };
    };

    if ($("#disk3").css("display") === "block") {
      if (!vmDisk3.val() || vmDisk3.hasClass("invalid")) {
        vmDisk3Required.addClass("empty");
        isError = true;
      };
      if (!vmDisk3Letter.val()) {
        vmDisk3LetterRequired.addClass("empty");
        isError = true;
      };
    };


    if ($("#disk4").css("display") === "block") {
      if (!vmDisk4.val() || vmDisk4.hasClass("invalid")) {
        vmDisk4Required.addClass("empty");
        isError = true;
      };
      if (!vmDisk4Letter.val()) {
        vmDisk4LetterRequired.addClass("empty");
        isError = true;
      };
    };


    if ($("#disk5").css("display") === "block") {
      if (!vmDisk5.val() || vmDisk5.hasClass("invalid")) {
        vmDisk5Required.addClass("empty");
        isError = true;
      };
      if (!vmDisk5Letter.val()) {
        vmDisk5LetterRequired.addClass("empty");
        isError = true;
      };
    };

  };
  return isError;
}

function additonalDisksRemoveClass(diskNumber) {
  if (diskNumber === 1 || diskNumber === 0) {
    //var vmDisk1 = $extension.find("#vm_disk1");
    if (vmDisk1Required.hasClass("empty")) {
      vmDisk1Required.removeClass("empty");
    };
    //var vmDisk1Letter = $extension.find("#vm_disk1_letter");
    if (vmDisk1LetterRequired.hasClass("empty")) {
      vmDisk1LetterRequired.removeClass("empty");
    };
    vmDisk1.addClass("required");
    vmDisk1Letter.addClass("required");
    vmDisk1.val(null);
    vmDisk1Letter.val(null);
    //$("#disk1").hide();
  };

  if (diskNumber === 2 || diskNumber === 0) {
    //var vmDisk2 = $extension.find("#vm_disk2");
    if (vmDisk2Required.hasClass("empty")) {
      vmDisk2Required.removeClass("empty");
    };
    //var vmDisk2Letter = $extension.find("#vm_disk2_letter");
    if (vmDisk2LetterRequired.hasClass("empty")) {
      vmDisk2LetterRequired.removeClass("empty");
    };
    vmDisk2.addClass("required");
    vmDisk2Letter.addClass("required");
    vmDisk2.val(null);
    vmDisk2Letter.val(null);
    $("#disk2").hide();
  };

  if (diskNumber === 3 || diskNumber === 0) {
    //var vmDisk3 = $extension.find("#vm_disk3");
    if (vmDisk3Required.hasClass("empty")) {
      vmDisk3Required.removeClass("empty");
    };
    //var vmDisk3Letter = $extension.find("#vm_disk3_letter");
    if (vmDisk3LetterRequired.hasClass("empty")) {
      vmDisk3LetterRequired.removeClass("empty");
    };
    vmDisk3.addClass("required");
    vmDisk3Letter.addClass("required");
    vmDisk3.val(null);
    vmDisk3Letter.val(null);
    $("#disk3").hide();
  };

  if (diskNumber === 4 || diskNumber === 0) {
    //var vmDisk4 = $extension.find("#vm_disk4");
    if (vmDisk4Required.hasClass("empty")) {
      vmDisk4Required.removeClass("empty");
    };
    //var vmDisk4Letter = $extension.find("#vm_disk4_letter");
    if (vmDisk4LetterRequired.hasClass("empty")) {
      vmDisk4LetterRequired.removeClass("empty");
    };
    vmDisk4.addClass("required");
    vmDisk4Letter.addClass("required");
    vmDisk4.val(null);
    vmDisk4Letter.val(null);
    $("#disk4").hide();
  };

  if (diskNumber === 5 || diskNumber === 0) {
    //var vmDisk5 = $extension.find("#vm_disk5");
    if (vmDisk5Required.hasClass("empty")) {
      vmDisk5Required.removeClass("empty");
    };
    //var vmDisk5Letter = $extension.find("#vm_disk5_letter");
    if (vmDisk5LetterRequired.hasClass("empty")) {
      vmDisk5LetterRequired.removeClass("empty");
    };
    vmDisk5.addClass("required");
    vmDisk5Letter.addClass("required");
    vmDisk5.val(null);
    vmDisk5Letter.val(null);
    $("#disk5").hide();
  };
};


$("#admin_privileges").on("change", function () {
  if ($(this).is(":checked")) {
    $("#for_admin").show();
  } else {
    $("#for_admin").hide();
    //alert($("#admin_list").val());
    $("#admin_list").val(null);

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