//= require jquery-lightbox/js/baguetteBox.min
//= require jquery-lightbox/js/highlight.min

function lightboxInit() {
    baguetteBox.run('.img-gallery', {
        onChange: function() {
        },
        filter: /(.*)/
    });
}

if (!$.dataUpdatedCBs) $.dataUpdatedCBs = {};
$.dataUpdatedCBs.lightboxInit = lightboxInit;

$(function() {
    lightboxInit();
})
