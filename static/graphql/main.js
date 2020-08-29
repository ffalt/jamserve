window.addEventListener('load', function (event) {
	const loadingWrapper = document.getElementById('loading-wrapper');
	if (loadingWrapper) {
		loadingWrapper.classList.add('fadeOut');
	}
	const root = document.getElementById('root');
	root.classList.add('playgroundIn');
	GraphQLPlayground.init(root,
		{
			"endpoint": "/graphql",
			"subscriptionEndpoint": "/graphql",
			"version": "1.7.32",
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
});
