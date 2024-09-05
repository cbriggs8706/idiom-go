import React from 'react'

function page() {
	return (
		<div>
			<iframe
				style={{ maxWidth: '100%' }}
				src="https://wordwall.net/embed/e5152eda9b53426880184aad3211391e?themeId=2&templateId=72&fontStackId=0"
				width="500"
				height="380"
				allowFullScreen
			></iframe>
			<iframe
				width="795"
				height="690"
				style={{ maxWidth: '100%' }}
				src="https://www.educaplay.com/game/20192081-testing.html"
			></iframe>
			<iframe
				style={{ maxWidth: '100%' }}
				src="https://wordwall.net/embed/0fa8f031270d4be9810339db3af73111?themeId=45&templateId=72&fontStackId=0"
				width="500"
				height="380"
			></iframe>
			<iframe
				allow="fullscreen; autoplay;"
				width="795"
				height="690"
				style={{ maxWidth: '100%' }}
				src="https://www.educaplay.com/game/20152314-testing.html"
			></iframe>
		</div>
	)
}

export default page
