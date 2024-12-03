var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var $need_os = $extension.find('#need_os');
var $need_os_row = $need_os.closest('.row');
var $count_vm = 1;
var $VM;


$("#dr_cluster").on("change", function() {
  if ($(this).is(":checked")) {
    $(this).prop("checked", false);
    $(this).readonly(true);
    $("#dr_cluster_warning").show();
  }
});

//Новое
$("#vm_service").on("change",function(){
  if ($("#vm_service").val() === 'среда_исполнения'){
    $need_os_row.show();
  }else{
    $need_os_row.hide();
    $need_os.val('').trigger('change');
  }
});

$("#vm_service").on("change",function(){
  if ($("#vm_service").val() === 'среда_виртуализации'){
    $("#os_necessity").parent().show();
  }else{
  
    $("#os_necessity").parent().hide();
    $("#os_necessity").val(null).change();
  }
});

$("#os_necessity").on("change",function(){
  if($(this).is(":checked")){
    $("#instruction").show();
    
  }else{
    $("#instruction").hide();
      }
});

$("#vm_service").on("change",function(){
  if ($("#vm_service").val() === 'среда_исполнения')
  {
    $("#desc_admin").parent().show();
    $("#desc_base").parent().hide();
    $("#desc_base").val(null).change();
    $("#instruction").hide();
  }
  else
  {
    if ($("#vm_service").val() === 'среда_виртуализации')
    {
      $("#desc_base").parent().show();
      $("#desc_admin").parent().hide();
      $("#desc_admin").val(null).change();
    }
    else
    {
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

$("#vm_add_disk").on("change", function() {
  if ($(this).is(":checked")) {
    //alert($(this).readonly());
    //$(this).prop("checked", false);
    $("#additional_disks").show();
    //
     //$(this).readonly(true);
  } else{
    $("#additional_disks").hide();
  }
});


$("#add_disk").on("click", function(){
  if (!$(this).hasClass("disabled")) {
    //alert("not disabled");
    $("#delete_disk").show();
    //if($("#delete_disk").class("disabled")){
      $("#delete_disk").removeClass("disabled");
    //}  
    
    if($("#disk2").css("display")=="none") {
      //alert($("#disk2").css("display")=="none");
      $("#disk2").show();
    } else{
      //alert("else");
      if($("#disk3").css("display")=="none") {
        //alert($("#disk3").css("display")=="none");
        $("#disk3").show();
      } else{
        //alert("else");
        if($("#disk4").css("display")=="none") {
        //alert($("#disk3").css("display")=="none");
          $("#disk4").show();
        } else{
          if($("#disk5").css("display")=="none") {
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

$("#delete_disk").on("click", function(){
  if (!$(this).hasClass("disabled")) {
     //alert($("#disk5").css("display")=="none");
    if(!($("#disk5").css("display")=="none")) {
      //alert($("#disk5").css("display")=="none");
      $("#vm_disk5").val(null);
      $("#vm_disk5_letter").val(null);                  
      $("#disk5").hide();
      $("#add_disk").removeClass("disabled");
    } else{
      //alert("else 5");
      if(!($("#disk4").css("display")=="none")) {
        //alert($("#disk3").css("display")=="none");
        $("#vm_disk4").val(null);
        $("#vm_disk4_letter").val(null);                        
        $("#disk4").hide();
      } else{
        //alert("else 4");
        if(!($("#disk3").css("display")=="none")) {
        //alert($("#disk3").css("display")=="none");
            $("#vm_disk3").val(null);
            $("#vm_disk3_letter").val(null);            
            $("#disk3").hide();          
        } else{
          //alert("else 3");
          //alert(!($("#disk2").css("display")=="none"));
          if(!($("#disk2").css("display")=="none")) {
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

$("#add_vm").on("click", function() {
  if (!$(this).hasClass("disabled")) {
    //alert($(this).readonly());
    //$(this).prop("checked", false);
    $("#delete_vm").show();
    $("#delete_vm").removeClass("disabled");
    if($count_vm < 20) {
      //alert($count_vm);
      addVM();
      resetValueVM();
      $count_vm ++;
    } else{
      $(this).addClass("disabled");
    }
    //
     //$(this).readonly(true);
  } else{
      //$(this).addClass("disabled");
  }
});

$("#copy_vm").on("click", function() {
  if (!$(this).hasClass("disabled")) {
    //alert($(this).readonly());
    //$(this).prop("checked", false);
    $("#delete_vm").show();
    $("#delete_vm").removeClass("disabled");
    if($count_vm < 20) {
      //alert($count_vm);
      addVM();
      //resetValueVM();
      $count_vm ++;
    } else{
      $(this).addClass("disabled");
      $("#add_vm").addClass("disabled");
    }
    //
     //$(this).readonly(true);
  } else{
      //$(this).addClass("disabled");
  }
});

$("#delete_vm").on("click", function() {
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
    var newArray = packageData  ? packageData.nodes : [];
    //alert(newArray.length);
    if(newArray.length){
      //alert("newArray - if");
      var lastVM = newArray.pop();
      //alert(newArray.length);
      if(newArray.length == 0){
        $("#input_json").val(null);
      } else{
        var nodes = {"nodes": newArray};
        $("#input_json").val(JSON.stringify(nodes)).change();
      }
      
    }
    else{
      alert("newArray - else");
    }
    $count_vm --;
    if($count_vm == 1) { 
      $(this).addClass("disabled");
    }
    //
     //$(this).readonly(true);
  } else{
      //$(this).addClass("disabled");
  }
});

function addVM(){
  //var VM = {
  // return $VM = {
  //   "vm": $count_vm
  // }
  var $package = $("#input_json").val();
  //alert($("#input_json").val());
  $package = $package.replace(/\n+$/m, '');
  var packageData = $package && $package != '' ? JSON.parse($package) : null;
  //var packageData = $package && $package != '' ? $package : null;
  var newArray = packageData  ? packageData.nodes : [];
  //alert(newArray);
  newArray.push({
    "vm": $count_vm,
    "vm_networkcidr": $("#vm_networkcidr").val(),
    "vm_vcpu": $("#vm_vcpu").val(),
    "vm_ram": $("#vm_ram").val(),
    "vm_vmdk": $("#vm_vmdk").val(),
    "vm_zone": $("#vm_zone").val(),
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
  });
  //var nodes =  newArray;
   var nodes = {"nodes": newArray};
  $("#input_json").val(JSON.stringify(nodes)).change();
  //alert($("#input_json"));
  //var VM1 = "test"
  //return VM1;
}

function resetValueVM(){
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

function addVMToTable(vmData) {
  var table = $("#vm_table");
  if (table.length === 0) {
    // If table does not exist, create it
    $("#input_form").append(`
      <table id="vm_table" border="1">
        <thead>
          <tr>
            <th>VM #</th>
            <th>Network CIDR</th>
            <th>vCPU</th>
            <th>RAM</th>
            <th>VMDK</th>
            <th>Zone</th>
            <th>Disk1</th>
            <th>Disk1 Letter</th>
            <th>Disk2</th>
            <th>Disk2 Letter</th>
            <th>Disk3</th>
            <th>Disk3 Letter</th>
            <th>Disk4</th>
            <th>Disk4 Letter</th>
            <th>Disk5</th>
            <th>Disk5 Letter</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `);
    table = $("#vm_table");
  }
  table.find("tbody").append(`
    <tr>
      <td>${vmData.vm}</td>
      <td>${vmData.vm_networkcidr || ''}</td>
      <td>${vmData.vm_vcpu || ''}</td>
      <td>${vmData.vm_ram || ''}</td>
      <td>${vmData.vm_vmdk || ''}</td>
      <td>${vmData.vm_zone || ''}</td>
      <td>${vmData.vm_disk1 || ''}</td>
      <td>${vmData.vm_disk1_letter || ''}</td>
      <td>${vmData.vm_disk2 || ''}</td>
      <td>${vmData.vm_disk2_letter || ''}</td>
      <td>${vmData.vm_disk3 || ''}</td>
      <td>${vmData.vm_disk3_letter || ''}</td>
      <td>${vmData.vm_disk4 || ''}</td>
      <td>${vmData.vm_disk4_letter || ''}</td>
      <td>${vmData.vm_disk5 || ''}</td>
      <td>${vmData.vm_disk5_letter || ''}</td>
    </tr>
  `);
}



$("#admin_privileges").on("change",function(){
  if($(this).is(":checked")){
    $("#for_admin").show();
  }else{
    $("#for_admin").hide();
  }
});
//если новый запрос из селфсервиса, скрыть поле комментарий
if (ITRP.record.new){
  if (ITRP.context === 'self_service') {
    $("#self_service_new_request_wizard_note-container").parent().parent().hide();
  }
}
$("#is_ex_change").on("change",function(){
  if ($(this).is(":checked")){
    $("#row_justification").show();
  }else{
    $("#row_justification").hide();
    $("#justification").val(null).change();
    $("#inc_desc").parent().hide();
    $("#inc_desc").val(null).change();
  }
});

$("#justification").on("change",function(){
  if ($("#justification").val() === 'для_выполнения_поручения_руковод'){
    $("#inc_desc").parent().hide();
    $("#inc_desc").val(null).change();
  }else{
    $("#inc_desc").parent().show();
    }
});

//block_ui
if(ITRP.record.initialValues.custom_data["block_ui"] == true){$(this).hide();}
$("#correctness_mark").on("change",function(){
  if($(this).is(":checked")){
    $("#incorrect_mark").show();
  }else{
    $("#incorrect_mark").hide();
  }
});
  $("#is_dis").on("change",function(){
  if($(this).is(":checked")){
    $("#correctness_block").show();
  }else{
    $("#correctness_block").hide();
  }
});