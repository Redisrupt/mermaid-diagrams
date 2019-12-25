(function () {

  const $ = (selector, ctx = document) => [].slice.call(ctx.querySelectorAll(selector));

  function existingDiagramNode (elem) {
    return $('.mermaid', elem.parentElement)[0]
  }

  function setupChart(elem, code) {
    let existingDiagram = existingDiagramNode(elem)
    if (existingDiagram) {
      existingDiagram.innerHTML = code;
    } else {
      // Create the element that will house the rendered diagram.
      elem.insertAdjacentHTML('afterend', `<div class="mermaid">${code}</div>`);
      elem.style.display = 'none';
      existingDiagram = existingDiagramNode(elem)

      // Create an observer to track changes to the diagram code.
      const observer = new MutationObserver(() => { processElement(elem) });
      observer.observe(elem, { characterData: true });
    }

    try {
      // Generate or regenerate diagram if it is existing.
      window.mermaid.init();
    }
    catch(error) {
        existingDiagram.innerHTML = "Error when passing" + error;
    }
  };

  function processElement(elem) {
    if (elem.tagName == "CODE") {
      const code = elem.textContent;
      setupChart(elem.parentElement, code);
    } else if (elem.attributes["lang"] != null) {
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
    $('[lang="mermaid"]').forEach(processElement);
    $('.language-mermaid').forEach(processElement);

    // This catches diagrams that are added to the page after it is loaded.
    // This might include comments from other users.
    document.addEventListener("animationstart", onElementInsert, false);
  });

}());
