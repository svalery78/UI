var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var docLoad;

// Достаем id запрашивающего из URL
if (ITRP.record.new){
  if (ITRP.context === 'self_service') { 
    $("#requestor").val($("#requested_for_id").val());
  }

  if (ITRP.context != 'self_service') { 
    $("#requestor").val($("#req_requested_for_id").val());
  }
}

var cview_Map = new Map([
    ["current_user", ["users", "id"]],
    ["current_status ", ["status"]],
    ["current_manager", ["custom_fields", "Владелец КЕ", "id"]],
    ["current_is_manager", ["custom_fields", "Ответственный по ИС", "id"]],
    ["current_name", ["name"]],
    ["current_product", ["custom_fields", "Продукт-владелец ДИТ", "id"]],
    ["current_interaction_with_dc", ["custom_fields", "Взаимодействие с ЦОД", "id"]],
    ["current_ib", ["custom_fields", "Инф. безопасность", "id"]],
    ["current_owner", ["custom_fields", "Организация Собственник ИС", "id"]],
    ["current_critical", ["custom_fields", "Критичность ИС"]],
    ["current_label", ["label"]],
]);


var cview_Map2 = new Map([

    ["is_code_old", ["custom_fields", "ИС - Код ИС"]],
]);


var codeIS = $extension.find("#is_code");
codeIS.on('change', function () {
  //alert('codeIS');
  if (docLoad) {  
    //alert('codeIS - changed');
    if (codeIS.val() != "") {
        var filterContent = 'customFilters: { name: "ИС - Код ИС", values: ["' + codeIS.val() + '"]}' ;
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", 'application/json');
            },
            dataType: "json",
            url: "https://eok-dev.mos.ru/robot/checkUniquenessISCode",
            data: JSON.stringify({
                "filterContent": filterContent
            }),
            //data: filterContent,
            method: 'post',
            success: function (data) {
                if (data.messages){
                    alert("Значение уже занято, введите новое значение");
                    codeIS.val(null);
                    codeIS.addClass("required");
                }
            },
            error: function (data) {
                alert(JSON.stringify(data));

            }
        });
    };
  };
});

var label = $extension.find("#label");
label.on('change', function () {
  //alert('codeIS');
  if (docLoad) {  
    //alert('codeIS - changed');
    if (label.val() != "") {
        var filterContent = 'label: { values: "' + label.val() + '"}' ;
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", 'application/json');
            },
            dataType: "json",
            url: "https://eok-dev.mos.ru/robot/checkUniquenessISCode",
            data: JSON.stringify({
                "filterContent": filterContent
            }),
            //data: filterContent,
            method: 'post',
            success: function (data) {
                if (data.messages){
                    alert("Значение уже занято, введите новое значение");
                    codeIS.val(null);
                    codeIS.addClass("required");
                }
            },
            error: function (data) {
                alert(JSON.stringify(data));

            }
        });
    };
  };
});




$(".readonly").readonly(true);

document.getElementById('is_code').addEventListener('input', function (event) {
    this.value = this.value.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^[\d]/, '');
});


if (ITRP.record.new) {
    if (ITRP.context === 'self_service') {
        $("#self_service_new_request_wizard_note-container").parent().parent().hide();
    };
};
$("#req_note").hide();

if (ITRP.record.new) {
    //обязательность одного из чекбоксов группы change
    var $checkboxes_change = $(".checkbox input.change");
    ITRP.hooks.register('after-prefill', function () { checkCheckboxes($checkboxes_change); });
    $checkboxes_change.on("click", function () { checkCheckboxes($checkboxes_change); });
};

// $("#is_code_old").on("change",function(){
//   if($("#is_code_old").val() == "null") {
//     show($("#chg_is_code_row"));
//     //show($("#is_code_row"));
//     console.log("Триггер сработал");
//     //fillItemFields(cview_Map, $(this));
//   }
//   else {
//     console.log("Триггер не сработал");
//     hide($("#chg_is_code_row"));
//   }
// }).change();
$("#is_code_old").on("change", function () {
    if ($("#is_code_old").val() == "" || $("#is_code_old").val() == null) {
        show($("#chg_is_code_row"));
        console.log("Триггер сработал");
    }
    else {
        console.log("Триггер не сработал");
        hide($("#chg_is_code_row"));
        hide($("#chg_is_code_dis"));
        $("#is_code_old").hide();
        $("#is_2").hide();
    };
}).change();

$("#chg_is_code").on("change", function () {
    if ($(this).is(":checked")) {
        show($("#is_code_row"));
    } else {
        hide($("#is_code_row"));
    };
}).change();

ITRP.hooks.register('after-prefill', function () {

    // if ($("#is").val()) {
    //   show($("#attr_is"));
    //   fillItemFields(cview_Map, $(this));
    // }else {
    //   hide($("#attr_is"));
    // }




    // $("#is").on("change", function() {
    //     //hide($("#attr_is"));
    //     if ($(this).val()) {
    //       //show($("#attr_is"));
    //       var isValue = $(this).val(); 
    //       $("#is_2").val(isValue);       
    //       fillItemFields2(cview_Map2, $("#is_2"));
    //     }
    //   });




    $("#chg_user").on("change", function () {
        if ($(this).is(":checked")) {
            $("#user_info").show();
            //$("#del_users").val($("#current_user").val()).change();
        }
        else {
            $("#user_info").hide();
            //$("#del_users").val(null).change();
        };
    });

    var $chgLabel = $("#chg_label");
    var $labelRow = $("#label_row");
    var $newLabelField = $("#new_label");

    $chgLabel.on("change", function () {
        if ($(this).is(":checked")) {
            $labelRow.show(); // Используем стандартный show() или ITRP.show()
            $newLabelField.required(true);
            
            // Опционально: подставляем текущее значение как начальное для редактирования
            if (!$newLabelField.val()) {
                $newLabelField.val($("#current_label").val());
            }
        } else {
            $labelRow.hide();
            $newLabelField.required(false);
        }
    });

    // Вызываем change сразу, чтобы проверить состояние при загрузке (если это редактирование)
    $chgLabel.change();
});
$(".checkbox input").on("change", function () {
    var checkbox_div = $(this).parents("div.checkbox");
    var next_div = checkbox_div.next("div.row.vertical");
    if ($(this).is(":checked")) {
        show(next_div);
    }
    else {
        hide(next_div);
    };
}).change();

var is_prev_val = $("#is").val();
$("#is").on("change", function () {
    if ($(this).val() != is_prev_val) {
        is_prev_val = $(this).val();
        hide($("#attr_is"));
        if ($(this).val()) {
            show($("#attr_is"));
            fillItemFields(cview_Map, $(this));
            var isValue = $(this).val();
            $("#is_2").val(isValue);
            setTimeout(function () {
                fillItemFields(cview_Map2, $("#is_2"));
            }, 500); // Задержка
          $("#is_code_old").hide();
          $("#is_2").hide();
        } else {
            hide($("#attr_is"));
        };
    };
});


//Обработка поля chg_sup
$("#chg_sup").on("change", function () {
    if ($(this).is(":checked")) {
        show($("#oper_org"));
    } else {
        hide($("#oper_org"));
    };
}).change();

//Обработка поля chg_inf
$("#chg_inf").on("change", function () {
    if ($(this).is(":checked")) {
        show($("#resp_inf"));
    } else {
        hide($("#resp_inf"));
    };
}).change();

function show(el) {
    el.show();
};
function hide(el) {
    el.hide();
    ITRP.clearFormData(el);
    var text_elements = el.find(":is(input, div, select, textarea)");
    text_elements.change();
};

function fillItemFields(cvmap, $item) { // Заполнение полей из метаданных объекта по маппингу
    cvmap.forEach(function (value, key) {
        var $field = $("#" + key);
        var item = value.reduce(function (acc, next) {
            if (acc) {
                if (acc.constructor === Array)
                    return acc.length > 0 ? acc.map(function (x) { return x[next]; }) : null;
                else
                    return acc[next];
            }
            else
                return null;
        }, $item.data("item"));
        console.log(item);
        if ($field.is(".date") && item)
            $field.dateEntry('setDate', new Date(item));
        else if ($field.is("[type='checkbox']"))
            $field.prop("checked", item);
        else
            $field.val(item);
        $field.change();
        $field.trigger("input");
    });
};



function checkCheckboxes(checkboxes) {
    var checked = checkboxes.filter(function () {
        return $(this).is(":checked");
    });
    if (checked.length > 0) {
        checkboxes.required(false);
    }
    else {
        checkboxes.required(true);
    };
};

$(document).ready(function () {
    //alert('document load');
    docLoad = true;
});

ITRP.hooks.register('after-prefill', function () {
    $("#chg_user").on("change", function () {
        if ($(this).is(":checked")) {
            show($("#add_users_row"));
            show($("#del_users_row"));
        } else {
            hide($("#add_users_row"));
            hide($("#del_users_row"));
        }
    });
}).change();