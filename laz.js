// https://www.toptal.com/developers/javascript-minifier/

//console.log("3");
var lazUrl = "https://www.lazada.vn/"; //-i1358457802.html
var toyProductsUrl = "https://toy1.phukiensh.com/lazop/products.php";
var toyProductUpdateUrl = "https://toy1.phukiensh.com/lazop/update_gui.php";
var toyProductDel = "https://toy1.phukiensh.com/lazop/del.php";
var toyProductUpdateApiUrl = "https://toy1.phukiensh.com/lazop/update-api.php";

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
    
    // link "Chỉnh Sửa" iterator, extract itemID
    $("a[data-spm='d_action_edit']").each(function(index) {
        var words = $(this).attr('href').split('productId=');
        var itemId = words[words.length - 1];
        var productNode = $(this).closest("tr");

        var editStockDiv = productNode.find("div.edit-stock").first();
        var lazLink = productNode.find("a.item-detail-name").first();
        if (lazLink.length === 0) { //inactive product
            var href = toyProductUpdateApiUrl + "?item_id=" + itemId;
            var alink = $('<a class="toy" href="' + href + '" target="_blank">Reactivate</a>');
            alink.appendTo(editStockDiv);
        }
    });
    
    // SKU node iterator, extract SKU
    $("span.item-id .safe-html-text.high-light-word").each(function() {
        var rowNode = $(this).closest("tr");
        var priceCell = rowNode.find("td[data-next-table-col=2] div").first();
        var qtyCell = rowNode.find("td[data-next-table-col=3] div").first();
        
        var sku = $(this).text().trim();
        var href = toyProductUpdateUrl + "?sku=" + sku;
        var ulink = $('<a class="toy" href="' + href + '" target="_blank">Update</a>');
        ulink.appendTo(priceCell);
        
        var currentQty = qtyCell.text() + 0;
        if(currentQty.includes("H") || currentQty < 100 ) {
            var href = toyProductUpdateApiUrl + "?sku=" + sku + "&qty=500&action=qty";
            var qty500Link = $('<a class="toy" href="' + href + '" target="_blank">+500</a>');
            $('<br>').appendTo(qtyCell);
            qty500Link.appendTo(qtyCell);
        }
        if(currentQty > 0) {
            var href = toyProductUpdateApiUrl + "?sku=" + sku + "&qty=0&action=qty";
            var qty0Link = $('<a class="toy" href="' + href + '" target="_blank">=0</a>');
            $('<br>').appendTo(qtyCell);
            qty0Link.appendTo(qtyCell);
        }
        
        if (canDel) {
            var href = toyProductDel + "?skus=" + sku;
            var dlink = $('<a class="toy" href="' + href + '" target="_blank">&nbsp;DEL</a>');
            dlink.appendTo(priceCell);
        }
    });
}

function expandSKUs(){
    // show all SKUs
    $("button[data-spm=d_sku_expand]").click();    
}

setTimeout(function() {
    injectToys();
    
    var body = $("body");
    var container = $('<div class="dialog"></div>');

    var btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Inject toys"/>');
    btn.appendTo(container);
    btn.click(function() {
        injectToys();
    });
    
    btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Expand SKUs"/>');
    btn.appendTo(container);
    btn.click(function() {
        expandSKUs();
    });
    
    btn = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Copy ID sản phẩm"/>');
    btn.appendTo(container);
    btn.click(function() {
        let txt = $(".order-field-order-line-id .order-field-value").append(",").text();
        copyToClipBoard(txt);
        alert(txt);
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

    var btn2 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Hiện tất cả"/>');
    btn2.appendTo(container);
    btn2.click(function() {
        $('span.next-pagination-size-selector-dropdown').click();
        setTimeout(function(){
            $('.next-overlay-wrapper.opened li:last-child').click();
        },100);
    });

    var btn3_1 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="Chọn các đơn hàng không tô màu"/>');
    btn3_1.appendTo(container);
    btn3_1.click(function() {
        // select all
        console.log("select orders");
        $('.list-toolbar-head input[type="checkbox"]').click();

        var flagList = [];
        // unselect highlighted
        setTimeout(function() {
            console.log("unselect highlighted");
            $(".chrome-extension-highlight").each(function() {
                var cbContainer = $(this).closest(".list-item");
                var header = cbContainer.find(".list-item-header");
                var orderNumber = header.find(".order-field-value").text();
                
                if(!flagList[orderNumber]) { // only click once every order row
                    var cb = header.find("input[type=checkbox]:first");
                    cb.click();
                    flagList[orderNumber] = 1;
                }
            });
        }, 500);
    });

    // button print MaVanChuyen
    var btn4 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In mã vận chuyển"/>');
    btn4.appendTo(container);
    btn4.click(function() {
        $('.order-toolbar-actions-left button[data-spm^="d_button_batch_print"]').click();
    });

    // button print HoaDon
    var btn5 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In hóa đơn"/>');
    btn5.appendTo(container);
    btn5.click(function() {
        $('.order-toolbar-actions-left button.next-split-btn-trigger').click();
        setTimeout(function() {
            $('.next-overlay-wrapper.opened li[title="In hóa đơn"]').click();
        }, 200);
    });

    // button print DanhSachSP
    var btn6 = $('<input class="ui-button ui-widget ui-corner-all" type="button" value="In danh sách SP"/>');
    btn6.appendTo(container);
    btn6.click(function() {
        $('.order-toolbar-actions-left button.next-split-btn-trigger').click();
        setTimeout(function() {
            $('.next-overlay-wrapper.opened li[title="In danh sách chọn"]').click();
        }, 200);
    });

    
    if(window.location.href.includes("print")) {
        //do nothing
    } else {
        container.prependTo(body);
        container.dialog({
            position: { my: "left bottom", at: "left bottom", width: 270}
        });
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // tablesorter for picklist
    var config = {
        childList: true,
        subtree: true
    };
    var callbackTimer1 = null;
    var callbackTimer2 = null;

    var observer = new MutationObserver(function(mutationRecords) {
        //view all record className
        // mutationRecords.forEach(function(record) {
        //    console.log(record.target.className);
        // });
        mutationRecords.some(function(record) {
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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // handle printing pick list
    if(window.location.href.includes("print")) {
        var shadowRoot = $(".la-print-page")[0].shadowRoot;
        var tb = shadowRoot.querySelector('.print-pick-list table');

        // convert DOM tb to jquery $(tb)
        $(tb).find('td').html(function(index, html) {
            return html.replace('Ốp lưng', 'Ốp') // xóa chữ 'lưng' trong tên SP
                .replace('[HCM]', '') // xóa [HCM] trong tên SP
                .replace(/Nhóm Màu:([^,-]+)/, '<br>Màu:<font color="red">$1</font>')
                .replace(/Dòng sản phẩm tương thích:([^,-]+)/, '<br>Dòng:<font color="red">$1</font>')
                .replace(/(chống sốc)/, '<font color="red">$1</font>');

        });
        $(tb).tablesorter();
    }
}, 4000);

