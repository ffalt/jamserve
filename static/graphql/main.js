window.addEventListener('load', function (event) {
	GraphQLPlayground.init(document.getElementById('root'), {
		"endpoint": "/graphql",
		"subscriptionEndpoint": "/graphql",
		"settings": {
			"general.betaUpdates": false,
			"editor.theme": "dark",
			"editor.cursorShape": "line",
			"editor.reuseHeaders": true,
			"tracing.hideTracingResponse": true,
			"queryPlan.hideQueryPlanResponse": true,
			"editor.fontSize": 14,
			"editor.fontFamily": "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
			"request.credentials": "same-origin"
		},
		"cdnUrl": "/graphql/playground",
		"canSaveConfig": false
	});

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.removedNodes.length) {
				mutation.removedNodes.forEach((node) => {
					if (
							node.tagName === "UL" &&
							node.classList.contains("CodeMirror-hints")
					) {
						if (!node.parentElement && mutation.target.parentElement) {
							mutation.target.parentElement.removeChild(mutation.target);
						}
					}
				});
			}
		});
	});
	observer.observe(document.body, {
		subtree: true,
		childList: true,
	});
});
