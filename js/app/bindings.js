define(['jquery', 'knockout'], ($, ko) => ({
  // Existing bindings modifiers
  Fading: function FadingBinding(binding, speed = 300, baseOpacity) {
    const bindingHandler = ko.bindingHandlers[binding] || binding;
    return {
      init: bindingHandler.init,
      update(element, ...args) {
        const $element = $(element);
        const opacity = $element.css('opacity');
        $element.clone()
            .css({
              opacity,
              position: 'absolute',
              left: `${$element.offset().left}px`,
              top: `${$element.offset().top}px`,
              width: `${$element.width()}px`,
              height: `${$element.height()}px`,
            })
            .insertBefore($element)
            .animate({ opacity: 0 }, speed, 'swing', function removeElement() {
              $(this).remove();
            });
        $element.stop().css({ opacity: 0 });
        bindingHandler.update(element, ...args);
        $element.animate({ opacity: baseOpacity || opacity }, speed, 'swing');
      },
    };
  },
}));
