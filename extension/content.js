(function () {

  const $ = (selector, ctx = document) => [].slice.call(ctx.querySelectorAll(selector));

  document.addEventListener('DOMContentLoaded', () => {
    const elems = $('[lang="mermaid"]');
    elems.forEach(elem => {
      const codeElem = $('code', elem)[0];
      const code = codeElem.textContent;
      elem.insertAdjacentHTML('afterend', `<div class="mermaid">${code}</div>`);
      elem.style.display = 'none';
    });

    const elems = $('.language-mermaid');
    elems.forEach(elem => {
      const code = elem.textContent;
      elem.insertAdjacentHTML('afterend', `<div class="mermaid">${code}</div>`);
      elem.style.display = 'none';
    });

    window.mermaid.init();
  });

}());
