(function () {

  const $ = (selector, ctx = document) => [].slice.call(ctx.querySelectorAll(selector));

  function setupChart(elem, code) {
    var source_name = elem.id;

    if (elem.id == "") {
      const postfix = Math.random().toString(36).substr(2, 9);
      source_name = 'idname_' + postfix;
      elem.id = source_name;
    }

    var mermaid_name = 'mermaid_' + source_name;
    let existingDiagrams = $(`#${mermaid_name}`);
    if (existingDiagrams.length > 0) {
      existingDiagram = existingDiagrams[0];
      existingDiagram.innerHTML = code;
    } else {
      // Create the element that will house the rendered diagram.
      elem.insertAdjacentHTML('afterend', `<div class="mermaid" id="${mermaid_name}">${code}</div>`);
      elem.style.display = 'none';
      existingDiagram = $(`#${mermaid_name}`)[0];

      // Create an observer to track changes to the diagram code.
      const observer = new MutationObserver(() => { processElement(elem) });
      observer.observe(elem, { characterData: true });
    }

    try {
      // Generate or regenerate diagram if it is existing.
      window.mermaid.init([existingDiagram]);
    }
    catch(error) {
        existingDiagram.style.display = 'none';
        elem.style.display = 'block';
    }
  };

  function processElement(elem) {
    if (elem.attributes["lang"] !== null && elem.attributes['lang'] !== undefined) {
      const codeElem = $('code', elem)[0];
      const code = codeElem.textContent;
      setupChart(elem, code);
    } else {
      const code = elem.textContent;
      setupChart(elem, code);
    }
  };

  function onElementInsert(event){
    // We are only interested in the diagrams that trigger the css animation
    // called "mermaidDiagramCodeInserted". This is determined by the file
    // "on_change_animations.css".
    if (event.animationName !== "mermaidDiagramCodeInserted") {
      return
    }
    processElement(event.target);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Github
    $('[lang="mermaid"]').forEach(processElement);
    $('.language-mermaid').forEach(processElement);

    // Bitbucket
    $('.codehilite.language-mermaid').forEach(processElement);

    // This catches diagrams that are added to the page after it is loaded.
    // This might include comments from other users.
    document.addEventListener("animationstart", onElementInsert, false);
  });

}());
