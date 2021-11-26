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
});
