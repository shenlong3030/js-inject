// ==UserScript==
// @name         Goofish viewed products
// @namespace    http://tampermonkey.net/
// @version      2025-07-21
// @description  try to take over the world!
// @author       You
// @match        https://www.goofish.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.com
// @grant        none
// ==/UserScript==

(function() {
    console.log("tampermonkey");

    'use strict';

    // --- CẤU HÌNH CHO TRANG WEB CỦA BẠN ---
    const PRODUCT_ID_REGEX = /id=(\d+)/; // Regex để trích xuất ID sản phẩm từ URL (ví dụ: id=123 -> 123)
    const PRODUCT_CARD_SELECTOR = '[class^="feeds-item-wrap"]'; // Selector CSS cho mỗi khung sản phẩm trên trang danh sách
    const PRODUCT_LINK_SELECTOR = '.product-link'; // Selector CSS cho thẻ <a> trong mỗi khung sản phẩm

    const VIEWED_PRODUCTS_STORAGE_KEY = 'viewedProducts'; // Tên key trong localStorage
    const VIEWED_CLASS = 'tampermonkey-viewed-product'; // Class CSS sẽ được thêm vào sản phẩm đã xem

    var reset = false; // Biến để kiểm tra nếu đã reset hay chưa

    // --- KHÔNG CẦN CHỈNH SỬA DƯỚI ĐÂY NẾU BẠN CHƯA BIẾT VỀ JS ---

    function getProductIdsFromLocalStorage() {
        try {
            const storedIds = localStorage.getItem(VIEWED_PRODUCTS_STORAGE_KEY);
            return storedIds ? new Set(JSON.parse(storedIds)) : new Set();
        } catch (e) {
            console.error('Error parsing viewed products from localStorage:', e);
            return new Set();
        }
    }

    function saveProductIdsToLocalStorage(idsSet) {
        try {
            localStorage.setItem(VIEWED_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(idsSet)));
        } catch (e) {
            console.error('Error saving viewed products to localStorage:', e);
        }
    }

    // Thêm hàm lưu và lấy note cho sản phẩm từ localStorage
    function getProductNotesFromLocalStorage() {
        try {
            const stored = localStorage.getItem('productNotes');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error parsing product notes from localStorage:', e);
            return {};
        }
    }
    function saveProductNotesToLocalStorage(notesObj) {
        try {
            localStorage.setItem('productNotes', JSON.stringify(notesObj));
        } catch (e) {
            console.error('Error saving product notes to localStorage:', e);
        }
    }

    // Hàm để xử lý khi một liên kết sản phẩm được click
    function handleProductClick(event) {
        const productLink = event.currentTarget; // Liên kết được click

        // Thêm class đánh dấu ngay lập tức vào khung sản phẩm
        productLink.classList.add(VIEWED_CLASS);
        console.log('Marked product card instantly');

        // Cho phép trình duyệt tiếp tục điều hướng đến trang sản phẩm
    }

    let observer; // Đặt biến observer ở ngoài để có thể truy cập trong hàm

    // Hàm kiểm tra và đánh dấu sản phẩm trên trang danh sách
    function markViewedProducts() {
        console.log("tampermonkey markViewedProducts");
        if (observer) observer.disconnect(); // Tạm dừng quan sát

        const viewedIds = getProductIdsFromLocalStorage();
        const productCards = document.querySelectorAll(PRODUCT_CARD_SELECTOR);
        const notesObj = getProductNotesFromLocalStorage();

        productCards.forEach(card => {
            //const productLink = card.querySelector(PRODUCT_LINK_SELECTOR);
            const productLink = card;
            if (productLink && productLink.href) {
                const match = productLink.href.match(PRODUCT_ID_REGEX);
                if (match && match[1]) {
                    const productId = match[1];
                    // Đánh dấu đã xem
                    if (viewedIds.has(productId)) {
                        card.classList.add(VIEWED_CLASS);
                    }
                    
                    // Hiển thị note nếu có
                    let noteDiv = card.querySelector('.tm-note');
                    if (!noteDiv) {
                        noteDiv = document.createElement('div');
                        noteDiv.className = 'tm-note';
                        noteDiv.style.position = 'absolute';
                        noteDiv.style.top = '0';
                        noteDiv.style.left = '0';
                        noteDiv.style.right = '0';
                        noteDiv.style.background = 'rgba(255,255,255,0.8)';
                        noteDiv.style.color = '#333';
                        noteDiv.style.fontSize = '13px';
                        noteDiv.style.padding = '2px 8px';
                        noteDiv.style.whiteSpace = 'nowrap';
                        noteDiv.style.overflow = 'hidden';
                        noteDiv.style.textOverflow = 'ellipsis';
                        noteDiv.style.zIndex = '11';
                        noteDiv.style.maxWidth = '100%';
                        noteDiv.style.borderRadius = '4px 4px 0 0';
                        noteDiv.style.display = 'none';
                        card.appendChild(noteDiv);
                    }
                    if (notesObj[productId]) {
                        noteDiv.textContent = notesObj[productId];
                        noteDiv.style.display = '';
                    } else {
                        noteDiv.textContent = '';
                        noteDiv.style.display = 'none';
                    }

                    // Thêm nút X nếu chưa có
                    if (!card.querySelector('.tm-note-btn')) {
                        const noteBtn = document.createElement('button');
                        noteBtn.textContent = '📝';
                        noteBtn.className = 'tm-note-btn';
                        noteBtn.style.position = 'absolute';
                        noteBtn.style.top = '5px';
                        noteBtn.style.right = '5px';
                        noteBtn.style.background = 'rgba(255,0,0,0.7)';
                        noteBtn.style.color = 'white';
                        noteBtn.style.border = 'none';
                        noteBtn.style.borderRadius = '50%';
                        noteBtn.style.width = '24px';
                        noteBtn.style.height = '24px';
                        noteBtn.style.cursor = 'pointer';
                        noteBtn.style.zIndex = '10';
                        noteBtn.title = 'Thêm/Sửa ghi chú cho sản phẩm';

                        noteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            // Hiện input nhập note
                            let input = card.querySelector('.tm-note-input');
                            if (!input) {
                                input = document.createElement('input');
                                input.type = 'text';
                                input.className = 'tm-note-input';
                                input.placeholder = 'Nhập ghi chú...';
                                input.style.position = 'absolute';
                                input.style.top = '30px';
                                input.style.left = '10px';
                                input.style.right = '40px';
                                input.style.zIndex = '12';
                                input.style.width = 'calc(100% - 50px)';
                                input.style.fontSize = '14px';
                                input.style.padding = '2px 8px';
                                input.style.border = '1px solid #aaa';
                                input.style.borderRadius = '4px';
                                input.style.background = '#fff';
                                card.appendChild(input);
                            }
                            input.value = notesObj[productId] || '';
                            input.style.display = '';

                            input.focus();

                            input.onblur = function() {
                                const note = input.value.trim();
                                if (note) {
                                    notesObj[productId] = note;
                                    noteDiv.textContent = note;
                                    noteDiv.style.display = '';
                                } else {
                                    delete notesObj[productId];
                                    noteDiv.textContent = '';
                                    noteDiv.style.display = 'none';
                                }
                                saveProductNotesToLocalStorage(notesObj);
                                input.style.display = 'none';
                            };

                            input.onkeydown = function(ev) {
                                if (ev.key === 'Enter') {
                                    input.blur();
                                }
                            };
                        });

                        // Đảm bảo card có position tương đối để nút đúng vị trí
                        if (getComputedStyle(card).position === 'static') {
                            card.style.position = 'relative';
                        }
                        card.appendChild(noteBtn);
                    }

                    // Thêm event listener cho mỗi liên kết sản phẩm
                    if (!productLink.dataset.tmClickListenerAdded) {
                        productLink.addEventListener('click', handleProductClick);
                        productLink.dataset.tmClickListenerAdded = 'true';
                    }
                }
            }
        });

        if (observer) observer.observe(document.body, { childList: true, subtree: true }); // Quan sát lại
    }

    // Hàm lưu ID sản phẩm khi xem trang chi tiết
    function recordViewedProduct() {
        const url = window.location.href;
        const match = url.match(PRODUCT_ID_REGEX);

        //console.log("tampermonkey recordViewedProduct");
        if (match && match[1]) {
            const productId = match[1];
            const viewedIds = getProductIdsFromLocalStorage();
            if (!viewedIds.has(productId)) {
                viewedIds.add(productId);
                saveProductIdsToLocalStorage(viewedIds);
                console.log(`Recorded viewed product: ${productId}`);
            }
        }
    }

    // Hàm chung để tạo một button và gán class
    function createButtonElement(text, className) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        return button;
    }

    // Function để tạo và thêm floating button
    function createFloatingMenu() {
        console.log(`floating-buttons-container creating`);
        // 1. Tạo container
        const container = document.createElement('div');
        container.className = 'floating-buttons-container';

        // 2. Tạo Button 1
        const button1 = createButtonElement('Sort name', 'js-btn-sort-name');
        button1.addEventListener('click', () => {
            const elements = Array.from(document.querySelectorAll('div[class^="cardWarp"]'));

            elements.sort((a, b) => {
                const textA = a.innerText.trim().toLowerCase();
                const textB = b.innerText.trim().toLowerCase();
                if (textA < textB) return -1;
                if (textA > textB) return 1;
                return 0;
            });

            const parent = elements[0].parentElement;
            if (parent) {
                elements.forEach(element => {
                    parent.appendChild(element);
                });
            }

            console.log(`Successfully sorted name`);
        });
        container.appendChild(button1); // Thêm button vào container

        // 3. Tạo Button 2
        const button2 = createButtonElement('Sort price', 'js-btn-sort-price');
        button2.addEventListener('click', () => {
            const elements = Array.from(document.querySelectorAll('div[class^="cardWarp"]'));
            const elementsWithPrice = elements.map(element => {
                const priceElement = element.querySelector('[class^="number"]');
                const price = priceElement ? parseFloat(priceElement.innerText) : 0; // Assume 0 if price not found
                return { element, price };
            });

            elementsWithPrice.sort((a, b) => a.price - b.price);

            const parentElement = elements[0].parentElement;
            if (parentElement) {
                elementsWithPrice.forEach(({ element }) => {
                    parentElement.appendChild(element);
                });
            }

            console.log(`Successfully sorted price`);
        });
        container.appendChild(button2); // Thêm button vào container

        // Tạo Button 3
        const button3 = createButtonElement('Hide GRate', 'js-btn-hide-gr');
        button3.addEventListener('click', () => {
            const elementsToHide = Array.from(document.querySelectorAll('[class^="rateItem"]' ));
            const elementsWithGoodRateImg = elementsToHide.filter(element => element.querySelector('img[class^="goodRate"]'));

            for (const element of elementsWithGoodRateImg) {
                element.style.display = 'none';
            }

            const data = {
                hiddenCount: elementsWithGoodRateImg.length
            };
            console.log(`Successfully Hide GRate`);
        });
        container.appendChild(button3); // Thêm button vào container

        // --- Thêm input filter ---
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = 'Filter by name...';
        filterInput.className = 'js-input-filter';
        filterInput.style.padding = '8px';
        filterInput.style.fontSize = '15px';
        filterInput.style.borderRadius = '4px 8px 8px 4px';
        filterInput.style.border = '1px solid #ccc';
        filterInput.style.marginBottom = '5px';
        container.appendChild(filterInput);

        // --- Button Filter ---
        const filterBtn = createButtonElement('Filter', 'js-btn-filter');
        filterBtn.addEventListener('click', () => {
            const keyword = filterInput.value.trim().toLowerCase();
            const elements = Array.from(document.querySelectorAll('div[class^="cardWarp"]'));
            elements.forEach(element => {
                const text = element.innerText.trim().toLowerCase();
                element.style.display = keyword && !text.includes(keyword) ? 'none' : '';
            });
            console.log(`Filtered by: ${keyword}`);
        });
        container.appendChild(filterBtn);

        // --- Button Reset ---
        const resetBtn = createButtonElement('Reset', 'js-btn-reset');
        resetBtn.addEventListener('click', () => {
            reset = true
            filterInput.value = '';
            const elements = Array.from(document.querySelectorAll('div[class^="cardWarp"]'));
            elements.forEach(element => {
                element.style.display = '';
            });
            console.log(`Reset filter`);
        });
        container.appendChild(resetBtn);

        // --- Thêm button Auto Scroll ---
        const autoScrollBtn = createButtonElement('Auto Scroll', 'js-btn-auto-scroll');
        autoScrollBtn.addEventListener('click', () => {
            reset = false;
            function scrollStep() {
                const before = window.scrollY;
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                setTimeout(() => {
                    const after = window.scrollY;
                    // Nếu không cuộn được nữa (vị trí không thay đổi), dừng lại
                    if (after === before || reset) {
                        console.log('Auto scroll stopped (reached bottom or reset)');
                        return;
                    }
                    scrollStep();
                }, 1200); // Đợi cho cuộn mượt xong
            }
            scrollStep();
            console.log('Auto scroll started');
        });
        container.appendChild(autoScrollBtn);

        // 4. Thêm CSS Styles (chỉ gọi một lần)

        // 5. Thêm container vào body của tài liệu
        document.body.appendChild(container);

        console.log(`floating-buttons-container created`);
    }

    // Chạy các hàm tương ứng tùy thuộc vào loại trang
    // kiểm tra: window.location.search
    // hoặc: window.location.href
    if (window.location.search.match(PRODUCT_ID_REGEX)) {
        // Đây là trang chi tiết sản phẩm
        recordViewedProduct();
    } else {
        observer = new MutationObserver(markViewedProducts);
        observer.observe(document.body, { childList: true, subtree: true });
        markViewedProducts(); // Chạy lần đầu khi DOM đã có

        setTimeout(() => {
            createFloatingMenu();
        }, 1000);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .${VIEWED_CLASS} {
            opacity: 0.5 !important;
            border: 2px solid purple !important;
            box-shadow: 0 0 5px 2px rgba(128, 0, 128, 0.5) !important;
        }
        .${VIEWED_CLASS}:hover {
            opacity: 1.0 !important;
        }
        .floating-buttons-container {
            position: fixed; /* Giữ container cố định trên màn hình */
            right: 0;          /* Nằm sát lề trái */
            top: 50%;         /* Căn giữa theo chiều dọc */
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
            padding: 15px 20px;
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

        .tm-note {
            pointer-events: none;
            text-align: center; /* căn giữa text */
        }
        .tm-note-input {
            box-sizing: border-box;
        }

        .tm-note-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255,0,0,0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            z-index: 10;
            font-size: 16px;
            line-height: 24px;
            text-align: center;
            padding: 0;
            transition: background 0.2s;
        }
        .tm-note-btn:hover {
            background: rgba(255,0,0,1);
        }
    `;
    document.head.appendChild(style);
})();
