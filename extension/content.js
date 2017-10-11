(function () {

  const $ = (selector, ctx = document) => [].slice.call(ctx.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', () => {
    let elems = $('[lang="mermaid"]');

    const replaceChart = (codeElem) => {
      const code = codeElem.textContent;
      elem.insertAdjacentHTML('afterend', `<div class="mermaid">${code}</div>`);
      elem.style.display = 'none';
    };

    elems.forEach(elem => {
      const codeElem = $('code', elem)[0];
      replaceChart(codeElem);
    });

    elems = $('.language-mermaid');
    elems.forEach(elem => {
      replaceChart(elem);
    });

    window.mermaid.init();
  });

}());
