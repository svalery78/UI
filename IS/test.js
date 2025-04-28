var $ = ITRP.$;            // jQuery
var $extension = $(this);  // The UI Extension container with custom HTML
var docLoad;
//---

function setrec(iarr) {
    iarr.forEach(function (id) {
        $("#" + id).required(true);
        console.log($("#" + id));
    });
}

//document.getElementById('is_code').addEventListener('input', function (event) {
//  this.value = this.value.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^[\d]/, '');
//});

// 1. Жесткая фиксация required при загрузке
document.addEventListener('DOMContentLoaded', function () {
    var field = document.getElementById('is_code');
    field.setAttribute('required', 'required');
    field.required = true;
});

// 2. Обработчик ввода с двойной страховкой
document.getElementById('is_code').addEventListener('input', function () {
    var field = this;

    // Фильтрация
    field.value = field.value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/^\d/, '')
        .slice(0, 6);

    // Двойное подтверждение required
    field.setAttribute('required', 'required');
    field.required = true;
});

// 3. Улучшенный обработчик blur
document.getElementById('is_code').addEventListener('blur', function () {
    var field = this;

    // Тройная страховка required
    field.setAttribute('required', 'required');
    field.required = true;
    setTimeout(function () { field.required = true; }, 10);

    // Очистка при 1 символе
    if (field.value.length === 1) {
        field.value = '';
        setTimeout(function () {
            field.setAttribute('required', 'required');
            field.required = true;
        }, 20);
    }
});

// 4. Атомарная проверка формы
var form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function (e) {
        var field = document.getElementById('is_code');
        if (!field.value || field.value.length < 2) {
            e.preventDefault();
            field.focus();
            field.setAttribute('required', 'required');
            field.required = true;

            // Создаем свое сообщение вместо alert
            var error = document.getElementById('custom-error');
            if (!error) {
                error = document.createElement('div');
                error.id = 'custom-error';
                error.style.color = 'red';
                field.parentNode.insertBefore(error, field.nextSibling);
            }
            error.textContent = 'Введите 2-6 символов (первый - буква)';
        }
    });
}


$("#type,#period,#state").on("change", function () {
    console.log(true);
    $("#decl,#expl,#expl_date,#customer_dev,#oper,#balance_holder").required(false); //Сначала всё очищаем
    var type = $("#type").val();
    var period = $("#period").val();
    var state = $("#state").val();
    if (type == "общегородская") {
        switch (period) {
            case "концептуальный_этап":
            case "создание_гис":
            case "ввод_гис_в_эксплуатацию":
                if (state == "эксплуатация_гис" || state == "гис_выведена_из_эксплуатации") {
                    console.log("obsh");
                    setrec(["decl", "expl", /*"expl_date"*/, "customer_dev", "oper", "balance_holder"]);
                    break;
                } else {
                    setrec(["customer_cr"]);
                    break;
                }

            case "эксплуатация_гис":
            case "развитие_(модернизация)_гис":
            case "вывод_ис_гиз_эксплуатации":
            case "гис_выведена_из_эксплуатации":
                setrec(["decl", "expl", "expl_date", "customer_dev", "oper", "balance_holder"]);
                break;
            case "архив":
                if (state == "эксплуатация_гис" || state == "гис_выведена_из_эксплуатации") {
                    console.log("obsh");
                    setrec(["decl", "expl", /*"expl_date"*/, "customer_dev", "oper", "balance_holder"]);
                    break;
                }
        }
    } else if (type == "отраслевая") {
        switch (period) {
            case "концептуальный_этап":
            case "создание_гис":
            case "ввод_гис_в_эксплуатацию":
                if (state == "эксплуатация_гис" || state == "гис_выведена_из_эксплуатации") {
                    console.log("eotr");
                    setrec(["expl", "expl_date", "customer_dev", "oper", "balance_holder"]);
                    break;
                } else {
                    setrec(["customer_cr"]);
                    break;
                }
            case "эксплуатация_гис":
            case "развитие_(модернизация)_гис":
            case "вывод_ис_гиз_эксплуатации":
            case "гис_выведена_из_эксплуатации":
                setrec(["expl", "expl_date", "customer_dev", "oper", "balance_holder"]);
                break;
            case "архив":
                if (state == "эксплуатация_гис" || state == "гис_выведена_из_эксплуатации") {
                    setrec(["expl", "expl_date", "customer_dev", "oper", "balance_holder"]);
                    break;
                }
        }

    } else if (type == "технологическая") {

    } else if (type == "программное_обеспечение") {

    }
});


//
$("#class").on("change", function () {
    if ($(this).val() == "подсистема") {
        $("#hl_sys").parent().show();
    } else {
        ITRP.clearFormData($("#hl_sys").parent());
        $("#hl_sys").parent().hide();
    }
});

$("#is_agr").on("change", function () {
    if ($(this).val() == "да") {
        $("#transfer_basis").required(true);
        $("#hl_sys").required(true);
        $("#gis_name").parent().hide();
        $("#gis_label").parent().hide();
        ITRP.clearFormData($("#gis_name").parent());
        ITRP.clearFormData($("#gis_label").parent());
    } else {
        $("#transfer_basis").required(false);
        // $("#hl_sys").required(false);
        $("#gis_name").parent().show();
        $("#gis_label").parent().show();
    }
});
$("#is_gis").on("change", function () {
    if ($(this).val() == "да") {
        $("#hl_sys").parent().show();
        $("#for_gis").hide();
        ITRP.clearFormData($("#for_gis"));
    } else if ($(this).val() == "нет") {
        $("#for_gis").show();
        ITRP.clearFormData($("#hl_sys").parent());
        $("#hl_sys").parent().hide();
    } else {
        $("#for_gis").hide();
        ITRP.clearFormData($("#for_gis"));
        ITRP.clearFormData($("#hl_sys").parent());
        $("#hl_sys").parent().hide();
    }
});
var codeIS = $extension.find("#is_code");
codeIS.on('change', function () {
    
    if (docLoad) {
        if (codeIS.val() != "") {
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader("Content-Type", 'application/json');
                },
                dataType: "json",
                url: "https://eokback-test.mos.ru/robot/checkUniquenessISCode",
                data: JSON.stringify({
                    "isCode": codeIS.val()
                }),
                method: 'post',
                success: function (data) {
                    if (data.messages) {
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
ITRP.hooks.register('after-prefill', function () { //UI готова
    $("#product_manager").readonly(true); //Дисейблим поле
});

$(document).ready(function () {
    
    docLoad = true;
});

/*$("#product").on("change",function(){
  var prod_man = $(this).data("item").custom_fields['Владелец продукта'].id;
  console.log(prod_man);
  $("#product_manager").val(prod_man);
});*/


