define(['jquery', 'knockout'], ($, ko) => ({
  textTransition(speed = 300, baseOpacity) {
    return {
      init() {
        return { controlsDescendantBindings: true };
      },
      update(element, valueAccessor) {
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
        ko.utils.setTextContent(element, valueAccessor());
        $element.animate({ opacity: baseOpacity || opacity }, speed, 'swing');
      },
    };
  },
}));
