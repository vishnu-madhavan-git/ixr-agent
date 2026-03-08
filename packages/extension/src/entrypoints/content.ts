import { initPageController } from '@/agent/RemotePageController.content'

// import { DEMO_CONFIG } from '@/agent/constants'

const DEBUG_PREFIX = '[Content]'

export default defineContentScript({
	matches: ['<all_urls>'],
	runAt: 'document_end',

	main() {
		console.debug(`${DEBUG_PREFIX} Loaded on ${window.location.href}`)
		initPageController()

		// if auth token matches, expose agent to page
		chrome.storage.local.get('IXRAgentExtUserAuthToken').then((result) => {
			// extension side token.
			// @note this is isolated world. it is safe to assume user script cannot access it
			const extToken = result.IXRAgentExtUserAuthToken
			if (!extToken) return

			// page side token
			const pageToken = localStorage.getItem('IXRAgentExtUserAuthToken')
			if (!pageToken) return

			if (pageToken !== extToken) return

			console.log('[IXRAgentExt]: Auth tokens match. Exposing agent to page.')

			// add isolated world script
			exposeAgentToPage().then(
				// add main-world script
				() => injectScript('/main-world.js')
			)
		})
	},
})

async function exposeAgentToPage() {
	const { MultiIXRAgent } = await import('@/agent/MultiIXRAgent')
	console.log('[IXRAgentExt]: MultiIXRAgent loaded')

	/**
	 * singleton MultiIXRAgent to handle requests from the page
	 */
	let multiIXRAgent: InstanceType<typeof MultiIXRAgent> | null = null

	window.addEventListener('message', async (e) => {
		const data = e.data
		if (typeof data !== 'object' || data === null) return
		if (data.channel !== 'IXR_AGENT_EXT_REQUEST') return

		const { action, payload, id } = data

		switch (action) {
			case 'execute': {
				// singleton check
				if (multiIXRAgent && multiIXRAgent.status === 'running') {
					window.postMessage(
						{
							channel: 'IXR_AGENT_EXT_RESPONSE',
							id,
							action: 'execute_result',
							error: 'Agent is already running a task. Please wait until it finishes.',
						},
						'*'
					)
					return
				}

				try {
					const { task, config } = payload

					// Dispose old instance before creating new one
					multiIXRAgent?.dispose()

					multiIXRAgent = new MultiIXRAgent(config)

					// events

					multiIXRAgent.addEventListener('statuschange', (event) => {
						if (!multiIXRAgent) return
						window.postMessage(
							{
								channel: 'IXR_AGENT_EXT_RESPONSE',
								id,
								action: 'status_change_event',
								payload: multiIXRAgent.status,
							},
							'*'
						)
					})

					multiIXRAgent.addEventListener('activity', (event) => {
						if (!multiIXRAgent) return
						window.postMessage(
							{
								channel: 'IXR_AGENT_EXT_RESPONSE',
								id,
								action: 'activity_event',
								payload: (event as CustomEvent).detail,
							},
							'*'
						)
					})

					multiIXRAgent.addEventListener('historychange', (event) => {
						if (!multiIXRAgent) return
						window.postMessage(
							{
								channel: 'IXR_AGENT_EXT_RESPONSE',
								id,
								action: 'history_change_event',
								payload: multiIXRAgent.history,
							},
							'*'
						)
					})

					// result

					const result = await multiIXRAgent.execute(task)

					window.postMessage(
						{
							channel: 'IXR_AGENT_EXT_RESPONSE',
							id,
							action: 'execute_result',
							payload: result,
						},
						'*'
					)
				} catch (error) {
					window.postMessage(
						{
							channel: 'IXR_AGENT_EXT_RESPONSE',
							id,
							action: 'execute_result',
							error: (error as Error).message,
						},
						'*'
					)
				}

				break
			}

			case 'stop': {
				multiIXRAgent?.stop()
				break
			}

			default:
				console.warn(`${DEBUG_PREFIX} Unknown action from page:`, action)
				break
		}
	})
}
