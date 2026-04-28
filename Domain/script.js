var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML

$(".readonly").readonly(true);

/**** Всякая логика при нажаии чекбоксов/заполнении полей ****/
ITRP.hooks.register("after-prefill", function() {
  $("#name_is").on("change", function() {
    if ($(this).val()) {
      show($("#all_fields"));
    }
    else {
      hide($("#all_fields"));
    }
  });

  var result;
  var domainName = $extension.find("#domain_name");
  $("#domain_name").on("change", function() {
    var fields = $("#chg_domain, #chg_location, #chg_locations").closest(".row");
    if ($(this).val()) {
      show(fields);
    }
    else {
      hide(fields);
    }
    if (domainName.val() != ""){
        var filter = 'label: { values: ["' + domainName.data('item').label + '"] }';
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", 'application/json');
            },
            dataType: "json",
            url: "https://eok-dev.mos.ru/robot/getCIRecord",
            data: JSON.stringify({
                "filter": filter,
                "fields": "id, label, name, customFields { id, value }"
            }),
            method: 'post',
            success: function (data) {
                console.log('data - ' + JSON.stringify(data.data));
                result = getCustomFieldsJQuery(data.data);
                console.log(JSON.stringify(result));
                $("#dc").val() = result.dc;
            },
            error: function (data) {
                alert(JSON.stringify(data));

            }
        });
    }
  });

  $("#chg_domain").on("change", function() {
    if ($(this).is(":checked")) {
      show($("#domain_options"));
      fillItemFields(cview_Map, $("#domain_name"));
    }
    else {
      hide($("#domain_options"));
    }
  });

  $("#del_domain").on("change", function() {
    if ($(this).is(":checked")) {
      hide($("#domain_options_extra"));
    }
    else {
      show($("#domain_options_extra"));
    }
  });

  $("#domain_options [id^='chg_']").on('change', function() {
    var $targetDiv = $(this).closest('.row').next('.row');
    if ($(this).is(':checked')) {
        show($targetDiv);
    } else {
        hide($targetDiv);
    }
  });

  $("#chg_location").on("change", function() {
    if ($(this).is(":checked")) {
      show($("#location_options"));
    }
    else {
      hide($("#location_options"));
    }
  });

  $("#new_location").on("change", function() {
    if ($(this).is(":checked")) {
      show($("#new_location_section, #table_section"));
    }
    else {
      hide($("#new_location_section, #table_section"));
    }
  });

  $("#chg_locations").on("change", function() {
    hide($(".section.extra, #button_row, .btn.del"));
    if ($(this).is(":checked")) {
      show($("#chg_location_1, #button_row"));
    }
    else {
      hide($("#chg_location_1"));
    }
  });

  $('div[id^="chg_location"] [id^="chg"]').on("change", function () {
    var $targetDiv = $(this).closest('.row').next('.row');

    if($(this).is(":checked")) {
      show($targetDiv);
    } else {
      hide($targetDiv);
    }
  });

  $("#conn_type").on("change", function() {
    toggle($("#upstream_ptaf").closest("div.row"), $("#conn_type").val() === "ip_address:port");
    toggle($("#balancing_local_info").closest("div.row"), $("#conn_type").val() === "redirect");
  }).change();
});

// для заполнения полей в разделе domain_options значениями из КЕ
var cview_Map = new Map([
  ["cur_dc", ['custom_fields','Домен балансировки - Площадка ЦОД', 'id']],
  ["cur_balancing_farm", ['custom_fields','Домен балансировки - Ферма балансировки', 'id']],
  ["cur_balancing_gost", ['custom_fields','Домен балансировки - ГОСТ']],
  ["cur_zone", ['custom_fields','Домен балансировки - Зона', 'id']],
  ["cur_ext_balancer", ['custom_fields','Домен балансировки - Зарубежная балансировка (EXT)']],
  ["cur_dr_balancer", ['custom_fields','Домен балансировки - Георазнесенная балансировка (DR)']],
]);

function fillItemFields(cvmap, $item) {
  cvmap.forEach(function(value, key) {
    var $field = $("#" + key);
    var item = value.reduce(function(acc, next) {
      if (acc) { 
        if (acc.constructor === Array)
          return acc.map(function (x) {return x[next];});
        else
          return acc[next];
      }
      else
        return null;
    }, $item.data("item"));
    console.log(value,item);
    $field.val(item).change();

  });
}

function getCustomFieldsJQuery(data) {
  var result = {};
  var fields = (data[0] && data[0].customFields) || [];
  console.log('fields' + JSON.stringify(fields));  
  $.each(fields, function(i, field) {
      result[field.id] = field.value;
  });
  
  return result;
}


/**** Кнопки ****/
$(".button.add").on("click", function() {
  var parent_section = $(this).parents(".section").first();
  var hidden = parent_section.find(".section.extra").filter(function() {
    return $(this).css('display') == 'none';
  });
  var first_hidden = hidden.first();
  if (hidden.length > 0) {
    show($(".btn.del"));
    show(first_hidden);
  }
  if (hidden.length <= 1) {
    hide($(".btn.add"));
  }
});
$(".button.del").on("click", function() {
  var parent_section = $(this).parents(".section").first();
  var shown = parent_section.find(".section.extra").filter(function() {
    return $(this).css('display') != 'none';
  });
  var last_shown = shown.last();
  if (shown.length > 0) {
    hide(last_shown);
    show($(".btn.add"));
  }
  if (shown.length <= 1) {
    hide($(".btn.del"));
  }
});

/**** Логика формирования таблицы ****/
var headers = ["№", "path", "Label", "Схема связи", "Upstream frontend", "Upstream PTAF", "ACL", "Upstream health check", "Локальные параметры"];

var max_rows = undefined;

var max_symbols = 65000;

var $static_fields = I.UiExtensionsWidget.allFields($(".static"));

ITRP.hooks.register("after-prefill", function() {

  var entries = tryParseJSON($("#loc_json").val());
  if (!entries.length) {
    entries = [];
  }
  else {
    $static_fields.readonly(true);
  }
  if (entries.length >= max_rows) {
    $("#add_row").find(".button").addClass("disabled");
  }
  $("#del_num").attr("max", entries.count()).trigger("input");
  
  // Добавление строк
  $("#add_row").on("click", function() {
    if ($(this).is(":not(:has(.disabled))")) {
      var entries = tryParseJSON($("#loc_json").val());
      if (!entries.length)
        entries = [];
      var noEmptyFields = $("#new_location_section").find(".required:visible:not(div.row)").filter(function() { return !$(this).val() || $(this).val().length === 0; }).length === 0;
      if (noEmptyFields) {
        //var is_name_duplicate = entries.some(function(el) { return el.table_data.name === sla_name; });
        if (false) {
          alert("В таблице уже существует запись с именем '" + sla_name + "'");
        }
        else {
          var table_data = {
            path: $("#path").val(),
            label: $("#domain_name").data("item").label,
            upstream_frontend: $("#upstream_frontend").val(),
            upstream_ptaf: $("#upstream_ptaf").val(),
            acl: $("#acl").val(),
            upstream_health_check: $("#upstream_health_check").val(),
            balancing_local_info: $("#balancing_local_info").val(),
          };
          var entry = {
            "_Name": "Location",
            "_Status": "in_stock",
            "_Label": $("#domain_name").data("item").label,
            "_Product": "Location",
            "_Support Team": "Техническая команда",
            "_cf_path": $("#path").val(),
            "_cf_upstream_frontend": $("#upstream_frontend").val(),
            "_cf_upstream_ptaf": $("#upstream_ptaf").val(),
            "_cf_acl": $("#acl").val(),
            "_cf_upstream_health_check": $("#upstream_health_check").val(),
            "_cf_balancing_local_info": $("#balancing_local_info").val(),
            table_data: table_data,
          };
          entries.push(entry);
          var new_json = JSON.stringify(entries);
          var table_data = entries.map(function(el) { return el.table_data; });
          var new_table = markupTable(headers, table_data);

          if (new_json.length < max_symbols && new_table.length < max_symbols) {
            $static_fields.readonly(true);
            $("#del_num").attr("max", entries.count()).trigger("input");
            $("#loc_json").val(JSON.stringify(entries)).change();
            
            $("#loc_table").val({html: new_table}).change();
            reset($("#new_location_section"));
            if (entries.length >= max_rows) {
              $("#add_row").find(".button").addClass("disabled");
              $("#max_rows_info").show();
              $("#new_location_section").hide();
            }
          }
          else {
            alert("Превышен допустимый размер поля. Для добавления дополнительных строк необходимо удалить ранее добавленные или подать сведения по ним в новом запросе.");
          }
        }
      }
      else {
        alert("Для добавления новой записи заполните все обязательные поля");
      }
    }
  });
  
  //Удаление строки
  $("#del_row").on("click", function() {
    var delete_num = parseInt($("#del_num").val());
    var entries = tryParseJSON($("#loc_json").val());
    if (entries && delete_num > 0 && delete_num <= entries.length) {
      entries.splice(delete_num - 1, 1);
      reset($("#del_num").closest("div.row"));
      $("#del_num").attr("max", entries.length).trigger("input");
      $("#loc_json").val(JSON.stringify(entries)).change();
      var table_data = entries.map(function(el) { return el.table_data; });
      var new_table = markupTable(headers, table_data);
      $("#loc_table").val({html: new_table}).change();
      $("#add_row").find(".button").removeClass("disabled");
      $("#max_rows_info").hide();
      if (entries.length <= 0)
        $static_fields.readonly(false);
    }
  });

  $("#fin").on("change", function(e) {
    var entries = tryParseJSON($("#loc_json").val());
    if (!entries.length)
      entries = [];
    if ($(this).is(":checked")) {
      if (entries.length <= 0) {
        alert("Для сохранения таблицы необходимо заполнить хотя бы одну строку");
        $(this).prop("checked", false);
        $(this).addClass("required");
      }
      else {
        hide($("#new_location_section, #buttons_section"));
      }
    }
    else {
      show($("#new_location_section, #buttons_section"));
    }
  }).change();
  
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

function toggle(el, is_show) {
  is_show ? show(el) : hide(el);
}

function show(el) {
  el.show();
}

function hide(el) {
  el.hide();
  ITRP.clearFormData(el);
  var text_elements = el.find(":is(input, div, select, textarea,)");
  text_elements.change();
  text_elements.removeClass("invalid");
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
    fields.filter(".required[data-multiple]").required(true);
  }, "0");
}