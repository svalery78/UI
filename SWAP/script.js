var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

$("#requestor").hide();

// Достаем id запрашивающего из URL
if (ITRP.record.new){
  if (ITRP.context === 'self_service') { 
    $("#requestor").val($("#requested_for_id").val());
  }

  if (ITRP.context != 'self_service') { 
    $("#requestor").val($("#req_requested_for_id").val());
  }
}

$("#vm_hostname").on("change",function(){
  if($(this).val()){
    $("#checkblock").show();
  }else{
    $("#checkblock").hide();
    $("#swap_operation").val("").change();
  }
});

// $("#swap_operation").on("change",function()
//   {
//   if ($("#swap_operation").val() === 'increase')
//     {
//       $("#row_swap_curr").slideDown();
//       $("#row_swap_new").slideDown();
//     }
//   else
//   {
//     $("#row_swap_curr").slideUp();
//     $("#swap_curr").val(null).change();
//     $("#row_swap_new").slideUp();
//     $("#swap_new").val(null).change();
//     $("#warning_not_enough").hide();
//   }
//   }
// );

$("#swap_operation").on("change", function() {
  if ($("#swap_operation").val() === 'increase') {
    $("#row_swap_curr").slideDown();
    $("#row_swap_new").slideDown();
    $("#warning_not_enough").hide();
  } else {
    var swapCurrValAtStart = parseFloat($("#swap_curr").val());
    var swapNewValAtStart = parseFloat($("#swap_new").val());
    $("#row_swap_curr").slideUp();
    $("#swap_curr").val(null).change();
    $("#swap_new").val(null).change();
    $("#row_swap_new").slideUp();
    if (isNaN(swapNewValAtStart) || isNaN(swapCurrValAtStart) || swapNewValAtStart <= swapCurrValAtStart) {
        $("#swap_new").val(null).change();
    }
    $("#warning_not_enough").hide();
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

$("#increase").on("change",function(){
  if($("#increase").is(":checked")){
    $("#for_curr_swap").show();
    $("#for_new_swap").show();
  }else{
    $("#for_curr_swap").hide();
    $("#for_curr_swap").val(null).change();
    $("#for_new_swap").hide();
    $("#for_new_swap").val(null).change();
  }
});

//block_ui
if(ITRP.record.initialValues.custom_data["block_ui"] == true){
  $('#user_info').hide();
} else {
  $('#user_info').show();
}

$("#is_reopen").on("change",function(){
  if($(this).is(":checked")){
    $("#correctness_block").show();
  }else{
    $("#correctness_block").hide();
  }
});

$("#swap_new, #swap_curr").on("blur", function () { 
  var swCurr = parseFloat($("#swap_curr").val());
  var swNew = parseFloat($("#swap_new").val()); 

  if (isNaN(swNew) || isNaN(swCurr) || swNew <= swCurr) {
    $("#swap_new").val(""); 
    $("#warning_not_enough").show().change();
    $("#swap_new").addClass("required");
  } else {
    $("#warning_not_enough").hide().change();
    $("#swap_new").removeClass("required");
  }
});