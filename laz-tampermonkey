// ==UserScript==
// @name         LAZADA
// @namespace    http://tampermonkey.net/
// @version      2025-08-04
// @description  try to take over the world!
// @author       You
// @match        *://sellercenter.lazada.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lazada.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("tampermonkey");

    // =================== BLOCK CÁC HÀM TẠO CSS ===================
    let style = document.createElement('style');
    style.textContent = `
        .floating-buttons-container {
            position: fixed; /* Giữ container cố định trên màn hình */
            left: 0;          /* Nằm sát lề trái */
            bottom: 10%;         /* Căn giữa theo chiều dọc */
            transform: translateY(-50%); /* Dịch chuyển để tâm container nằm giữa */
            z-index: 1000;    /* Đảm bảo container hiển thị trên các nội dung khác */
            display: flex;    /* Sử dụng Flexbox để xếp các button con */
            flex-direction: column; /* Xếp các button con theo cột (từ trên xuống) */
            gap: 10px;        /* Khoảng cách giữa các button con (ví dụ 10px) */
            padding: 5px;     /* Đệm nhẹ cho container nếu cần */
            /* background-color: rgba(0,0,0,0.1); /* Tùy chọn: màu nền cho container để dễ nhìn */
        }

        /* CSS chung cho tất cả các button bên trong container */
        .floating-buttons-container button {
            background-color: #007bff;
            color: white;
            padding: 5px 5px;
            border: none;
            border-radius: 0 8px 8px 0; /* Bo tròn góc phải cho các button con */
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
        }

        .floating-buttons-container button:hover {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(style);
    // =================== KẾT THÚC BLOCK CÁC HÀM TẠO CSS ===================

    // =================== BLOCK CÁC HÀM TẠO THÊM BUTTON================

    // Hàm chung để tạo một button và gán class
    function createButtonElement(text, className) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        return button;
    }

    // Function để tạo và thêm floating button
    function createFloatingButton() {
        console.log(`floating-buttons-container creating`);
        // 1. Tạo container
        const container = document.createElement('div');
        container.className = 'floating-buttons-container';

        // 2. Tạo Button 1
        const button1 = createButtonElement('Chọn đơn không tô màu', 'js-btn');
        button1.addEventListener('click', () => {
            console.log(`Tìm và chọn đơn không tô màu`);

            // Chọn tất cả checkbox trong .list-toolbar-head
            document.querySelectorAll('.list-toolbar-head input[type="checkbox"]').forEach(cb => cb.click());

            const flagList = {};
            // Chọn các đơn highlighted lần nữa để bỏ chọn
            setTimeout(function() {
                document.querySelectorAll('.chrome-extension-highlight').forEach(highlighted => {
                    console.log("tìm thấy highlighted");
                    const cbContainer = highlighted.closest('.list-item');
                    const header = cbContainer.querySelector('.list-item-header');
                    const orderNumber = highlighted.textContent;
                    console.log(orderNumber);
                    if (!flagList[orderNumber]) { // only click once every order row
                        const cb = header.querySelector('input[type="checkbox"]');
                        if (cb) cb.click();
                        flagList[orderNumber] = 1;
                    }
                });
            }, 500);
        });
        container.appendChild(button1); // Thêm button vào container

        // 3. Tạo Button 2
        const button2 = createButtonElement('Sort price', 'js-btn-sort-price');
        button2.addEventListener('click', () => {
            console.log(`Successfully sorted price`);
        });
        //container.appendChild(button2); // Thêm button vào container

        // Tạo Button 3
        const button3 = createButtonElement('Hide GRate', 'js-btn-hide-gr');
        button3.addEventListener('click', () => {

        });
        //container.appendChild(button3); // Thêm button vào container

        // 4. Thêm CSS Styles (chỉ gọi một lần)
        // 5. Thêm container vào body của tài liệu
        document.body.appendChild(container);

        console.log(`floating-buttons-container created`);
    }

    var urlregex = /order\/list/i;
    if(urlregex.test(window.location.href)) {
        setTimeout(createFloatingButton, 2000);
        return;
    }
    // =================== KẾT THÚC BLOCK CÁC HÀM TẠO THÊM BUTTON================

    // =================== BLOCK INJECT TOY VÀO DANH SÁCH SP CSS ===================
    function injectToys(canDel = 0) {
        console.log("inject toys");

        let toyProductUpdateUrl = "https://toy1.phukiensh.com/lazop/update_gui.php";
        // Xóa các phần tử có class "toy"
        document.querySelectorAll('.toy').forEach(el => el.remove());

        // Tìm các link "Chỉnh sửa", extract itemID
        document.querySelectorAll("a[data-spm='d_action_edit']").forEach(link => {
            const href = link.getAttribute('href');
            const words = href.split('productId=');
            const itemId = words[words.length - 1];
            const productNode = link.closest("tr");
            if (productNode) {
                productNode.setAttribute("item_id", itemId);
                const nextNode = productNode.nextElementSibling;
                if (nextNode && nextNode.classList.contains("next-table-expanded-row")) {
                    nextNode.querySelectorAll("tr").forEach(tr => {
                        tr.setAttribute("item_id", itemId);
                    });
                }
            }
        });

        // Tìm SKU node, extract SKU
        document.querySelectorAll("span.item-id .safe-html-text.high-light-word").forEach(span => {
            const rowNode = span.closest("tr");
            if (!rowNode) return;
            const priceCell = rowNode.querySelector("td[data-next-table-col='2'] div");
            const qtyCell = rowNode.querySelector("td[data-next-table-col='3'] div");
            const itemId = rowNode.getAttribute("item_id");
            const sku = span.textContent.trim();
            const href = toyProductUpdateUrl + `?sku=${sku}~~${itemId}`;
            const ulink = document.createElement('a');
            ulink.className = "toy";
            ulink.href = href;
            ulink.target = "_blank";
            ulink.textContent = "Update";
            if (priceCell) priceCell.appendChild(ulink);

            //## can not change qty and delete product anymore because the API need SKUid, but we don't have it
        });
    }

    // Kiểm tra xem có phải trang danh sách sản phẩm không
    // Nếu có thì gọi hàm injectToys sau 3 giây
    urlregex = /product\/list/i;
    if(urlregex.test(window.location.href)) {
        console.log("detected products page");
        setTimeout(injectToys, 3000);
        return;
    }

    // =================== KẾT THÚC BLOCK INJECT TOY VÀO DANH SÁCH SP CSS ===================


    // =================== BLOCK CÁC HÀM XỬ LÝ TRANG PICKLIST================

    // Hàm để sắp xếp bảng in
    // Chỉ chạy khi trang in được phát hiện
    function sortPickListPrintPage() {
        console.log("sortPickListPrintPage");

        const shadowRoot = document.querySelector(".la-print-page").shadowRoot;
        // var sheet = new CSSStyleSheet();
        // sheet.replaceSync('.la-print-page { width: auto !important; }');
        // sheet.insertRule('.print-pick-list { width: auto !important; }');
        // //sheet.insertRule('.la-print-page th:nth-child(3) { min-width: 500px!important; }');
        // shadowRoot.adoptedStyleSheets = [sheet];

        let style = document.createElement('style');
        style.textContent = `
            .la-print-page { width: 90%; }
            .print-pick-list { width: auto; }
        `;
        document.head.appendChild(style.cloneNode(true));
        shadowRoot.appendChild(style.cloneNode(true));

        var table = shadowRoot.querySelector("table");
        if (!table) {
            console.log("Table not found");
            return;
        }

        var rows = Array.from(table.querySelectorAll("tbody tr"));

        // Xử lý text trong các ô của bảng
        rows.forEach(row => {
            Array.from(row.querySelectorAll("td")).forEach(td => {
                td.innerHTML = td.innerHTML
                    .replace('Ốp lưng', 'Ốp')
                    .replace('[HCM]', '')
                    .replace(/Nhóm Màu:([^,-]+)/, '<br>Màu:<font color="red">$1</font>')
                    .replace(/Dòng sản phẩm tương thích:([^,-]+)/, '<br>Dòng:<font color="red">$1</font>')
                    .replace(/(chống sốc)/, '<font color="red">$1</font>');
            });
        });

        rows.sort((a, b) => {
            // Sắp xêp theo cột thứ 3 (thứ tự bắt đầu từ 1)
            // Adjust the index if you want to sort by a different column
            var aText = a.querySelector("td:nth-child(3)").textContent.trim();
            var bText = b.querySelector("td:nth-child(3)").textContent.trim();
            return aText.localeCompare(bText);
        });
        rows.forEach(row => table.querySelector("tbody").appendChild(row));
    }

    // Kiểm tra xem có phải trang in không
    // Nếu có thì gọi hàm sortPickListPrintPage sau 3 giây
    urlregex = /order\/print/i;
    if(urlregex.test(window.location.href)) {
        console.log("detected print page");
        setTimeout(sortPickListPrintPage, 3000);
        return;
    }
    // =================== KẾT THÚC BLOCK CÁC HÀM TIỆN ÍCH ===================



})();
