(function () {

  const $ = (selector, ctx = document) => [].slice.call(ctx.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', () => {
    let elems = $('[lang="mermaid"]');

    const replaceChart = (elem, code) => {
      elem.insertAdjacentHTML('afterend', `<div class="mermaid">${code}</div>`);
      elem.style.display = 'none';
    };

    elems.forEach(elem => {
      const codeElem = $('code', elem)[0];
      const code = codeElem.textContent;
      replaceChart(elem, code);
    });

    elems = $('.language-mermaid');
    elems.forEach(elem => {
      const code = elem.textContent;
      replaceChart(elem, code);
    });

    window.mermaid.init();
  });

}());
