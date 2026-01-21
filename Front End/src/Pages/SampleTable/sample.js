import React, { useEffect } from "react";
import $ from "jquery";
import "./sample.css";
const FixedScrollbar = () => {
  const JqueryFunction = () => {
    $(function ($) {
      var scrollbar = $('<div id="fixed-scrollbar"><div></div></div>').appendTo(
        $(document.body)
      );
      scrollbar.hide().css({
        overflowX: "auto",
        position: "fixed",
        width: "100%",
        bottom: 0,
      });
      var fakecontent = scrollbar.find("div2");

      function top(e) {
        return e.offset().top;
      }

      function bottom(e) {
        return e.offset().top + e.height();
      }
      var active = $([]);
      function find_active() {
        scrollbar.show();
        var active = $([]);
        $(".fixed-scrollbar").each(function () {
          if (
            top($(this)) < top(scrollbar) &&
            bottom($(this)) > bottom(scrollbar)
          ) {
            fakecontent?.width($(this).get(0).scrollWidth);
            fakecontent.height(1);
            active = $(this);
          }
        });
        fit(active);
        return active;
      }
      function fit(active) {
        if (!active.length) return scrollbar.hide();
        scrollbar.css({ left: active.offset().left, width: active?.width() });
        fakecontent?.width($(this).get(0).scrollWidth);
        fakecontent.height(1);
        lastScroll = undefined;
      }

      function onscroll() {
        var oldactive = active;
        active = find_active();
        if (oldactive.not(active).length) {
          oldactive.off("scroll", update);
        }
        if (active.not(oldactive).length) {
          active.scroll(update);
        }
        update();
      }

      var lastScroll;
      function scroll() {
        if (!active.length) return;
        if (scrollbar.scrollLeft() === lastScroll) return;
        lastScroll = scrollbar.scrollLeft();
        active.scrollLeft(lastScroll);
      }

      function update() {
        if (!active.length) return;
        if (active.scrollLeft() === lastScroll) return;
        lastScroll = active.scrollLeft();
        scrollbar.scrollLeft(lastScroll);
      }

      scrollbar.on(scroll);

      onscroll();
      $(window).on("scroll", onscroll);
      $(window).on("resize", onscroll);
    });
  };
  useEffect(() => {
    JqueryFunction();
  }, []);
  return (
    <>
      some intro
      <div className="fixed-scrollbar">
        <pre className="div2">
          aaaa bbbb cccc dddd aaaa bbbb
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br /> cccc dddd aaaa bbbb cccc dddd aaaa bbbb cccc dddd aaaa bbbb
          cccc dddd aaaa bbbb cccc dddd aaaa bbbb cccc dddd 12123141 1231 1231
          23 12
        </pre>
      </div>
      outside of the world
      <div class="fixed-scrollbar">
        <pre class="div2">
          and a small one without need for scroll aaaa bbbb cccc dddd aaaa bbbb
          <br />
          <br />
          <br />
          <br /> cccc dddd aaaa bbbb cccc dddd aaaa bbbb cccc
        </pre>
      </div>
      lol
      <div className="fixed-scrollbar" style={{ margin: "20px" }}>
        <pre className="div2">
          {" "}
          and again! aaaa bbbb cccc dddd aaaa bbbb
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br /> cccc dddd aaaa bbbb cccc dddd aaaa bbbb cccc dddd aaaa bbbb
          cccc dddd aaaa bbbb cccc dddd aaaa bbbb cccc dddd 12123141 1231 1231
          23 12
        </pre>
      </div>
      and bye!
    </>
  );
};

export default FixedScrollbar;
