var lazUrl = "https://www.lazada.vn/"; //-i1358457802.html
var toyProductsUrl = "https://toy1.phukiensh.com/lazop/products.php";
var toyProductUpdateUrl = "https://toy1.phukiensh.com/lazop/update_gui.php";

function copyToClipBoard(text) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}

function inject(){
    console.log("inject");
    $(".toy").remove();
    $(".next-table-row.product-header-row").each(function( index ) {
        var idNode = $(this).find('.copy-text').first();
        var itemId = idNode.text();
        
        // show lazada link
        var href = lazUrl + "-i" + itemId + ".html";
        var link = $('<a style="margin-left:5px" class="toy laz-link" href="' + href + '" target="_blank">URL</a>');
        idNode.parent().append(link);
        
        // show toy link
        href = toyProductsUrl + "?item_id=" + itemId;
        link = $('<a style="margin-left:5px" class="toy" href="' + href + '" target="_blank">Toy</a>');
        idNode.parent().append(link);
        
        // show update link
        var expandRow = $(this).next();
        expandRow.find('.copy-text').each(function(){
            skuNode = $(this);
            var sku = skuNode.text();
            href = toyProductUpdateUrl + "?item_id=" + itemId + "&sku=" + sku;
            link = $('<a class="toy" href="' + href + '" target="_blank">Update</a>');
            skuNode.parent().append(link);
        });
    });
}
