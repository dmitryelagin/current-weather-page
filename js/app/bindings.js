define(['jquery', 'knockout'], ($, ko) => {
  function makeFadingBinding(bindingHandler, speed = 300, baseOpacity) {
    return {
      init: bindingHandler.init,
      update(element, valueAccessor, ...args) {
        const $element = $(element);
        const opacity = $element.css('opacity');
        const $el = $element.clone()
            .css({
              opacity,
              position: 'absolute',
              left: `${$element.offset().left}px`,
              top: `${$element.offset().top}px`,
              width: `${$element.width()}px`,
              height: `${$element.height()}px`,
            })
            .insertBefore($element)
            .animate({ opacity: 0 }, speed, 'swing', () => { $el.remove(); });
        $element.stop().css({ opacity: 0 });
        bindingHandler.update(element, valueAccessor, ...args);
        $element.animate({ opacity: baseOpacity || opacity }, speed, 'swing');
      },
    };
  }

  return {
    fading(...cfg) {
      return {
        textFading: makeFadingBinding(ko.bindingHandlers.text, ...cfg),
        attrFading: makeFadingBinding(ko.bindingHandlers.attr, ...cfg),
      };
    },
  };
});
