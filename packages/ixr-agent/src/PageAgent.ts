/**
 * Copyright (C) 2025 Alibaba Group Holding Limited
 * All rights reserved.
 */
import { type AgentConfig, IXRAgentCore } from '@ixr/core'
import { PageController, type PageControllerConfig } from '@ixr/page-controller'
import { Panel } from '@ixr/ui'

export * from '@ixr/core'

export type IXRAgentConfig = AgentConfig & PageControllerConfig

export class IXRAgent extends IXRAgentCore {
	panel: Panel

	constructor(config: IXRAgentConfig) {
		const pageController = new PageController({
			...config,
			enableMask: config.enableMask ?? true,
		})

		super({ ...config, pageController })

		this.panel = new Panel(this, {
			language: config.language,
		})
	}
}
