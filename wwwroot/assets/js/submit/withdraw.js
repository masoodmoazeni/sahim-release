"use strict";

// Class definition
var KTProjectSettings = function () {

    // Private functions
    var handleForm = function () {
        // Init Datepicker --- For more info, please check Flatpickr's official documentation: https://flatpickr.js.org/
        $("#kt_datepicker_1").flatpickr({
            locale: "fa",           // فارسی سازی متن
            calendarType: "jalali", // تبدیل میلادی به شمسی
            dateFormat: "Y/m/d",    // فرمت تاریخ شمسی
            altInput: true,         // نمایش زیباتر تاریخ
            altFormat: "Y/m/d",
            defaultDate: new Date() // تاریخ پیش‌فرض امروز
        });


        // Form validation
        var validation;
        var _form = document.getElementById('kt_project_settings_form');
        var submitButton = _form.querySelector('#kt_project_settings_submit');

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            _form,
            {
                fields: {
                    name: {
                        validators: {
                            notEmpty: {
                                message: 'Project name is required'
                            }
                        }
                    },
                    type: {
                        validators: {
                            notEmpty: {
                                message: 'Project type is required'
                            }
                        }
                    },
                    description: {
                        validators: {
                            notEmpty: {
                                message: 'Project Description is required'
                            }
                        }
                    },
                    date: {
                        validators: {
                            notEmpty: {
                                message: 'Due Date is required'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // حالا فعال شد
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );

        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            submitButton.addEventListener('click', function (e) {
                e.preventDefault();

                validation.validate().then(function (status) {
                    if (status == 'Valid') {
                        // داده‌های فرم رو جمع کنیم
                        var formData = new FormData(_form);

                        // ارسال به سرور
                        fetch('/home/withdraw', {
                            method: 'POST',
                            body: formData
                        })
                            .then(async response => {
                                if (response.ok) {
                                    const result = await response.json();
                                    swal.fire({
                                        text: "عملیات با موفقیت انجام شد!",
                                        icon: "success",
                                        buttonsStyling: false,
                                        confirmButtonText: "باشه",
                                        customClass: {
                                            confirmButton: "btn fw-bold btn-light-primary"
                                        }
                                    }).then(() => {
                                        // مثلا بعد موفقیت، کاربر رو ریدایرکت کنیم
                                        window.location.href = '/withdraw';
                                    });
                                } else {
                                    const errorText = await response.text();
                                    swal.fire({
                                        text: "خطا: " + errorText,
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "باشه",
                                        customClass: {
                                            confirmButton: "btn fw-bold btn-light-primary"
                                        }
                                    });
                                }
                            })
                            .catch(error => {
                                swal.fire({
                                    text: "مشکلی در ارتباط با سرور پیش آمده: " + error.message,
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "باشه",
                                    customClass: {
                                        confirmButton: "btn fw-bold btn-light-primary"
                                    }
                                });
                            });
                    } else {
                        swal.fire({
                            text: "لطفا تمام فیلدها را کامل کنید.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "باشه",
                            customClass: {
                                confirmButton: "btn fw-bold btn-light-primary"
                            }
                        });
                    }
                });
            });
        });
    }

    // Public methods
    return {
        init: function () {
            handleForm();
        }
    }
}();


// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTProjectSettings.init();
});
