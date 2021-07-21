(function () {
	const $ = (selector, ctx = document) => [].slice.call(ctx.querySelectorAll(selector));

	let transformations = [];

	if (/github\.com/i.test(window.location.href)) {
		transformations = [
			{
				parentElementSelector: '[lang="mermaid"]',
				childElementSelector: 'code',
				diagramRegex: /(.+)/s
			}
		];
	}

	if (/dev\.azure\.com/i.test(window.location.href)) {
		transformations = [
			{
				parentElementSelector: 'div.markdown-content > pre.hljs',
				childElementSelector: 'code',
				diagramRegex: /^\s*((classDiagram|classDiagram-v2|erDiagram|flowchart|gitGraph|journey|gannt|graph|pie|requirementDiagram|sequenceDiagram|stateDiagram|stateDiagram-v2) ?.*)$/s
			}
		];
	}

	function renderChart(parentElem, code) {

		var source_name = parentElem.id;

		if (parentElem.id == "") {
			const postfix = Math.random().toString(36).substr(2, 9);
			source_name = 'idname_' + postfix;
			parentElem.id = source_name;
		}

		var mermaid_name = 'mermaid__' + source_name;
		let existingDiagram;
		let existingDiagrams = $(`#${mermaid_name}`);
		if (existingDiagrams.length > 0) {
			existingDiagram = existingDiagrams[0];
		}
		else {
			// Create the element that will house the rendered diagram.
			parentElem.insertAdjacentHTML('afterend', `<div id="${mermaid_name}"></div>`);
			existingDiagram = $(`#${mermaid_name}`)[0];

			// Create an observer to track changes to the diagram code.
			const observer = new MutationObserver(() => {
				processElement(parentElem);
			});
			observer.observe(parentElem, { characterData: true, childList: true, subtree: true });
		}

		try {
			const insertSvg = function (svg) {
				existingDiagram.innerHTML = svg;
			}
			// Generate or regenerate diagram if it is existing.
			window.mermaid.render(`${mermaid_name}_svg`, code, insertSvg);
		}
		catch (error) {
			console.error('>>> mermaid error', error);
			console.error('Code', code);
		}
	};

	function transformElement(parentElement, transformation) {
		const childElements = $(transformation.childElementSelector, parentElement);
		for (const childElement of childElements) {

			const diagramRegexMatch = transformation.diagramRegex.exec(childElement.innerText);
			if (diagramRegexMatch === null) {
				return;
			}

			code = diagramRegexMatch[1];
			renderChart(parentElement, code);
		}
	}

	function processElement(parentElement) {
		for (const transformation of transformations) {
			const matchingElements = $(transformation.parentElementSelector);
			if (matchingElements.includes(parentElement)) {
				transformElement(parentElement, transformation);
				break;
			}
		}
	}

	function processPage() {
		for (const transformation of transformations) {
			$(transformation.parentElementSelector).forEach(x => transformElement(x, transformation));
		}
	}

	function onElementInsert(event) {
		// We are only interested in the diagrams that trigger the css animation
		// called "mermaidDiagramCodeInserted". This is determined by the file
		// "on_change_animations.css".
		if (event.animationName !== "mermaidDiagramCodeInserted") {
			return;
		}
		processElement(event.target)
	}

	document.addEventListener('DOMContentLoaded', () => {
		processPage();

		// This catches diagrams that are added to the page after it is loaded.
		// This might include comments from other users.
		document.addEventListener("animationstart", onElementInsert, false);
	});

}());
