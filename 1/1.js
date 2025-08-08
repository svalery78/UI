var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var vm_headers = ["№", "hostname", "диски"];

$("#tech_details .ProseMirror").attr("contentEditable", false);


ITRP.hooks.register("after-prefill", function() {

  var entries = tryParseJSON($("#json5").val());
  if (!entries.vhd)
      entries.vhd = [];
  $("#del_num_vm").attr("max", entries.vhd.count()).trigger("input");
  reset($("#for_new_disks"));
  
  // Добавление строки vm
  $("#add_vm").on("click", function() {
    var $for_add = $(".table-add-required").filter(function() { return $(this).is(":visible"); });
    var $not_filled = $for_add.filter(function() { return !$(this).val(); });
    if ($not_filled.length) {
      $for_add.removeClass("empty_value_table_input");
      $not_filled.addClass("empty_value_table_input");
      $not_filled.one("change", function() { $(this).removeClass("empty_value_table_input"); });
      alert("Перед добавлением в таблицу необходимо заполнить все поля");
    }
    else {
      var entries = tryParseJSON($("#json5").val());
      if (!entries.vhd)
        entries.vhd = [];
      var hostname = $("#vm_hostname").data("item").name;
      entries.vhd.push({
        hostname: hostname ? hostname : "",
        hdd_name: $("#scsi_id0").val(),
        vhd_id: String($("#vm_disk0").val()),
      });
      $(".extra:visible").each(function(ind, el) {
        entries.vhd.push({
        hostname: hostname ? hostname : "",
        hdd_name: $(el).find(".scsi_id").val(),
        vhd_id: String($(el).find(".vm_disk").val()),
      });
      });
      
      $("#del_num_vm").attr("max", entries.vhd.count()).trigger("input");
      $("#json5").val(JSON.stringify(entries)).change();
      var new_table = markupTable(vm_headers, entries.vhd);
      $("#vm_disks_form").val({html: new_table}).change();
      reset($("#for_new_disks"));
      $("#for_new_disks").find(".section.extra").hide();
      $("#for_new_disks").find(".btn.del").hide();
      $("#for_new_disks").find(".btn.add").show();
    }
  });
  
  //Удаление строки vm
  $("#del_vm").on("click", function() {
    var delete_vm = $("#del_num_vm").val();
    var entries = tryParseJSON($("#json5").val());
    if (entries.vhd && delete_vm) {
      entries.vhd = entries.vhd.filter(function(el) { return el.hostname != delete_vm; });
      $("#del_num_vm").attr("max", entries.vhd.count()).trigger("input");
      $("#json5").val(JSON.stringify(entries)).change();
      var new_table = markupTable(vm_headers, entries.vhd);
      $("#vm_disks_form").val({html: new_table}).change();
    }
    reset($("#del_num_vm"));
  });

  $("#finish_task").on("change", function(e) {
    var entries = tryParseJSON($("#json5").val());
    if ($(this).is(":checked")) {
      if ($(".table-add-required:not(.readonly)").toArray().some(function(el) {return $(el).val();})) {
        alert("В UI форме остались заполненные поля, данные по которым не были внесены в таблицу. Пожалуйста, внесите их с помощью кнопки 'Внести указанные диски в таблицу', либо очистите поля, если данные в них неактуальны.");
        $(this).prop("checked", false);
      }
      else if (!((entries.vhd && entries.vhd.length))) {
        alert("Для сохранения таблицы необходимо добавить хотя бы одну ВМ.");
        $(this).prop("checked", false);
      }
      else {
        hide($("#for_new_disks,#edit_table"));
        $("#for_new_disks").find(".section.extra").hide();
        $("#for_new_disks").find(".btn.del").hide();
        $("#for_new_disks").find(".btn.add").show();
      }
    }
    else {
      show($("#for_new_disks,#edit_table"));
    }
  }).change();

  $("#task_status").on("change", function() {
    $(".required-on-completion").required( $(this).val() === "completed" );
  });
  
});
  
  
// Логика появления/скрытия доп. дисков
ITRP.hooks.register('after-prefill', function() { // Инициализация (если редактируем существующую запись)
  var filled_sections = $(".section.extra").filter(function() {
    return $(this).find(':not(.checkbox) input,select').filter(valueExists).length > 0;
  });
  var empty_sections = $(".section.extra").filter(function() {
    return $(this).find(':not(.checkbox) input,select').filter(valueExists).length === 0;
  });
  show(filled_sections);
  show(filled_sections.parent().closest(".section").find(".btn.del"));
  show(empty_sections.parent().closest(".section").find(".btn.add"));

  function valueExists() {
    return $(this).val();
  }
});

$(".button.add").on("click", function() { // Логика кнопки +
  var parent_section = $(this).closest(".section");
  var hidden = parent_section.find(".section.extra").filter(function() {
    return $(this).css('display') == 'none';
  });
  var first_hidden = hidden.first();
  if (hidden.length > 0) {
    show(parent_section.find(".btn.del"));
    show(first_hidden);
  }
  if (hidden.length <= 1) {
    hide(parent_section.find(".btn.add"));
  }
});
$(".button.del").on("click", function() { // Логика кнопки -
  var parent_section = $(this).closest(".section");
  var shown = parent_section.find(".section.extra").filter(function() {
    return $(this).css('display') != 'none';
  });
  var last_shown = shown.last();
  if (shown.length > 0) {
    hide(last_shown);
    show(parent_section.find(".btn.add"));
  }
  if (shown.length <= 1) {
    hide(parent_section.find(".btn.del"));
  }
});

function markupTable(headers, val_array) {
  var headers_row = "<tr><th>" + headers.join("</th><th>") + "</th></tr>";
  var val_rows = val_array.map(function(val_obj, index) {
    var obj_vals = Object.values(val_obj);
    return "<tr><td>" + (index+1) + "</td><td>" + obj_vals.slice(0, headers.count() - 1).join("</td><td>") + "</td></tr>";
  });
  return "<table>" + headers_row + val_rows.join("") + "</table>";
}

function tryParseJSON(json) {
  try {
    return JSON.parse(json);
  }
  catch(e) {
    return {};
  }
}


function show(el) { // Функция показа элемента
  el.show();
}
 
function hide(el) { // Функция скрытия элемента el + очищения всех дочерних полей
  el.hide();
  reset(el);
}
 
function reset(el) {
  el.find("i.cancel").click(); // Очищение вложений
  var fields = I.UiExtensionsWidget.allFields(el).addBack();
  fields.each(function(i) {
    if ($(this).is("input[type=radio], input[type=checkbox]")) {
      var init = $(this).attr("checked") ? true : false;
      $(this).prop("checked", init);
    }
    else if ($(this).is("input[value]")) {
      $(this).val($(this).attr("value"));
    }
    else if ($(this).is("select")) {
      var init = $(this).find("option[selected]").val();
      $(this).val(init ? init : "");
    }
    else {
      $(this).val("");
      $(this).val("");
    }
  });
  setTimeout(function() {
    fields.change();
    fields.trigger("input");
  }, "0");
}