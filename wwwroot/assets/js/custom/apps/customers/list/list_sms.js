"use strict";

// Class definition
var KTSmsList = function () {
    var datatable;
    var table;

    var initSmsList = function () {
        const tableRows = table.querySelectorAll('tbody tr');

        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            const realDate = moment(dateRow[3].innerHTML, "HH:mm - YYYY/MM/DD").format();
            dateRow[3].setAttribute('data-order', realDate);
        });

        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            'columnDefs': [
                { orderable: false, targets: 0 },
            ],
            "language": {
                "paginate": {
                    "previous": "قبلی",
                    "next": "بعدی"
                },
                "zeroRecords": "موردی یافت نشد",
                "info": "نمایش _START_ تا _END_ از _TOTAL_ رکورد",
                "infoEmpty": "رکوردی موجود نیست",
                "infoFiltered": "(فیلتر شده از مجموع _MAX_ رکورد)"
            }
        });

        datatable.on('draw', function () {
            toggleToolbars();
        });
    }

    var handleSearch = () => {
        const searchInput = document.querySelector('[data-kt-sms-table-filter="search"]');
        if (!searchInput) return;
        searchInput.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    const toggleToolbars = () => {
        const toolbarBase = document.querySelector('[data-kt-sms-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-kt-sms-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[data-kt-sms-table-select="selected_count"]');
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        let checkedState = false;
        let count = 0;

        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }
    }

    return {
        init: function () {
            table = document.querySelector('#kt_sms_table');

            if (!table) return;

            initSmsList();
            handleSearch();
        }
    }
}();

KTUtil.onDOMContentLoaded(function () {
    KTSmsList.init();
});
