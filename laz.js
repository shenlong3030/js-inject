//console.log("3");
var lazUrl = "https://www.lazada.vn/"; //-i1358457802.html
var toyProductsUrl = "https://toy1.phukiensh.com/lazop/products.php";
var toyProductUpdateUrl = "https://toy1.phukiensh.com/lazop/update_gui.php";
var toyProductDel = "https://toy1.phukiensh.com/lazop/del.php";

function copyToClipBoard(text) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

function injectToys(canDel = 0) {
    console.log("inject toys");
    $(".toy").remove();
    $("a[data-spm='d_action_edit']").each(function(index) {
        var words = $(this).attr('href').split('productId=');
        var itemId = words[words.length - 1];
        var productNode = $(this).closest("tr");

        var editStockDiv = productNode.find("div.edit-stock").first();
        var lazLink = productNode.find("a.item-detail-name").first();
        if (lazLink.length === 0) { //inactive product
            var href = toyProductUpdateUrl + "?item_id=" + itemId;
            var alink = $('<a class="toy" href="' + href + '" target="_blank">Reactivate</a>');
            alink.appendTo(editStockDiv);
        }
    });

    $("span.copy-item").each(function() {
        words = $(this).text().trim().split('Seller Sku:');;
        var sku = words[words.length - 1].trim();
        var href = toyProductUpdateUrl + "?sku=" + sku;
        var ulink = $('<a class="toy" href="' + href + '" target="_blank">Update</a>');
        ulink.appendTo($(this));
        if (canDel) {
            var href = toyProductDel + "?skus=" + sku;
            var dlink = $('<a class="toy" href="' + href + '" target="_blank">&nbsp;DEL</a>');
            dlink.appendTo($(this));
        }
    });
}

setTimeout(function() {
    setTimeout(injectToys(), 2000);

    var body = $("body");
    var container = $('<div class="dialog"></div>');
    container.prependTo(body);
    container.dialog({
        position: { my: "left bottom", at: "left bottom" }
    });

    var btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Inject toys"/>');
    btn.appendTo(container);
    btn.click(function() {
        injectToys();
    });

    // show button copy URL
    var btn1 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Copy URLs"/>');
    btn1.appendTo(container);
    btn1.click(function() {
        var text = "";
        $(".laz-link").each(function() {
            text = text + $(this).attr('href') + "\n";
        });
        console.log("copy text : " + text);
        copyToClipBoard(text);
    });

    // show button DEL
    var btn11 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="DEL"/>');
    btn11.appendTo(container);
    btn11.click(function() {
        injectToys(1);
    });

    var btn2 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Hiện 50"/>');
    btn2.appendTo(container);
    btn2.click(function() {
        $('span[data-spm="d_order_table_pagination"]').click();
        $('p[data-spm="d_order_table_pagination_50"]').click();
    });

    var btn3_1 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Chọn các đơn hàng không tô màu"/>');
    btn3_1.appendTo(container);
    btn3_1.click(function() {
        // select all
        $('.next-table-header input[data-spm="d_table_checkall"]').click();

        // unselect highlighted
        setTimeout(function() {
            var checkList = [];
            $(".chrome-extension-highlight").each(function() {
                var cbContainer = $(this).closest(".order-sub-table");
                var cbContainerId = cbContainer.attr("data-spm");
                if (!checkList.includes(cbContainerId)) {
                    console.log(cbContainerId);
                    checkList.push(cbContainerId);

                    var cb = cbContainer.find("input[type=checkbox]:first");
                    cb.click();
                }
            });
        }, 2000);
    });

    // button print MaVanChuyen
    var btn4 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In mã vận chuyển"/>');
    btn4.appendTo(container);
    btn4.click(function() {
        $('.toolbar-container button[data-spm="d_print_module"]').click();
        $('li[title="In mã vận chuyển"]').click();
    });

    // button print HoaDon
    var btn5 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In hóa đơn"/>');
    btn5.appendTo(container);
    btn5.click(function() {
        $('.toolbar-container button[data-spm="d_print_module"]').click();
        $('li[title="In hóa đơn"]').click();
    });

    // button print DanhSachSP
    var btn6 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In danh sách SP"/>');
    btn6.appendTo(container);
    btn6.click(function() {
        $('.toolbar-container button[data-spm="d_print_module"]').click();
        $('li[title="In danh sách sản phẩm được chọn"]').click();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // tablesorter for picklist
    var config = {
        childList: true,
        subtree: true
    };
    var callbackTimer1 = null;
    var callbackTimer2 = null;

    var observer = new MutationObserver(function(mutationRecords) {
        // view all record className
        // mutationRecords.forEach(function(record) {
        //    console.log(record.target.className);
        // });
        mutationRecords.some(function(record) {
            // when print product list
            if ($(record.target).hasClass("la-print-scroll")) {
                // if many changes occur continuously, 
                // only handle the last change
                if (callbackTimer1) {
                    clearTimeout(callbackTimer1);
                }
                callbackTimer1 = setTimeout(function() {
                    $('.print-pick-list table tbody td').html(function(index, html) {
                        return html.replace('Ốp lưng', 'Ốp') // xóa chữ 'lưng' trong tên SP
                            .replace('[HCM]', '') // xóa [HCM] trong tên SP
                            .replace(/Nhóm Màu:([^,.-]+)/, 'Màu:<strong>$1</strong>')
                            .replace(/Dòng sản phẩm tương thích:([^,.-]+)/, 'Dòng:<strong>$1</strong>');

                    });
                    $(".print-pick-list table").tablesorter();
                }, 1000);
                return true; // break loop
            }

            // when product list change
            // detect changes from div.next-card-free
            if ($(record.target).hasClass("next-card-free")) {
                if (callbackTimer2) {
                    clearTimeout(callbackTimer2);
                }
                callbackTimer2 = setTimeout(injectToys(), 2000);
                return true; // break loop
            }

        });
    });
    observer.observe(document.body, config);
}, 2000);
