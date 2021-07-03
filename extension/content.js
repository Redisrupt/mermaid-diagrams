(function () {

  const $ = (selector, ctx = document) => [].slice.call(ctx.querySelectorAll(selector));
  let parentElementSelectors = [];
  let childElementSelector = '';
  let diagramRegex = /(.+)/s;

  if (/github\.com/i.test(window.location.href)) {
    parentElementSelectors = ['[lang="mermaid"]', '.language-mermaid'];
    childElementSelector = 'code';
  }

  if (/dev\.azure\.com/i.test(window.location.href)) {
    parentElementSelectors = ['div.markdown-editor-preview.markdown-content>pre.hljs'];
    childElementSelector = 'code';
    diagramRegex = /^\s*:::\s+mermaid\s+(.*):::\s*$/s;
  }

  if (/bitbucket\.org/i.test(window.location.href)) {

  }

  function setupChart(elem, code) {
    const diagramRegexMatch = diagramRegex.exec(code);
    if (diagramRegexMatch === null) {
      return;
    }

    code = diagramRegexMatch[1];

    var source_name = elem.id;

    if (elem.id == "") {
      const postfix = Math.random().toString(36).substr(2, 9);
      source_name = 'idname_' + postfix;
      elem.id = source_name;
    }

    var mermaid_name = 'mermaid_' + source_name;
    let existingDiagrams = $(`#${mermaid_name}`);
    if (existingDiagrams.length > 0) {
      console.log('Reuse existing diagram');
      existingDiagram = existingDiagrams[0];
      // existingDiagram.innerHTML = code;
    } else {
      console.log('Use new diagram');
      // Create the element that will house the rendered diagram.
      console.log('Code is ', code);
      elem.insertAdjacentHTML('afterend', `<div class="mermaid" id="${mermaid_name}">${code}</div>`);
      existingDiagram = $(`#${mermaid_name}`)[0];

      // Create an observer to track changes to the diagram code.
      const observer = new MutationObserver(() => {
        console.log('Mutated element', elem);
        processElement(elem);
      });
      observer.observe(elem, { characterData: true });
    }

    try {
      // Generate or regenerate diagram if it is existing.
      window.mermaid.render(elem.id, code, () => {
        console.log('>> done with ', elem.id);
      });
    }
    catch (error) {
      console.error('>>> mermaid error', error);
      console.error('Code', code);
    }
  };

  function processElement(elem) {
    console.log('processElement', elem);
    console.log('childElementSelector', childElementSelector);
    const childElements = $(childElementSelector, elem);
    for (const childElement of childElements) {
      setupChart(elem, childElement.innerText);
    }
  }

  function onElementInsert(event) {
    // We are only interested in the diagrams that trigger the css animation
    // called "mermaidDiagramCodeInserted". This is determined by the file
    // "on_change_animations.css".
    if (event.animationName !== "mermaidDiagramCodeInserted") {
      return
    }
    console.log('onElementInsert', event.target);
    processElement(event.target);
  }

  document.addEventListener('DOMContentLoaded', () => {
    for (const parentElementSelector of parentElementSelectors) {
      $(parentElementSelector).forEach(processElement);
    }

    // Bitbucket
    //$('.codehilite.language-mermaid').forEach(processElement);

    // This catches diagrams that are added to the page after it is loaded.
    // This might include comments from other users.
    document.addEventListener("animationstart", onElementInsert, false);
  });

}());
